// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 < 0.9.0;

import { Intent } from "../TypesAndDecoders.sol";

/// @title Intent Abstract Contract
/// @dev This contract defines the `execute` function to execute intents with no hooks and modifiers to check the
/// validity of intent root and target.
abstract contract IntentAbstract {
    /// @dev Intent root must be the msg sender.
    error InvalidRoot();
    /// @dev Intent target must be this contract.
    error InvalidTarget();

    /// @dev Modifier to check if the intent root is the msg sender.
    modifier validIntentRoot(Intent calldata intent) {
        if (intent.root != msg.sender) revert InvalidRoot();
        _;
    }

    /// @dev Modifier to check if the intent target is this contract.
    modifier validIntentTarget(Intent calldata intent) {
        if (intent.target != address(this)) revert InvalidTarget();
        _;
    }

    /// @notice Function to execute the intent and hook.
    /// @param intent Contains data related to intent.
    /// @return true if the intent is valid, reverts or returns false otherwise.
    function execute(Intent calldata intent) external virtual returns (bool);
}
