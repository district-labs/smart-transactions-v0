// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import { ERC20 } from "solady/tokens/ERC20.sol";
import { Intent, Hook } from "../TypesAndDecoders.sol";
import { BytesLib } from "../libraries/BytesLib.sol";
import { ChainlinkDataFeedHelper } from "../helpers/ChainlinkDataFeedHelper.sol";
import { ExtractRevertReasonHelper } from "../helpers/ExtractRevertReasonHelper.sol";
import { ExecuteRootTransaction } from "./utils/ExecuteRootTransaction.sol";

contract MarketOrderIntent is ChainlinkDataFeedHelper, ExtractRevertReasonHelper, ExecuteRootTransaction {
    uint8 public constant chainlinkDecimals = 8;

    constructor(address _intentifySafeModule) ExecuteRootTransaction(_intentifySafeModule) { }

    function execute(Intent calldata intent, Hook calldata hook) external returns (bool) {
        require(intent.root == msg.sender, "MarketPurchaseOrderIntent:invalid-root");
        require(intent.target == address(this), "MarketPurchaseOrderIntent:invalid-target");

        (
            address tokenOut,
            address tokenIn,
            address tokenOutPriceFeed,
            address tokenInPriceFeed,
            uint256 tokenAmountExpected,
            uint256 thresholdSeconds,
            bool isBuy
        ) = abi.decode(intent.data, (address, address, address, address, uint256, uint256, bool));

        int256 derivedPrice;

        if (isBuy) {
            derivedPrice = _getDerivedPrice(
                tokenInPriceFeed, // base
                tokenOutPriceFeed, // quote
                chainlinkDecimals, // decimals response
                thresholdSeconds
            );
        } else {
            derivedPrice = _getDerivedPrice(
                tokenOutPriceFeed, // base
                tokenInPriceFeed, // quote
                chainlinkDecimals, // decimals response
                thresholdSeconds
            );
        }

        uint256 tokenAmountEstimated =
            _calculateTokenInAmountEstimated(tokenOut, tokenIn, tokenAmountExpected, derivedPrice, isBuy);

        _unlock(tokenAmountEstimated, intent, hook);

        return true;
    }

    function encode(
        address tokenOut,
        address tokenIn,
        address tokenOutPriceFeed,
        address tokenInPriceFeed,
        uint256 amountInMin,
        uint256 thresholdSeconds,
        bool isBuy
    )
        external
        pure
        returns (bytes memory data)
    {
        data = abi.encode(tokenOut, tokenIn, tokenOutPriceFeed, tokenInPriceFeed, amountInMin, thresholdSeconds, isBuy);
    }

    function _hook(Hook calldata hook) internal returns (bool success) {
        (, bytes memory hookTxData) = abi.decode(hook.data, (address, bytes));
        bytes memory errorMessage;
        (success, errorMessage) = address(hook.target).call{ value: 0 }(hookTxData);

        if (!success) {
            if (errorMessage.length > 0) {
                string memory reason = _extractRevertReason(errorMessage);
                revert(reason);
            } else {
                revert("MarketOrderIntentHook:execution-failed");
            }
        }
    }

    function _unlock(
        uint256 tokenAmountEstimated,
        Intent calldata intent,
        Hook calldata hook
    )
        internal
        returns (bool)
    {
        (address tokenOut, address tokenIn,,, uint256 tokenAmountExpected,, bool isBuy) =
            abi.decode(intent.data, (address, address, address, address, uint256, uint256, bool));

        (address searcher,) = abi.decode(hook.data, (address, bytes));

        uint256 initialTokenInBalance = ERC20(tokenIn).balanceOf(intent.root);

        _hook(hook);
        // The hook is expected to transfer the tokens to the intent root.
        // NOTICE: We can likely optimize by using the `transient storage` when available.

        uint256 tokenInBalanceDelta = ERC20(tokenIn).balanceOf(intent.root) - initialTokenInBalance;
        uint256 tokenAmountFromRoot;

        if (isBuy) {
            tokenAmountFromRoot = tokenAmountEstimated;
            require(
                tokenInBalanceDelta >= tokenAmountExpected, "MarketPurchaseOrderIntent:unlock:tokenIn:invalid-transfer"
            );
        } else {
            tokenAmountFromRoot = tokenAmountExpected;
            require(
                tokenInBalanceDelta >= tokenAmountEstimated, "MarketPurchaseOrderIntent:unlock:tokenIn:invalid-transfer"
            );
        }

        // Send the tokens to the hook executor.
        bytes memory data = abi.encodeWithSignature("transfer(address,uint256)", searcher, tokenAmountFromRoot);

        return executeFromRoot(tokenOut, 0, data);
    }

    function _calculateTokenInAmountEstimated(
        address tokenOut,
        address tokenIn,
        uint256 tokenAmountExpected,
        int256 derivedPrice,
        bool isBuy
    )
        internal
        view
        returns (uint256 tokenAmountEstimated)
    {
        uint8 tokenOutDecimals = ERC20(tokenOut).decimals();
        uint8 tokenInDecimals = ERC20(tokenIn).decimals();

        if (isBuy) {
            tokenAmountEstimated = (tokenAmountExpected * uint256(derivedPrice) * 10 ** uint256(tokenOutDecimals))
                / (10 ** uint256(tokenInDecimals + chainlinkDecimals));
        } else {
            tokenAmountEstimated = (tokenAmountExpected * uint256(derivedPrice) * 10 ** uint256(tokenInDecimals))
                / (10 ** uint256(tokenOutDecimals + chainlinkDecimals));
        }
    }
}
