// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import { ERC20 } from "solady/tokens/ERC20.sol";
import { Intent, Hook } from "../TypesAndDecoders.sol";
import { IntentWithHookAbstract } from "../abstracts/IntentWithHookAbstract.sol";
import { ChainlinkDataFeedHelper } from "../helpers/ChainlinkDataFeedHelper.sol";
import { ExecuteRootTransaction } from "./utils/ExecuteRootTransaction.sol";

/// @title ERC20 Swap Spot Price Exact Token Out Intent
/// @notice An intent to execute a swap of ERC20 tokens at the current spot price providing the exact amount of tokens
/// to be soold.
contract ERC20SwapSpotPriceBalanceTokenOutIntent is
    IntentWithHookAbstract,
    ExecuteRootTransaction,
    ChainlinkDataFeedHelper
{
    /*//////////////////////////////////////////////////////////////////////////
                                CUSTOM ERRORS
    //////////////////////////////////////////////////////////////////////////*/

    /// @dev The amount of tokens transferred to the intent root is less than the minimum amount expected.
    error InsufficientBalance();

    /*//////////////////////////////////////////////////////////////////////////
                                  CONSTANTS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice The number of decimals returned by the derived price of Chainlink price feeds.
    uint8 private constant _CHAINLINK_DECIMALS = 8;

    /*//////////////////////////////////////////////////////////////////////////
                                CUSTOM ERRORS
    //////////////////////////////////////////////////////////////////////////*/

    /// @dev The amount of tokens transferred to the intent root is less than the minimum amount expected.
    error InvalidTokenInTransfer(uint256 tokenInDeltaBalance, uint256 tokenInAmountExpected);

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
    /// @return data The encoded data.
    function encodeHookInstructions(address executor) external pure returns (bytes memory data) {
        data = abi.encode(executor);
    }

    /// @notice Helper function to encode provided parameters into a byte array.
    /// @param tokenOut The token to be sold.
    /// @param tokenIn The token to be purchased.
    /// @param tokenOutPriceFeed The Chainlink price feed for the token to be sold.
    /// @param tokenInPriceFeed The Chainlink price feed for the token to be purchased.
    /// @param thresholdSeconds The number of seconds of tolerance for freshness of the price feed.
    /// @param minBalance The minimum balance to be maintained in the root smart wallet.
    /// @param balanceDelta The difference from the minimum balance before a deposit is triggered.
    function encodeIntent(
        address tokenOut,
        address tokenIn,
        address tokenOutPriceFeed,
        address tokenInPriceFeed,
        uint256 thresholdSeconds,
        uint256 minBalance,
        uint256 balanceDelta
    )
        external
        pure
        returns (bytes memory data)
    {
        data = abi.encode(
            tokenOut, tokenIn, tokenOutPriceFeed, tokenInPriceFeed, thresholdSeconds, minBalance, balanceDelta
        );
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
        // Run the transfer pre-checks i.e. token balances, prices and converion rates.
        (uint256 tokenOutBalance, uint256 initialTokenInBalance, uint256 tokenInAmount) = _preCheck(intent);

        // The hook is expected to transfer the `tokenIn` and `tokenInAmount` to the intent root.
        _hook(hook);

        // Validates the amount of tokens transferred to the intent root.
        // And sends the `tokenOut` and `tokenOutBalance` to the hook executor.
        _unlock(intent, hook, tokenOutBalance, tokenInAmount, initialTokenInBalance);

        return true;
    }

    /*//////////////////////////////////////////////////////////////////////////
                              INTERNAL READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Calculate the estimated amount of tokens to be purchased. Based on the price of the tokens.
    /// @param tokenOut The token to be sold.
    /// @param tokenIn The token to be purchased.
    /// @param tokenOutAmount The amount of tokens to be sold.
    /// @param derivedPrice The derived price of the two tokens.
    /// @return tokenInAmount The estimated amount of tokens to be purchased.
    function _calculateTokenInAmount(
        address tokenOut,
        address tokenIn,
        uint256 tokenOutAmount,
        int256 derivedPrice
    )
        internal
        view
        returns (uint256 tokenInAmount)
    {
        tokenInAmount = (tokenOutAmount * uint256(derivedPrice) * 10 ** uint256(ERC20(tokenIn).decimals()))
            / (10 ** uint256(ERC20(tokenOut).decimals() + _CHAINLINK_DECIMALS));
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
    /// @return tokenOutPriceFeed The Chainlink price feed for the token to be sold.
    /// @return tokenInPriceFeed The Chainlink price feed for the token to be purchased.
    /// @return thresholdSeconds The number of seconds of tolerance for freshness of the price feed.
    /// @return minBalance The minimum balance to be maintained in the root smart wallet.
    /// @return balanceDelta The difference from the minimum balance before a deposit is triggered.
    function _decodeIntent(Intent calldata intent)
        internal
        pure
        returns (
            address tokenOut,
            address tokenIn,
            address tokenOutPriceFeed,
            address tokenInPriceFeed,
            uint256 thresholdSeconds,
            uint256 minBalance,
            uint256 balanceDelta
        )
    {
        return abi.decode(intent.data, (address, address, address, address, uint256, uint256, uint256));
    }

    /*//////////////////////////////////////////////////////////////////////////
                              INTERNAL WRITE FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/
    /// @notice Unlock the tokenOut to the hook executor if conditions are met
    /// @param intent Contains data related to intent.
    function _preCheck(Intent calldata intent) internal view returns (uint256, uint256, uint256) {
        (
            address tokenOut,
            address tokenIn,
            address tokenOutPriceFeed,
            address tokenInPriceFeed,
            uint256 thresholdSeconds,
            uint256 minBalance,
            uint256 balanceDelta
        ) = _decodeIntent(intent);

        int256 derivedPrice = _getDerivedPrice(
            tokenOutPriceFeed, // quote
            tokenInPriceFeed, // base
            _CHAINLINK_DECIMALS, // decimals response
            thresholdSeconds
        );

        uint256 tokenOutBalance = ERC20(tokenOut).balanceOf(intent.root);

        // Check if the current token out balance is above the minimum balance + the balance delta
        if (tokenOutBalance < (minBalance + balanceDelta)) {
            revert InsufficientBalance();
        }

        uint256 initialTokenInBalance = ERC20(tokenIn).balanceOf(intent.root);
        uint256 tokenInAmount = _calculateTokenInAmount(tokenOut, tokenIn, tokenOutBalance, derivedPrice);
        return (tokenOutBalance, initialTokenInBalance, tokenInAmount);
    }

    /// @notice Execute the hook that sends the tokenIn to the user.
    /// @param hook Contains data related to hook.
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

    /// @notice Unlock the tokenOut to the hook executor if conditions are met
    /// @param intent Contains data related to intent.
    /// @param hook Contains data related to hook.
    /// @param tokenInAmount The estimated amount of tokens to be purchased.
    /// @param initialTokenInBalance The initial balance of the tokenIn in the intent root.
    /// @return success Whether the unlock was successful or not.
    function _unlock(
        Intent calldata intent,
        Hook calldata hook,
        uint256 tokenOutAmount,
        uint256 tokenInAmount,
        uint256 initialTokenInBalance
    )
        internal
        returns (bool)
    {
        (address tokenOut, address tokenIn,,,,,) = _decodeIntent(intent);
        address executor = _decodeHookInstructions(hook);
        uint256 tokenInBalanceDelta = ERC20(tokenIn).balanceOf(intent.root) - initialTokenInBalance;

        if (tokenInBalanceDelta < tokenInAmount) {
            revert InvalidTokenInTransfer(tokenInBalanceDelta, tokenInAmount);
        }

        // Send the tokens to the hook executor.
        bytes memory data = abi.encodeWithSelector(ERC20.transfer.selector, executor, tokenOutAmount);

        return executeFromRoot(tokenOut, 0, data);
    }
}
