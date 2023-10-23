// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { Intent, Hook } from "~/src/TypesAndDecoders.sol";
import { LimitOrderIntent } from "~/src/intents/LimitOrderIntent.sol";

contract LimitOrderIntentHarness is LimitOrderIntent {
    constructor(address _intentifySafeModule) LimitOrderIntent(_intentifySafeModule) { }

    function exposed_decodeHook(Hook calldata hook) external pure returns (address executor, bytes memory hookTxData) {
        return _decodeHook(hook);
    }

    function exposed_decodeIntent(Intent calldata intent)
        external
        pure
        returns (address tokenOut, address tokenIn, uint256 amountOutMax, uint256 amountInMin)
    {
        return _decodeIntent(intent);
    }

    function exposed_hook(Hook calldata hook) external returns (bool success) {
        return _hook(hook);
    }

    function exposed_unlock(
        Intent calldata intent,
        Hook calldata hook,
        uint256 initialTokenInBalance
    )
        external
        returns (bool)
    {
        return _unlock(intent, hook, initialTokenInBalance);
    }
}
