// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 < 0.9.0;

import { Intent, Hook } from "../TypesAndDecoders.sol";

/// @title IIntentWithHook Interface
/// @dev This interface defines the `execute` function to execute intents with hooks.
interface IIntentWithHook {
    /// @dev Intent root must be the msg sender.
    error InvalidRoot();
    /// @dev Intent target must be this contract.
    error InvalidTarget();

    /// @notice Function to execute the intent and hook.
    /// @param intent Contains data related to intent.
    /// @param hook Contains data related to hook.
    /// @return true if the intent is valid, reverts or returns false otherwise.
    function execute(Intent calldata intent, Hook calldata hook) external returns (bool);
}
