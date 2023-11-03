// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import { ERC20 } from "solady/tokens/ERC20.sol";
import { Intent, Hook } from "../TypesAndDecoders.sol";
import { IntentAbstract } from "../abstracts/IntentAbstract.sol";
import { ExecuteRootTransaction } from "./utils/ExecuteRootTransaction.sol";

/// @title ERC20 Transfer
/// @notice An intent to transfer ERC20 tokens from the intent root.
contract ERC20TransferIntent is IntentAbstract, ExecuteRootTransaction {
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
    /// @param tokenOut The token to be transferred.
    /// @param amountOut The amount of tokens to be transferred.
    /// @param to Recipient of the tokens.
    function encodeIntent(address tokenOut, uint256 amountOut, address to) external pure returns (bytes memory data) {
        data = abi.encode(tokenOut, amountOut, to);
    }

    /*//////////////////////////////////////////////////////////////////////////
                                   WRITE FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @inheritdoc IntentAbstract
    function execute(Intent calldata intent)
        external
        override
        validIntentRoot(intent)
        validIntentTarget(intent)
        returns (bool)
    {
        (address tokenOut, uint256 amountOut, address to) = _decodeIntent(intent);

        bytes memory txData = abi.encodeWithSignature("transfer(address,uint256)", to, amountOut);
        executeFromRoot(tokenOut, 0, txData);

        return true;
    }

    /*//////////////////////////////////////////////////////////////////////////
                              INTERNAL READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Helper function to decode intent parameters from a byte array.
    /// @param intent The intent to be decoded.
    /// @return tokenOut The token to be transferred.
    /// @return amountOut The amount of tokens to be transferred.
    /// @param to Recipient of the tokens.
    function _decodeIntent(Intent calldata intent)
        internal
        pure
        returns (address tokenOut, uint256 amountOut, address to)
    {
        return abi.decode(intent.data, (address, uint256, address));
    }
}
