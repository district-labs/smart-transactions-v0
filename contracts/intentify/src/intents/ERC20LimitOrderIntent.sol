// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import { ERC20 } from "solady/tokens/ERC20.sol";
import { Intent, Hook } from "../TypesAndDecoders.sol";
import { IntentWithHookAbstract } from "../abstracts/IntentWithHookAbstract.sol";
import { ExecuteRootTransaction } from "./utils/ExecuteRootTransaction.sol";

/// @title ERC20 Limit Order Intent
/// @notice An intent to execute a limit order of ERC20 tokens at the rate defined by the user at the time of the intent
/// creation.
contract ERC20LimitOrderIntent is IntentWithHookAbstract, ExecuteRootTransaction {
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

    /// @notice Helper function to encode hook instruction parameters into a byte array.
    /// @param executor The address of the hook executor.
    /// @return instructions The encoded instructions.
    function encodeHookInstructions(address executor) external pure returns (bytes memory instructions) {
        return abi.encode(executor);
    }

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

    /// @notice Helper function to decode hook instructions parameters from a byte array.
    /// @param hook The hook to be decoded.
    /// @return executor The address of the hook executor.
    function _decodeHookInstructions(Hook calldata hook) internal pure returns (address executor) {
        return abi.decode(hook.instructions, (address));
    }

    /// @notice Helper function to decode intent parameters from a byte array.
    /// @param intent The intent to be decoded.
    /// @return tokenOut The token to be sold.
    /// @return tokenIn The token to be purchased.
    /// @return amountOutMax The maximum amount of tokens to be sold.
    /// @return amountInMin The minimum amount of tokens to be purchased.
    function _decodeIntent(Intent calldata intent)
        internal
        pure
        returns (address tokenOut, address tokenIn, uint256 amountOutMax, uint256 amountInMin)
    {
        return abi.decode(intent.data, (address, address, uint256, uint256));
    }

    /// @notice Execute the hook that sends the tokenIn to the user.
    /// @param hook The hook to be executed.
    function _hook(Hook calldata hook) internal returns (bool success) {
        bytes memory errorMessage;
        (success, errorMessage) = address(hook.target).call{ value: 0 }(hook.data);

        if (!success) {
            if (errorMessage.length > 0) {
                _revertMessageReason(errorMessage);
            } else {
                revert HookExecutionFailed();
            }
        }
    }

    /// @notice Unlock the tokenOut to the hook executor if the amountIn is greater than the amountInMin.
    /// @param intent Contains data related to intent.
    /// @param hook Contains data related to hook.
    function _unlock(
        Intent calldata intent,
        Hook calldata hook,
        uint256 initialTokenInBalance
    )
        internal
        returns (bool)
    {
        (address tokenOut, address tokenIn, uint256 amountOutMax, uint256 amountInMin) = _decodeIntent(intent);
        address executor = _decodeHookInstructions(hook);

        uint256 amountIn = ERC20(tokenIn).balanceOf(intent.root) - initialTokenInBalance;

        if (amountIn < amountInMin) revert InsufficientInputAmount(amountIn, amountInMin);

        bytes memory txData = abi.encodeWithSignature("transfer(address,uint256)", executor, amountOutMax);
        return executeFromRoot(tokenOut, 0, txData);
    }
}
