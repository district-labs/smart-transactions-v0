// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import { ERC20 } from "solady/tokens/ERC20.sol";
import { Intent, Hook } from "../TypesAndDecoders.sol";
import { IntentWithHookAbstract } from "../abstracts/IntentWithHookAbstract.sol";
import { ExecuteRootTransaction } from "./utils/ExecuteRootTransaction.sol";
import { AggregatorV3Interface } from "@chainlink/v0.8/interfaces/AggregatorV3Interface.sol";

/// @title Rebalance Intent
/// @notice An intent to rebalance the tokens in the balance of a wallet given a set of tokens and weights.
contract RebalanceIntent is IntentWithHookAbstract, ExecuteRootTransaction {
    /*//////////////////////////////////////////////////////////////////////////
                                TYPE DECLARATIONS
    //////////////////////////////////////////////////////////////////////////*/

    struct RebalanceToken {
        address token;
        address tokenPriceFeed;
        // three decimals of precision
        uint24 weight;
    }

    /*//////////////////////////////////////////////////////////////////////////
                                  CONSTANTS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice The maximum weight of a token in the rebalance with 3 decimals of precision. All rebalance token weights
    /// must sum to 100% (MAX_WEIGHT).
    uint24 public constant MAX_WEIGHT = 100_000;

    /*//////////////////////////////////////////////////////////////////////////
                                CUSTOM ERRORS
    //////////////////////////////////////////////////////////////////////////*/

    /// @dev Rebalance weights must sum to 100% with 3 decimals of precision (MAX_WEIGHT).
    error InvalidRebalanceWeights();

    /// @dev There must be at least 2 tokens to rebalance.
    error InvalidRebalanceTokensAmount();

    /// @dev A token cannot have a weight of 0.
    error ZeroWeightRebalanceToken();

    /// @dev The user does not have any balance of the tokens to be rebalanced.
    error InsufficientInitialBalance();

    /// @dev The amount of tokens transferred to the intent root is less than the minimum amount expected.
    error InsufficientBalancePostHook(address token, uint256 balance, uint256 minBalance);

    /*//////////////////////////////////////////////////////////////////////////
                                CONSTRUCTOR
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Initialize the smart contract
    /// @param _intentifySafeModule The address of the Intentify Safe Module
    constructor(address _intentifySafeModule) ExecuteRootTransaction(_intentifySafeModule) { }

    /*//////////////////////////////////////////////////////////////////////////
                                READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Helper function to encode hook parameters into a byte array.
    /// @param executor The address of the hook executor.
    /// @param hookTxData The transaction data to be executed in the hook.
    /// @return data The encoded data.
    function encodeHook(address executor, bytes memory hookTxData) external pure returns (bytes memory data) {
        data = abi.encode(executor, hookTxData);
    }

    /// @notice Helper function to encode provided parameters into a byte array.
    /// @param rebalanceTokens The tokens to be rebalanced.
    /// @return data The encoded intent parameters.
    function encodeIntent(RebalanceToken[] memory rebalanceTokens) external pure returns (bytes memory) {
        return abi.encode(rebalanceTokens);
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
        uint256[] memory tokenMinBalances = _calculateExpectedTokenBalances(intent);

        _hook(hook);
        // The hook is expected to transfer the tokens to the intent root.
        // NOTICE: We can likely optimize by using the `transient storage` when available.

        _unlock(intent, hook, tokenMinBalances);

        return true;
    }

    /*//////////////////////////////////////////////////////////////////////////
                              INTERNAL READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Calculate the expected balance of each token after the rebalance.
    /// @param intent The intent to be executed.
    /// @return tokenMinBalances The expected balance of each token after the rebalance.
    function _calculateExpectedTokenBalances(Intent calldata intent) internal view returns (uint256[] memory) {
        RebalanceToken[] memory rebalanceTokens = _decodeIntent(intent);

        if (rebalanceTokens.length < 2) {
            revert InvalidRebalanceTokensAmount();
        }

        uint256[] memory tokenMinBalances = new uint256[](rebalanceTokens.length);
        int256[] memory tokenPrices = new int256[](rebalanceTokens.length);

        // Total weight of the tokens to be rebalanced. It must be 100% with 3 decimals of precision (MAX_WEIGHT).
        uint256 totalWeight = 0;

        // Total value of the tokens to be rebalanced in the base currency of the price feed. It has the amount of
        // decimals of precision of the price feed.
        // It must be greater than 0.
        uint256 totalValue = 0;

        // Calculate the total value of the tokens to be rebalanced.
        // Ensure that the total weight is 100% with 3 decimals of precision (MAX_WEIGHT).
        for (uint256 i = 0; i < rebalanceTokens.length; i++) {
            /// @dev The token cannot have a weight of 0.
            if (rebalanceTokens[i].weight == 0) {
                revert ZeroWeightRebalanceToken();
            }

            totalWeight += rebalanceTokens[i].weight;
            (, tokenPrices[i],,,) = AggregatorV3Interface(rebalanceTokens[i].tokenPriceFeed).latestRoundData();

            uint256 tokenBalance = ERC20(rebalanceTokens[i].token).balanceOf(intent.root);

            totalValue += (uint256(tokenPrices[i]) * tokenBalance) / (10 ** ERC20(rebalanceTokens[i].token).decimals());
        }

        if (totalWeight != MAX_WEIGHT) {
            revert InvalidRebalanceWeights();
        }

        if (totalValue == 0) {
            revert InsufficientInitialBalance();
        }

        // Calculate the expected balance of each token after the rebalance.
        for (uint256 i = 0; i < rebalanceTokens.length; i++) {
            tokenMinBalances[i] = (
                totalValue * rebalanceTokens[i].weight * 10 ** ERC20(rebalanceTokens[i].token).decimals()
            ) / (MAX_WEIGHT * uint256(tokenPrices[i]));
        }

        return tokenMinBalances;
    }

    /// @notice Helper function to decode hook parameters from a byte array.
    /// @param hook The hook to be decoded.
    /// @return executor The address of the hook executor.
    function _decodeHook(Hook calldata hook) internal pure returns (address executor, bytes memory hookTxData) {
        return abi.decode(hook.data, (address, bytes));
    }

    /// @notice Helper function to decode intent parameters from a byte array.
    /// @param intent The intent to be decoded.
    /// @return rebalanceTokens The tokens to be rebalanced.
    function _decodeIntent(Intent calldata intent) internal pure returns (RebalanceToken[] memory) {
        return abi.decode(intent.data, (RebalanceToken[]));
    }

    /*//////////////////////////////////////////////////////////////////////////
                              INTERNAL WRITE FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Execute the hook that sends the tokens to rebalance the balances in the intent root.
    /// @param hook The hook to be executed.
    /// @return success Whether the hook was executed successfully.
    function _hook(Hook calldata hook) internal returns (bool success) {
        (, bytes memory hookTxData) = _decodeHook(hook);
        bytes memory errorMessage;
        (success, errorMessage) = address(hook.target).call{ value: 0 }(hookTxData);
        if (!success) {
            if (errorMessage.length > 0) {
                _revertMessageReason(errorMessage);
            } else {
                revert HookExecutionFailed();
            }
        }
    }

    /// @notice Unlock the tokens to the hook executor if the balance of each rebalanced token is greater than the
    /// minimum balance.
    /// @param intent Contains data related to intent.
    /// @param hook Contains data related to hook.
    /// @param tokenMinBalances The minimum balance of each token after the rebalance.
    /// @return success Whether the tokens were unlocked successfully.
    function _unlock(
        Intent calldata intent,
        Hook calldata hook,
        uint256[] memory tokenMinBalances
    )
        internal
        returns (bool)
    {
        (address executor,) = _decodeHook(hook);
        RebalanceToken[] memory rebalanceTokens = _decodeIntent(intent);

        for (uint256 i = 0; i < rebalanceTokens.length; i++) {
            uint256 tokenBalance = ERC20(rebalanceTokens[i].token).balanceOf(intent.root);
            if (tokenBalance < tokenMinBalances[i]) {
                revert InsufficientBalancePostHook(rebalanceTokens[i].token, tokenBalance, tokenMinBalances[i]);
            }

            // Transfer the difference between the expected balance and the actual balance to the hook executor.
            if (tokenBalance - tokenMinBalances[i] > 0) {
                // Send the tokens to the hook executor.
                bytes memory data =
                    abi.encodeWithSignature("transfer(address,uint256)", executor, tokenBalance - tokenMinBalances[i]);
                executeFromRoot(rebalanceTokens[i].token, 0, data);
            }
        }
        return true;
    }
}
