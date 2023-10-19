// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import { IIntent } from "../interfaces/IIntent.sol";
import { Intent } from "../TypesAndDecoders.sol";

/// @title Timestamp Intent
/// @notice This intent is executed if the current block timestamp is within a range. Otherwise, it reverts.
contract TimestampIntent is IIntent {
    /*//////////////////////////////////////////////////////////////////////////
                                CUSTOM ERRORS
    //////////////////////////////////////////////////////////////////////////*/

    /// @dev The current block timestamp is greater than the maximum timestamp.
    error Expired();

    /// @dev The current block timestamp is less than the minimum timestamp.
    error Early();

    /*//////////////////////////////////////////////////////////////////////////
                                READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Helper function to encode intent parameters into a byte array.
    /// @param minTimestamp The minimum timestamp the intent can be executed.
    /// @param maxTimestamp The maximum timestamp the intent can be executed.
    /// @return data The encoded parameters.
    function encodeIntent(uint128 minTimestamp, uint128 maxTimestamp) external pure returns (bytes memory data) {
        data = abi.encode(minTimestamp, maxTimestamp);
    }

    /*//////////////////////////////////////////////////////////////////////////
                                   WRITE FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @inheritdoc IIntent
    function execute(Intent calldata intent) external view returns (bool) {
        if (intent.root != msg.sender) revert InvalidRoot();
        if (intent.target != address(this)) revert InvalidTarget();

        (uint128 minTimestamp, uint128 maxTimestamp) = _decodeIntent(intent);

        if (block.timestamp > maxTimestamp) {
            revert Expired();
        } else if (block.timestamp < minTimestamp) {
            revert Early();
        }

        return true;
    }

    /*//////////////////////////////////////////////////////////////////////////
                              INTERNAL READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Helper function to decode intent parameters from a byte array.
    function _decodeIntent(Intent calldata intent) internal pure returns (uint128 minTimestamp, uint128 maxTimestamp) {
        return abi.decode(intent.data, (uint128, uint128));
    }
}
