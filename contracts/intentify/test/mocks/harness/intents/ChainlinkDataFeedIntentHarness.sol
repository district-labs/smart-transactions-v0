// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { Intent, Hook } from "~/src/TypesAndDecoders.sol";
import { ChainlinkDataFeedIntent } from "~/src/intents/ChainlinkDataFeedIntent.sol";

contract ChainlinkDataFeedIntentHarness is ChainlinkDataFeedIntent {
    function exposed_decodeIntent(Intent calldata intent)
        external
        pure
        returns (address dataFeed, int256 minValue, int256 maxValue, uint256 thresholdSeconds)
    {
        return _decodeIntent(intent);
    }
}
