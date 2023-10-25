// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { Intent, Hook } from "~/src/TypesAndDecoders.sol";
import { UniswapV3TwapIntent } from "~/src/intents/UniswapV3TwapIntent.sol";

contract UniswapV3TwapIntentHarness is UniswapV3TwapIntent {
    function exposed_decodeIntent(Intent calldata intent)
        external
        pure
        returns (address uniswapV3Pool, uint32 twapIntervalSeconds, uint256 minPriceX96, uint256 maxPriceX96)
    {
        return _decodeIntent(intent);
    }

    function exposed_getTwapX96(
        address uniswapV3Pool,
        uint32 twapIntervalSeconds
    )
        external
        view
        returns (uint256 priceX96)
    {
        return _getTwapX96(uniswapV3Pool, twapIntervalSeconds);
    }
}
