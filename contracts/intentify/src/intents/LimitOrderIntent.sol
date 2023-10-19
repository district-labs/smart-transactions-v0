// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import { ERC20 } from "solady/tokens/ERC20.sol";
import { Intent, Hook } from "../TypesAndDecoders.sol";
import { IIntentWithHook } from "../interfaces/IIntentWithHook.sol";
import { ExecuteRootTransaction } from "./utils/ExecuteRootTransaction.sol";
import { ExtractRevertReasonHelper } from "../helpers/ExtractRevertReasonHelper.sol";

/// @title Limit Order Intent
/// @notice An intent to execute a limit order at the rate defined by the user at the time of the intent creation.
contract LimitOrderIntent is IIntentWithHook, ExecuteRootTransaction, ExtractRevertReasonHelper {
    /*//////////////////////////////////////////////////////////////////////////
                                CUSTOM ERRORS
    //////////////////////////////////////////////////////////////////////////*/

    /// @dev The amount of tokens transferred to the intent root is less than the minimum amount expected.
    error InsufficientInputAmount(uint256 amount, uint256 amountInMin);

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
    /// @param tokenOut The token to be sold.
    /// @param tokenIn The token to be purchased.
    /// @param amountOutMax The maximum amount of tokens to be sold.
    /// @param amountInMin The minimum amount of tokens to be purchased.
    /// @return data The encoded parameters.
    function encodeIntent(
        address tokenOut,
        address tokenIn,
        uint256 amountOutMax,
        uint256 amountInMin
    )
        external
        pure
        returns (bytes memory data)
    {
        data = abi.encode(tokenOut, tokenIn, amountOutMax, amountInMin);
    }

    /*//////////////////////////////////////////////////////////////////////////
                                   WRITE FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @inheritdoc IIntentWithHook
    function execute(Intent calldata intent, Hook calldata hook) external returns (bool) {
        if (intent.root != msg.sender) revert InvalidRoot();
        if (intent.target != address(this)) revert InvalidTarget();

        (, address tokenIn,,) = _decodeIntent(intent);

        uint256 initialTokenInBalance = ERC20(tokenIn).balanceOf(intent.root);

        _hook(hook);
        // The hook is expected to transfer the tokens to the intent root.
        // NOTICE: We can likely optimize by using the `transient storage` when available.

        _unlock(intent, hook, initialTokenInBalance);

        return true;
    }

    /*//////////////////////////////////////////////////////////////////////////
                              INTERNAL READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Helper function to decode intent parameters from a byte array.
    function _decodeIntent(Intent calldata intent)
        internal
        pure
        returns (address tokenOut, address tokenIn, uint256 amountOutMax, uint256 amountInMin)
    {
        (tokenOut, tokenIn, amountOutMax, amountInMin) = abi.decode(intent.data, (address, address, uint256, uint256));
    }

    /// @notice Execute the hook that sends the tokenIn to the user.
    /// @param hook The hook to be executed.
    function _hook(Hook calldata hook) internal returns (bool success) {
        bytes memory errorMessage;
        (, bytes memory hookTxData) = abi.decode(hook.data, (address, bytes));
        (success, errorMessage) = address(hook.target).call{ value: 0 }(hookTxData);

        if (!success) {
            if (errorMessage.length > 0) {
                string memory reason = _extractRevertReason(errorMessage);
                revert(reason);
            } else {
                revert HookExecutionFailed();
            }
        }
    }

    /// @notice Unlock the tokenOut to the hook executor if conditions are met
    /// @param intent Contains data related to intent.
    /// @param hook Contains data related to hook.
    /// @param initialTokenInBalance The initial tokenIn balance of the intent root.
    function _unlock(
        Intent calldata intent,
        Hook calldata hook,
        uint256 initialTokenInBalance
    )
        internal
        returns (bool)
    {
        (address tokenOut, address tokenIn, uint256 amountOutMax, uint256 amountInMin) = _decodeIntent(intent);

        uint256 amountIn = ERC20(tokenIn).balanceOf(intent.root) - initialTokenInBalance;
        (address executor,) = abi.decode(hook.data, (address, bytes));

        if (amountIn < amountInMin) revert InsufficientInputAmount(amountIn, amountInMin);

        bytes memory txData = abi.encodeWithSignature("transfer(address,uint256)", executor, amountOutMax);
        return executeFromRoot(tokenOut, 0, txData);
    }
}
