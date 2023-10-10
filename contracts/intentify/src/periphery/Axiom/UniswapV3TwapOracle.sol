// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { IAxiomV1Query } from "axiom-v1/contracts/interfaces/IAxiomV1Query.sol";
import { Oracle } from "@uniswap/v3-core/contracts/libraries/Oracle.sol";

struct AxiomResponseStruct {
    bytes32 keccakBlockResponse;
    bytes32 keccakAccountResponse;
    bytes32 keccakStorageResponse;
    IAxiomV1Query.BlockResponse[] blockResponses;
    IAxiomV1Query.AccountResponse[] accountResponses;
    IAxiomV1Query.StorageResponse[] storageResponses;
}

contract UniswapV3TwapOracle {
    IAxiomV1Query public axiomV1Query;

    event ObservationStored(address indexed pool, uint256 blockNumber);

    mapping(bytes32 => Oracle.Observation) public observations;

    constructor(address _axiomV1QueryAddress) {
        axiomV1Query = IAxiomV1Query(_axiomV1QueryAddress);
    }

    function storeObservations(AxiomResponseStruct calldata axiomResponse) external {
        _validateData(axiomResponse);

        for (uint256 i = 0; i < axiomResponse.storageResponses.length; i++) {
            // Ensure the slot is correct (slot 8 = observations array)
            require(axiomResponse.storageResponses[i].slot == 8, "Invalid Slot");

            Oracle.Observation memory observation = _unpackObservation(axiomResponse.storageResponses[i].value);

            observations[keccak256(
                abi.encode(axiomResponse.storageResponses[i].addr, axiomResponse.storageResponses[i].blockNumber)
            )] = observation;

            emit ObservationStored(
                axiomResponse.storageResponses[i].addr, axiomResponse.storageResponses[i].blockNumber
            );
        }
    }

    function getUniswapV3TWAP(
        address poolAddress,
        uint256 startBlockNumber,
        uint256 endBlockNumber
    )
        external
        view
        returns (
            int24 twaTick,
            uint160 twaLiquidity,
            Oracle.Observation memory startObservation,
            Oracle.Observation memory endObservation
        )
    {
        (startObservation, endObservation) = _getObservations(poolAddress, startBlockNumber, endBlockNumber);
        (twaTick, twaLiquidity) = _calculateTwaTickLiquidity(startObservation, endObservation);
    }

    function _validateData(AxiomResponseStruct calldata axiomResponse) internal view {
        require(
            axiomV1Query.areResponsesValid(
                axiomResponse.keccakBlockResponse,
                axiomResponse.keccakAccountResponse,
                axiomResponse.keccakStorageResponse,
                axiomResponse.blockResponses,
                axiomResponse.accountResponses,
                axiomResponse.storageResponses
            ),
            "Invalid Proof"
        );

        require(axiomResponse.storageResponses.length > 0, "No Storage Responses");
    }

    function _unpackObservation(uint256 observation) internal pure returns (Oracle.Observation memory) {
        return Oracle.Observation({
            blockTimestamp: uint32(observation),
            tickCumulative: int56(uint56(observation >> 32)),
            secondsPerLiquidityCumulativeX128: uint160(observation >> 88),
            initialized: true
        });
    }

    function _getObservations(
        address poolAddress,
        uint256 startBlockNumber,
        uint256 endBlockNumber
    )
        internal
        view
        returns (Oracle.Observation memory startObservation, Oracle.Observation memory endObservation)
    {
        startObservation = observations[keccak256(abi.encode(poolAddress, startBlockNumber))];
        endObservation = observations[keccak256(abi.encode(poolAddress, endBlockNumber))];

        require(startObservation.blockTimestamp != 0 && endObservation.blockTimestamp != 0, "Observation Not Stored");
    }

    function _calculateTwaTickLiquidity(
        Oracle.Observation memory startObservation,
        Oracle.Observation memory endObservation
    )
        internal
        pure
        returns (int24 twaTick, uint160 twaLiquidity)
    {
        require(startObservation.blockTimestamp < endObservation.blockTimestamp, "Invalid Observation Order");
        uint32 secondsElapsed = endObservation.blockTimestamp - startObservation.blockTimestamp;

        twaTick =
            int24((endObservation.tickCumulative - startObservation.tickCumulative) / int56(uint56(secondsElapsed)));
        twaLiquidity = ((uint160(1) << 128) * secondsElapsed)
            / (endObservation.secondsPerLiquidityCumulativeX128 - startObservation.secondsPerLiquidityCumulativeX128);
    }
}
