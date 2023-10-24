// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { Intent, Hook } from "~/src/TypesAndDecoders.sol";
import { ERC20SwapSpotPriceIntent } from "~/src/intents/ERC20SwapSpotPriceIntent.sol";

contract ERC20SwapSpotPriceIntentHarness is ERC20SwapSpotPriceIntent {
    constructor(address _intentifySafeModule) ERC20SwapSpotPriceIntent(_intentifySafeModule) { }

    function exposed_calculateTokenInAmountEstimated(
        address tokenOut,
        address tokenIn,
        uint256 tokenAmountExpected,
        int256 derivedPrice,
        bool isBuy
    )
        external
        view
        returns (uint256 tokenAmountEstimated)
    {
        return _calculateTokenInAmountEstimated(tokenOut, tokenIn, tokenAmountExpected, derivedPrice, isBuy);
    }

    function exposed_decodeHook(Hook calldata hook) external pure returns (address executor, bytes memory hookTxData) {
        return _decodeHook(hook);
    }

    function exposed_decodeIntent(Intent calldata intent)
        external
        pure
        returns (
            address tokenOut,
            address tokenIn,
            address tokenOutPriceFeed,
            address tokenInPriceFeed,
            uint256 tokenAmountExpected,
            uint256 thresholdSeconds,
            bool isBuy
        )
    {
        return _decodeIntent(intent);
    }

    function exposed_hook(Hook calldata hook) external returns (bool success) {
        return _hook(hook);
    }

    function exposed_unlock(
        Intent calldata intent,
        Hook calldata hook,
        uint256 tokenAmountEstimated,
        uint256 initialTokenInBalance
    )
        external
        returns (bool)
    {
        return _unlock(intent, hook, tokenAmountEstimated, initialTokenInBalance);
    }
}
