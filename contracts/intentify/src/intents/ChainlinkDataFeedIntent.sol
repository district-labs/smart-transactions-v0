// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import { AggregatorV3Interface } from "@chainlink/v0.8/interfaces/AggregatorV3Interface.sol";
import { IIntent } from "../interfaces/IIntent.sol";
import { Intent } from "../TypesAndDecoders.sol";

/// @title Chainlink Data Feed Intent
/// @notice This intent is used to check the value of a Chainlink data feed is within a range and the data is not stale
/// given a threshold.
contract ChainlinkDataFeedIntent is IIntent {
    /*//////////////////////////////////////////////////////////////////////////
                                CUSTOM ERRORS
    //////////////////////////////////////////////////////////////////////////*/

    /// @dev Data older than the threshold.
    error StaleData();

    /// @dev Data lower than the minimum value.
    error LowValue();

    /// @dev Data higher than the maximum value.
    error HighValue();

    /*//////////////////////////////////////////////////////////////////////////
                                READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Helper function to encode intent parameters into a byte array.
    /// @param dataFeed The address of the Chainlink data feed.
    /// @param minValue The minimum value the data feed can have.
    /// @param maxValue The maximum value the data feed can have.
    /// @param thresholdSeconds The maximum number of seconds the data feed can be stale.
    /// @return data The encoded data.
    function encodeIntent(
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

    /*//////////////////////////////////////////////////////////////////////////
                                   WRITE FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @inheritdoc IIntent
    function execute(Intent calldata intent) external view returns (bool) {
        if (intent.root != msg.sender) revert InvalidRoot();
        if (intent.target != address(this)) revert InvalidTarget();

        (address dataFeed, int256 minValue, int256 maxValue, uint256 thresholdSeconds) = _decodeIntent(intent);

        (, int256 answer,, uint256 updatedAt,) = AggregatorV3Interface(dataFeed).latestRoundData();

        uint256 dataAgeSeconds = block.timestamp - updatedAt;
        if (dataAgeSeconds > thresholdSeconds) {
            revert StaleData();
        }

        if (answer < int256(minValue)) {
            revert LowValue();
        }

        if (answer > int256(maxValue)) {
            revert HighValue();
        }

        return true;
    }

    /*//////////////////////////////////////////////////////////////////////////
                              INTERNAL READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Helper function to decode intent parameters from a byte array.
    /// @param intent The intent.
    /// @return dataFeed The address of the Chainlink data feed.
    /// @return minValue The minimum value the data feed can have.
    /// @return maxValue The maximum value the data feed can have.
    /// @return thresholdSeconds The maximum number of seconds the data feed can be stale.
    function _decodeIntent(Intent calldata intent)
        internal
        pure
        returns (address dataFeed, int256 minValue, int256 maxValue, uint256 thresholdSeconds)
    {
        return abi.decode(intent.data, (address, int256, int256, uint256));
    }
}
