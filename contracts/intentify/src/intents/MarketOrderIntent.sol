// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import { console2 } from "forge-std/console2.sol";
import { ERC20 } from "solady/tokens/ERC20.sol";
import { Intent, Hook } from "../TypesAndDecoders.sol";
import { BytesLib } from "../libraries/BytesLib.sol";
import { ChainlinkDataFeedHelper } from "../helpers/ChainlinkDataFeedHelper.sol";
import { ExtractRevertReasonHelper } from "../helpers/ExtractRevertReasonHelper.sol";

contract MarketOrderIntent is ChainlinkDataFeedHelper, ExtractRevertReasonHelper {
    uint8 public constant chainlinkDecimals = 8;

    function execute(Intent calldata intent) external returns (bool) {
        require(intent.root == msg.sender, "MarketPurchaseOrderIntent:invalid-root");
        require(intent.target == address(this), "MarketPurchaseOrderIntent:invalid-target");

        (
            address tokenOut,
            address tokenIn,
            address tokenOutPriceFeed,
            address tokenInPriceFeed,
            uint256 tokenOutAmountExpected,
            uint32 tolerance,
            uint256 thresholdSeconds,
            bool isBuy
        ) = abi.decode(intent.data, (address, address, address, address, uint256, uint32, uint256, bool));

        int256 derivedPrice = _getDerivedPrice(
            tokenInPriceFeed, // base
            tokenOutPriceFeed, // quote
            chainlinkDecimals, // decimals response
            thresholdSeconds
        );

        uint8 tokenOutDecimals = ERC20(tokenOut).decimals();
        uint8 tokenInDecimals = ERC20(tokenIn).decimals();

        console2.log("tokenOutDecimals", tokenOutDecimals);
        console2.log("tokenInDecimals", tokenInDecimals);

        uint256 tokenInAmountEstimated = (tokenOutAmountExpected * uint256(derivedPrice) * 10 ** uint256(tokenOutDecimals))
                / (10 ** uint256(tokenInDecimals + chainlinkDecimals));
     
        console2.log("tokenInAmountEstimated", tokenInAmountEstimated);

        // @TODO: Hook Execution

        // @TODO: Final state check

        return true;
    }

    function encode(
        address tokenOut,
        address tokenIn,
        address tokenOutPriceFeed,
        address tokenInPriceFeed,
        uint256 amountInMin,
        uint32 tolerance,
        uint256 thresholdSeconds,
        bool isBuy
    )
        external
        pure
        returns (bytes memory data)
    {
        data = abi.encode(
            tokenOut, tokenIn, tokenOutPriceFeed, tokenInPriceFeed, amountInMin, tolerance, thresholdSeconds, isBuy
        );
    }

    function _hook(Hook calldata hook) internal returns (bool success) {
        bytes memory errorMessage;
        (success, errorMessage) = address(hook.target).call{ value: 0 }(hook.data);

        if (!success) {
            if (errorMessage.length > 0) {
                string memory reason = _extractRevertReason(errorMessage);
                revert(reason);
            } else {
                revert("MarketPurchaseOrderIntentHook:execution-failed");
            }
        }
    }
}
