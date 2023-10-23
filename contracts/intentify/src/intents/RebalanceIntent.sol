// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import { ERC20 } from "solady/tokens/ERC20.sol";
import { Intent, Hook } from "../TypesAndDecoders.sol";
import { IntentWithHookAbstract } from "../abstracts/IntentWithHookAbstract.sol";
import { ExecuteRootTransaction } from "./utils/ExecuteRootTransaction.sol";
import { AggregatorV3Interface } from "@chainlink/v0.8/interfaces/AggregatorV3Interface.sol";

contract RebalanceIntent is IntentWithHookAbstract, ExecuteRootTransaction {
    struct RebalanceToken {
        address token;
        address tokenPriceFeed;
        // three decimals of precision
        uint24 weight;
    }

    /// @dev Rebalance weights must sum to 100% with 3 decimals of precision (100_000).
    error InvalidRebalanceWeights();

    /// @dev A token cannot have a weight of 0.
    error ZeroWeightRebalanceToken();

    /// @dev The user does not have any balance of the tokens to be rebalanced.
    error InsufficientInitialBalance();

    error InsufficientBalancePostHook(address token, uint256 balance, uint256 minBalance);

    constructor(address _intentifySafeModule) ExecuteRootTransaction(_intentifySafeModule) { }

    function encodeHook(address executor, bytes memory hookTxData) external pure returns (bytes memory data) {
        data = abi.encode(executor, hookTxData);
    }

    function encodeIntent(RebalanceToken[] memory rebalanceTokens) external pure returns (bytes memory) {
        return abi.encode(rebalanceTokens);
    }

    function _decodeHook(Hook calldata hook) internal pure returns (address executor, bytes memory hookTxData) {
        return abi.decode(hook.data, (address, bytes));
    }

    function _decodeIntent(Intent calldata intent) internal pure returns (RebalanceToken[] memory) {
        return abi.decode(intent.data, (RebalanceToken[]));
    }

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

    function _calculateExpectedTokenBalances(Intent calldata intent) internal view returns (uint256[] memory) {
        RebalanceToken[] memory rebalanceTokens = _decodeIntent(intent);
        uint256[] memory tokenMinBalances = new uint256[](rebalanceTokens.length);
        int256[] memory tokenPrices = new int256[](rebalanceTokens.length);

        uint256 totalWeight = 0;
        uint256 totalValue = 0;

        // Calculate the total value of the tokens to be rebalanced.
        // Ensure that the total weight is 100% with 3 decimals of precision (100_000).
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

        if (totalWeight != 100_000) {
            revert InvalidRebalanceWeights();
        }

        if (totalValue == 0) {
            revert InsufficientInitialBalance();
        }

        // Calculate the expected balance of each token after the rebalance.
        for (uint256 i = 0; i < rebalanceTokens.length; i++) {
            tokenMinBalances[i] = (
                totalValue * rebalanceTokens[i].weight * 10 ** ERC20(rebalanceTokens[i].token).decimals()
            ) / (100_000 * uint256(tokenPrices[i]));
        }

        return tokenMinBalances;
    }

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
            if (tokenMinBalances[i] > tokenBalance) {
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
