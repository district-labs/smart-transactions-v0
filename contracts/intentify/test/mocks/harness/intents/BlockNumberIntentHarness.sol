// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { Intent, Hook } from "~/src/TypesAndDecoders.sol";
import { BlockNumberIntent } from "~/src/intents/BlockNumberIntent.sol";

contract BlockNumberIntentHarness is BlockNumberIntent {
    function exposed_decodeIntent(Intent calldata intent)
        external
        pure
        returns (uint128 minBlockNumber, uint128 maxBlockNumber)
    {
        return _decodeIntent(intent);
    }
}
