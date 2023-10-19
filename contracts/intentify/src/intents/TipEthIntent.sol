// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import { Intent, Hook } from "../TypesAndDecoders.sol";
import { IIntentWithHook } from "../interfaces/IIntentWithHook.sol";
import { ExecuteRootTransaction } from "./utils/ExecuteRootTransaction.sol";

/// @title Tip Eth Intent
/// @notice An intent that allows the intent root to tip the hook executor with ETH.
contract TipEthIntent is IIntentWithHook, ExecuteRootTransaction {
    /*//////////////////////////////////////////////////////////////////////////
                                CONSTRUCTOR
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Initialize the smart contract
    /// @param _intentifySafeModule The address of the Intentify Safe Module
    constructor(address _intentifySafeModule) ExecuteRootTransaction(_intentifySafeModule) { }

    /*//////////////////////////////////////////////////////////////////////////
                                READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Helper function to encode intent parameters into a byte array.
    /// @param amount The amount of ETH to be tipped.
    /// @return data The encoded parameters.
    function encodeIntent(uint256 amount) external pure returns (bytes memory) {
        return abi.encode(amount);
    }

    /*//////////////////////////////////////////////////////////////////////////
                                   WRITE FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @inheritdoc IIntentWithHook
    function execute(Intent calldata intent, Hook calldata hook) external returns (bool) {
        if (intent.root != msg.sender) revert InvalidRoot();
        if (intent.target != address(this)) revert InvalidTarget();

        (uint256 amount) = _decodeIntent(intent);
        return executeFromRoot(hook.target, amount, new bytes(0));
    }

    /*//////////////////////////////////////////////////////////////////////////
                              INTERNAL READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Helper function to decode intent parameters from a byte array.
    /// @param intent The intent to decode.
    /// @return amount The amount of ETH to be tipped.
    function _decodeIntent(Intent calldata intent) internal pure returns (uint256 amount) {
        return abi.decode(intent.data, (uint256));
    }
}
