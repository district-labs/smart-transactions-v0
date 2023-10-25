// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { Intent, Hook } from "~/src/TypesAndDecoders.sol";
import { EthTipIntent } from "~/src/intents/EthTipIntent.sol";

contract EthTipIntentHarness is EthTipIntent {
    constructor(address _intentifySafeModule) EthTipIntent(_intentifySafeModule) { }

    function exposed_decodeIntent(Intent calldata intent) external pure returns (uint256 amount) {
        return _decodeIntent(intent);
    }
}
