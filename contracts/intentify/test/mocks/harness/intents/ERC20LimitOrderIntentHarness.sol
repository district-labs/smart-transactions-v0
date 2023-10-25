// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { Intent, Hook } from "~/src/TypesAndDecoders.sol";
import { ERC20LimitOrderIntent } from "~/src/intents/ERC20LimitOrderIntent.sol";

contract ERC20LimitOrderIntentHarness is ERC20LimitOrderIntent {
    constructor(address _intentifySafeModule) ERC20LimitOrderIntent(_intentifySafeModule) { }

    function exposed_decodeHookInstructions(Hook calldata hook) external pure returns (address executor) {
        return _decodeHookInstructions(hook);
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
