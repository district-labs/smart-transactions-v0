// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import { IntentAbstract } from "../abstracts/IntentAbstract.sol";
import { Intent } from "../TypesAndDecoders.sol";

/// @title Block Number Intent
/// @notice This intent is executed if the current block number is within a range. Otherwise, it reverts.
contract BlockNumberIntent is IntentAbstract {
    /*//////////////////////////////////////////////////////////////////////////
                                CUSTOM ERRORS
    //////////////////////////////////////////////////////////////////////////*/

    /// @dev The current block block number is greater than the maximum block number.
    error Expired();

    /// @dev The current block block number is less than the minimum block number.
    error Early();

    /*//////////////////////////////////////////////////////////////////////////
                                READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Helper function to encode intent parameters into a byte array.
    /// @param minBlockNumber The minimum block number the intent can be executed.
    /// @param maxBlockNumber The maximum block number the intent can be executed.
    /// @return data The encoded parameters.
    function encodeIntent(uint128 minBlockNumber, uint128 maxBlockNumber) external pure returns (bytes memory data) {
        data = abi.encode(minBlockNumber, maxBlockNumber);
    }

    /*//////////////////////////////////////////////////////////////////////////
                                   WRITE FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @inheritdoc IntentAbstract
    function execute(Intent calldata intent)
        external
        view
        override
        validIntentRoot(intent)
        validIntentTarget(intent)
        returns (bool)
    {
        (uint128 minBlockNumber, uint128 maxBlockNumber) = _decodeIntent(intent);

        if (block.number > maxBlockNumber) {
            revert Expired();
        } else if (block.number < minBlockNumber) {
            revert Early();
        }

        return true;
    }

    /*//////////////////////////////////////////////////////////////////////////
                              INTERNAL READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Helper function to decode intent parameters from a byte array.
    function _decodeIntent(Intent calldata intent)
        internal
        pure
        returns (uint128 minBlockNumber, uint128 maxBlockNumber)
    {
        return abi.decode(intent.data, (uint128, uint128));
    }
}
