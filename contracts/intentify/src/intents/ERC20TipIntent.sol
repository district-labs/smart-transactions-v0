// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import { ERC20 } from "solady/tokens/ERC20.sol";
import { Intent, Hook } from "../TypesAndDecoders.sol";
import { IntentWithHookAbstract } from "../abstracts/IntentWithHookAbstract.sol";
import { ExecuteRootTransaction } from "./utils/ExecuteRootTransaction.sol";

/// @title ERC20 Tip Intent
/// @notice An intent that allows the intent root to tip the hook executor with ERC20 tokens.
contract ERC20TipIntent is IntentWithHookAbstract, ExecuteRootTransaction {
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
    /// @param amount The amount of the ERC20 token to be tipped.
    /// @param token The address of the ERC20 token to be tipped.
    /// @return data The encoded parameters.
    function encodeIntent(address token, uint256 amount) external pure returns (bytes memory) {
        return abi.encode(token, amount);
    }

    /*//////////////////////////////////////////////////////////////////////////
                                   WRITE FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @inheritdoc IntentWithHookAbstract
    function execute(
        Intent calldata intent,
        Hook calldata hook
    )
        external
        override
        validIntentRoot(intent)
        validIntentTarget(intent)
        returns (bool)
    {
        (address token, uint256 amount) = _decodeIntent(intent);

        // Transfer the ERC20 tokens to the hook target.
        bytes memory data = abi.encodeWithSelector(ERC20.transfer.selector, hook.target, amount);
        return executeFromRoot(token, 0, data);
    }

    /*//////////////////////////////////////////////////////////////////////////
                              INTERNAL READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Helper function to decode intent parameters from a byte array.
    /// @param intent The intent to decode.
    /// @return token The address of the ERC20 token to be tipped.
    /// @return amount The amount of the ERC20 token to be tipped.
    function _decodeIntent(Intent calldata intent) internal pure returns (address token, uint256 amount) {
        return abi.decode(intent.data, (address, uint256));
    }
}
