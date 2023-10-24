// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { Intent, Hook } from "~/src/TypesAndDecoders.sol";
import { UniswapV3HistoricalTwapIntent } from "~/src/intents/UniswapV3HistoricalTwapIntent.sol";

contract UniswapV3HistoricalTwapIntentHarness is UniswapV3HistoricalTwapIntent {
    constructor(address _uniswapV3TwapOracleAddress) UniswapV3HistoricalTwapIntent(_uniswapV3TwapOracleAddress) { }

    function exposed_checkBlocksRange(BlockData memory numerator, BlockData memory denominator) external view {
        return _checkBlocksRange(numerator, denominator);
    }

    function exposed_checkBlockWindow(BlockData memory blockData) external view {
        return _checkBlockWindow(blockData);
    }

    function exposed_checkPercentageDifference(Intent calldata intent, Hook calldata hook) external view {
        return _checkPercentageDifference(intent, hook);
    }

    function exposed_decodeHook(Hook calldata hook)
        external
        pure
        returns (
            uint256 numeratorStartBlock,
            uint256 numeratorEndBlock,
            uint256 denominatorStartBlock,
            uint256 denominatorEndBlock
        )
    {
        return _decodeHook(hook);
    }

    function exposed_decodeIntent(Intent calldata intent)
        external
        pure
        returns (
            address uniswapV3Pool,
            uint256 numeratorReferenceBlockOffset,
            uint256 numeratorBlockWindow,
            uint256 numeratorBlockWindowTolerance,
            uint256 denominatorReferenceBlockOffset,
            uint256 denominatorBlockWindow,
            uint256 denominatorBlockWindowTolerance,
            uint256 minPercentageDifference,
            uint256 maxPercentageDifference
        )
    {
        return _decodeIntent(intent);
    }
}
