// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import { IAxiomV1Query } from "axiom-v1/contracts/interfaces/IAxiomV1Query.sol";
import { Oracle } from "@uniswap/v3-core/contracts/libraries/Oracle.sol";
import { AxiomResponseStruct } from "./AxiomStructs.sol";

/// @title Uniswap V3 Twap Oracle
/// @notice A contract that stores historical Uniswap V3 observations proved by ZK proofs using Axiom and calculates
/// time weighted average ticks and time weighted average inverse liquidity
/// @dev This contract is intended to be used in combination with an off-chain system that provides proofs for new
/// observations
contract UniswapV3TwapOracle {
    /*//////////////////////////////////////////////////////////////////////////
                                CUSTOM ERRORS
    //////////////////////////////////////////////////////////////////////////*/

    /// @dev observation not yet stored under the observations mapping
    error ObservationNotStored(address pool, uint256 blockNumber);

    /// @dev slot not equal to POOL_OBSERVATIONS_SLOT
    error InvalidSlot();

    /// @dev start observation block number is greater than the end observation block number
    error InvalidObservationOrder();

    /// @dev Axiom ZK Proof Response is invalid
    error InvalidProof();

    /// @dev No storage responses found in the Axiom ZK Proof Response
    error NoStorageResponses();

    /*//////////////////////////////////////////////////////////////////////////
                                   EVENTS
    //////////////////////////////////////////////////////////////////////////*/

    event ObservationStored(address indexed pool, uint256 blockNumber);

    /*//////////////////////////////////////////////////////////////////////////
                                PUBLIC STORAGE
    //////////////////////////////////////////////////////////////////////////*/

    IAxiomV1Query public axiomV1Query;

    /// @notice Mapping of keccak256(poolAddress, blockNumber) => observation
    /// @dev observation.blockNumber == 0 indicates that the observation is not yet initialized
    mapping(bytes32 observationHash => Oracle.Observation observation) public observations;

    /*//////////////////////////////////////////////////////////////////////////
                                  CONSTANTS
    //////////////////////////////////////////////////////////////////////////*/

    uint8 private constant POOL_OBSERVATIONS_SLOT = 8;

    /*//////////////////////////////////////////////////////////////////////////
                                CONSTRUCTOR
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Initialize the smart contract
    /// @param _axiomV1QueryAddress The address of the AxiomV1Query contract
    constructor(address _axiomV1QueryAddress) {
        axiomV1Query = IAxiomV1Query(_axiomV1QueryAddress);
    }

    /*//////////////////////////////////////////////////////////////////////////
                                READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Get the observation for a given pool and block number
    /// @param poolAddress The address of the pool
    /// @param blockNumber The block number of the observation
    /// @return observation The observation struct
    function getObservation(
        address poolAddress,
        uint256 blockNumber
    )
        public
        view
        returns (Oracle.Observation memory observation)
    {
        observation = observations[_getObservationHash(poolAddress, blockNumber)];
        if (observation.blockTimestamp == 0) {
            revert ObservationNotStored(poolAddress, blockNumber);
        }
    }

    /// @notice Get the time weighted average tick for a given pool and block number range
    /// @param poolAddress The address of the pool
    /// @param startBlockNumber The start block number of the range
    /// @param endBlockNumber The end block number of the range
    /// @return twaTick The time weighted average tick
    /// @return startObservation The observation at the start block number
    /// @return endObservation The observation at the end block number
    function getTwaTick(
        address poolAddress,
        uint256 startBlockNumber,
        uint256 endBlockNumber
    )
        external
        view
        returns (int24 twaTick, Oracle.Observation memory startObservation, Oracle.Observation memory endObservation)
    {
        startObservation = getObservation(poolAddress, startBlockNumber);
        endObservation = getObservation(poolAddress, endBlockNumber);

        twaTick = _calculateTwaTick(startObservation, endObservation);
    }

    /// @notice Get the time weighted average inverse liquidity for a given pool and block number range
    /// @param poolAddress The address of the pool
    /// @param startBlockNumber The start block number of the range
    /// @param endBlockNumber The end block number of the range
    /// @return twaLiquidity The time weighted average inverse liquidity
    /// @return startObservation The observation at the start block number
    /// @return endObservation The observation at the end block number
    function getTwaLiquidity(
        address poolAddress,
        uint256 startBlockNumber,
        uint256 endBlockNumber
    )
        external
        view
        returns (
            uint160 twaLiquidity,
            Oracle.Observation memory startObservation,
            Oracle.Observation memory endObservation
        )
    {
        startObservation = getObservation(poolAddress, startBlockNumber);
        endObservation = getObservation(poolAddress, endBlockNumber);

        twaLiquidity = _calculateTwaLiquidity(startObservation, endObservation);
    }

    /*//////////////////////////////////////////////////////////////////////////
                                   WRITE FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Store observations from an Axiom ZK Proof Response into observations mapping
    /// @dev The Axiom ZK Proof must be validated before calling this function
    /// @param axiomResponse The Axiom ZK Proof Response
    function storeObservations(AxiomResponseStruct calldata axiomResponse) external {
        // Ensure the Axiom ZK Proof is valid
        _validateAxiomData(axiomResponse);

        for (uint256 i = 0; i < axiomResponse.storageResponses.length; i++) {
            // Ensure the slot is correct (slot POOL_OBSERVATIONS_SLOT = observations array)
            if (axiomResponse.storageResponses[i].slot != POOL_OBSERVATIONS_SLOT) {
                revert InvalidSlot();
            }

            Oracle.Observation memory observation = _unpackObservation(axiomResponse.storageResponses[i].value);

            observations[_getObservationHash(
                axiomResponse.storageResponses[i].addr, axiomResponse.storageResponses[i].blockNumber
            )] = observation;

            emit ObservationStored(
                axiomResponse.storageResponses[i].addr, axiomResponse.storageResponses[i].blockNumber
            );
        }
    }

    /*//////////////////////////////////////////////////////////////////////////
                              INTERNAL READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Calculate the time weighted average inverse liquidity for a given observation range
    /// @param startObservation The observation at the start block number
    /// @param endObservation The observation at the end block number
    /// @return twaLiquidity The time weighted average inverse liquidity
    function _calculateTwaLiquidity(
        Oracle.Observation memory startObservation,
        Oracle.Observation memory endObservation
    )
        internal
        pure
        returns (uint160 twaLiquidity)
    {
        if (startObservation.blockTimestamp >= endObservation.blockTimestamp) {
            revert InvalidObservationOrder();
        }
        uint32 secondsElapsed = endObservation.blockTimestamp - startObservation.blockTimestamp;

        twaLiquidity = ((uint160(1) << 128) * secondsElapsed)
            / (endObservation.secondsPerLiquidityCumulativeX128 - startObservation.secondsPerLiquidityCumulativeX128);
    }

    /// @notice Calculate the time weighted average tick for a given observation range
    /// @param startObservation The observation at the start block number
    /// @param endObservation The observation at the end block number
    /// @return twaTick The time weighted average tick
    function _calculateTwaTick(
        Oracle.Observation memory startObservation,
        Oracle.Observation memory endObservation
    )
        internal
        pure
        returns (int24 twaTick)
    {
        if (startObservation.blockTimestamp >= endObservation.blockTimestamp) {
            revert InvalidObservationOrder();
        }
        uint32 secondsElapsed = endObservation.blockTimestamp - startObservation.blockTimestamp;

        twaTick =
            int24((endObservation.tickCumulative - startObservation.tickCumulative) / int56(uint56(secondsElapsed)));
    }

    /// @notice Get the observation hash for a given pool and block number
    /// @param poolAddress The address of the pool
    /// @param blockNumber The block number of the observation
    /// @return observationHash The observation hash
    function _getObservationHash(address poolAddress, uint256 blockNumber) internal pure returns (bytes32) {
        return keccak256(abi.encode(poolAddress, blockNumber));
    }

    /// @notice Unpack an observation from a storage response value
    /// @param observation The observation uint256 storage response value
    /// @return observation The unpacked observation struct
    function _unpackObservation(uint256 observation) internal pure returns (Oracle.Observation memory) {
        return Oracle.Observation({
            blockTimestamp: uint32(observation),
            tickCumulative: int56(uint56(observation >> 32)),
            secondsPerLiquidityCumulativeX128: uint160(observation >> 88),
            initialized: true
        });
    }

    /// @notice Validate the Axiom ZK Proof Response. Reverts if the proof is invalid or if there are no storage
    /// responses
    /// @param axiomResponse The Axiom ZK Proof Response
    function _validateAxiomData(AxiomResponseStruct calldata axiomResponse) internal view returns (bool isValidProof) {
        isValidProof = axiomV1Query.areResponsesValid(
            axiomResponse.keccakBlockResponse,
            axiomResponse.keccakAccountResponse,
            axiomResponse.keccakStorageResponse,
            axiomResponse.blockResponses,
            axiomResponse.accountResponses,
            axiomResponse.storageResponses
        );

        if (!isValidProof) {
            revert InvalidProof();
        }

        if (axiomResponse.storageResponses.length == 0) {
            revert NoStorageResponses();
        }
    }
}
