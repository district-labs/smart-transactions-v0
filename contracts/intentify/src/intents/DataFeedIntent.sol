// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { AggregatorV3Interface } from "@chainlink/v0.8/interfaces/AggregatorV3Interface.sol";
import { IHook } from "../interfaces/IHook.sol";
import { Intent } from "../TypesAndDecoders.sol";
import { BytesLib } from "../libraries/BytesLib.sol";

contract DataFeedIntent is IHook {
    function execute(Intent calldata intent) external view returns (bool) {
        require(intent.root == msg.sender, "DataFeedIntent:invalid-root");
        require(intent.target == address(this), "DataFeedIntent:invalid-target");

        (address dataFeed, int256 minValue, int256 maxValue, uint256 thresholdSeconds) =
            abi.decode(intent.data, (address, int256, int256, uint256));

        (, int256 answer,, uint256 updatedAt,) = AggregatorV3Interface(dataFeed).latestRoundData();

        if (block.timestamp - updatedAt > thresholdSeconds) {
            revert("DataFeedIntent:stale-data");
        }

        if (answer < int256(minValue)) {
            revert("DataFeedIntent:low-value");
        }

        if (answer > int256(maxValue)) {
            revert("DataFeedIntent:high-value");
        }

        return true;
    }

    function encode(
        address dataFeed,
        int256 minValue,
        int256 maxValue,
        uint256 thresholdSeconds
    )
        external
        pure
        returns (bytes memory data)
    {
        data = abi.encode(dataFeed, minValue, maxValue, thresholdSeconds);
    }
}
