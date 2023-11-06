// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import { ERC20 } from "solady/tokens/ERC20.sol";
import { ERC4626 } from "solady/tokens/ERC4626.sol";
import { Intent, Hook } from "../TypesAndDecoders.sol";
import { IntentAbstract } from "../abstracts/IntentAbstract.sol";
import { ExecuteRootTransaction } from "./utils/ExecuteRootTransaction.sol";

/// @title ERC4626 Deposit Continious
/// @notice Continiously deposit ERC4626 tokens to a vault if the balance is above a certain threshold.
contract ERC4626DepositBalanceContinualIntent is IntentAbstract, ExecuteRootTransaction {
    /*//////////////////////////////////////////////////////////////////////////
                                CUSTOM ERRORS
    //////////////////////////////////////////////////////////////////////////*/

    /// @dev The amount of tokens transferred to the intent root is less than the minimum amount expected.
    error InsufficientBalance();

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
    /// @param vault Vault to deposit tokens in.
    /// @param minBalance The minimum balance to be maintained in the root smart wallet.
    /// @param balanceDelta The difference from the minimum balance before a deposit is triggered.
    function encodeIntent(
        address vault,
        uint256 minBalance,
        uint256 balanceDelta
    )
        external
        pure
        returns (bytes memory data)
    {
        data = abi.encode(vault, minBalance, balanceDelta);
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
        (address vault, uint256 minBalance, uint256 balanceDelta) = _decodeIntent(intent);

        // Get the underlying asset of the vault.
        // This is the token that will be deposited and balance we check.
        address tokenOut = ERC4626(vault).asset();
        uint256 tokenOutAmount = ERC20(tokenOut).balanceOf(address(this));

        // Check if the balance is above the minimum balance + the balance delta
        if (tokenOutAmount < (minBalance + balanceDelta)) {
            revert InsufficientBalance();
        }

        uint256 depositAmount = tokenOutAmount - minBalance;

        bytes memory txData = abi.encodeWithSelector(ERC4626.deposit.selector, depositAmount, intent.root);
        executeFromRoot(vault, 0, txData);

        return true;
    }

    /*//////////////////////////////////////////////////////////////////////////
                              INTERNAL READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Helper function to decode intent parameters from a byte array.
    /// @param intent The intent to be decoded.
    /// @return vault Vault to deposit tokens in.
    /// @param minBalance The minimum balance to be maintained in the root smart wallet.
    /// @param balanceDelta The difference from the minimum balance before a deposit is triggered.
    function _decodeIntent(Intent calldata intent)
        internal
        pure
        returns (address vault, uint256 minBalance, uint256 balanceDelta)
    {
        return abi.decode(intent.data, (address, uint256, uint256));
    }
}
