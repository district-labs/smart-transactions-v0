// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { Intent } from "~/src/TypesAndDecoders.sol";
import { ERC20TipIntent } from "~/src/intents/ERC20TipIntent.sol";

contract ERC20TipIntentHarness is ERC20TipIntent {
    constructor(address _intentifySafeModule) ERC20TipIntent(_intentifySafeModule) { }

    function exposed_decodeIntent(Intent calldata intent) external pure returns (address token, uint256 amount) {
        return _decodeIntent(intent);
    }
}
