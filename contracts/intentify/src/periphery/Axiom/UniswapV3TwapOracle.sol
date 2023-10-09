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

    constructor(address _axiomV1QueryAddress) {
        axiomV1Query = IAxiomV1Query(_axiomV1QueryAddress);
    }

    function _validateData(AxiomResponseStruct calldata axiomResponse) internal view {

        bool valid = axiomV1Query.areResponsesValid(
            axiomResponse.keccakBlockResponse,
            axiomResponse.keccakAccountResponse,
            axiomResponse.keccakStorageResponse,
            axiomResponse.blockResponses,
            axiomResponse.accountResponses,
            axiomResponse.storageResponses
        );
        require(valid, "Invalid Proof");

        require(axiomResponse.storageResponses.length == 2, "Invalid Storage Response Length");

        uint256 startBlockNumber = axiomResponse.storageResponses[0].blockNumber;
        uint256 endBlockNumber = axiomResponse.storageResponses[1].blockNumber;

        // Validates that the endBlockNumber is greater than the startBlockNumber
        require(endBlockNumber > startBlockNumber, "Invalid Block Number");
    }

    function _unpackObservation(uint256 observation) internal pure returns (Oracle.Observation memory) {
        // observation` (31 bytes) is single field element, concatenation of `secondsPerLiquidityCumulativeX128 .
        // tickCumulative . blockTimestamp`
        return Oracle.Observation({
            blockTimestamp: uint32(observation),
            tickCumulative: int56(uint56(observation >> 32)),
            secondsPerLiquidityCumulativeX128: uint160(observation >> 88),
            initialized: true
        });
    }

    function verifyUniswapV3TWAP(AxiomResponseStruct calldata axiomResponse)
        external
        view
        returns (
            int56 twaTick,
            uint160 twaLiquidity,
            Oracle.Observation memory startObservation,
            Oracle.Observation memory endObservation
        )
    {
        _validateData(axiomResponse);

        startObservation = _unpackObservation(axiomResponse.storageResponses[0].value);
        endObservation = _unpackObservation(axiomResponse.storageResponses[1].value);
        uint32 secondsElapsed = endObservation.blockTimestamp - startObservation.blockTimestamp;
        // floor division
        twaTick = (endObservation.tickCumulative - startObservation.tickCumulative) / int56(uint56(secondsElapsed));
        // floor division
        twaLiquidity = ((uint160(1) << 128) * secondsElapsed)
            / (endObservation.secondsPerLiquidityCumulativeX128 - startObservation.secondsPerLiquidityCumulativeX128);
    }
}
