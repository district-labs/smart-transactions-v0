// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { Intent, Hook } from "~/src/TypesAndDecoders.sol";
import { TipEthIntent } from "~/src/intents/TipEthIntent.sol";

contract TipEthIntentHarness is TipEthIntent {
    constructor(address _intentifySafeModule) TipEthIntent(_intentifySafeModule) { }

    function exposed_decodeIntent(Intent calldata intent) external pure returns (uint256 amount) {
        return _decodeIntent(intent);
    }
}
