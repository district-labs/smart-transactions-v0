// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { Intent } from "~/src/TypesAndDecoders.sol";
import { TimestampIntent } from "~/src/intents/TimestampIntent.sol";

contract TimestampIntentHarness is TimestampIntent {
    function exposed_decodeIntent(Intent calldata intent)
        external
        pure
        returns (uint128 minTimestamp, uint128 maxTimestamp)
    {
        return _decodeIntent(intent);
    }
}
