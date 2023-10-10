// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { console2 } from "forge-std/console2.sol";
import { Intent, Hook } from "../TypesAndDecoders.sol";
import { ExecuteRootTransaction } from "./utils/ExecuteRootTransaction.sol";
import { IPool } from "@aave/v3-core/interfaces/IPool.sol";
import { AggregatorV3Interface } from "chainlink/interfaces/AggregatorV3Interface.sol";
import { ISwapRouter } from "uniswap-v3-periphery/interfaces/ISwapRouter.sol";
import { IUniswapV3Pool } from "uniswap-v3-core/interfaces/IUniswapV3Pool.sol";
import { IUniswapV3Factory } from "uniswap-v3-core/interfaces/IUniswapV3Factory.sol";

interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function decimals() external view returns (uint256);
}

contract AaveLeverageLongIntent is ExecuteRootTransaction {
    address internal immutable pool;
    address internal immutable swapRouter;

    constructor(
        address _intentifySafeModule,
        address _pool,
        address _swapRouter
    )
        ExecuteRootTransaction(_intentifySafeModule)
    {
        pool = _pool;
        swapRouter = _swapRouter;
    }

    enum InterestRateMode {
        NONE,
        STABLE,
        VARIABLE
    }

    // 1. Lending Asset i.e. ETH/WETH
    // 2. Borrow Asset i.e. USDC or USDT
    // 3. Health Factor Minimum i.e. 1.2
    // 4. Health Factor Delta i.e. 0.2

    function encode(
        address priceFeed,
        address supplyAsset,
        address borrowAsset,
        uint256 interestRateMode,
        uint256 minHealthFactor,
        uint256 delta
    )
        external
        pure
        returns (bytes memory data)
    {
        return abi.encode(priceFeed, supplyAsset, borrowAsset, interestRateMode, minHealthFactor, delta);
    }

    function encodeHook(
        uint256 depositAmount,
        uint256 borrowAmount,
        bytes calldata hookData
    )
        external
        pure
        returns (bytes memory data)
    {
        return abi.encode(depositAmount, borrowAmount, hookData);
    }

    /**
     * How It Works
     * 1. ENFORCE: read root's current balance of the lending asset.
     * 2. ENFORCE: root current health factor from the Aave pool.
     * 3. HOOK: Add funds to root account via a flash loan i.e. ETH
     * 4. EXECUTE: Supply the lending asset to the Aave pool i.e. ETH
     * 5. EXECUTE: Borrow the borrowing asset from the Aave pool i.e. USDC
     * 6. EXECUTE: Repay the flash loan i.e. ETH by selling the borrowed asset i.e. USDC
     * 7. ENFORCE: root current health factor from the Aave pool.
     */

    function execute(Intent calldata intent, Hook calldata hook) external returns (bool) {
        require(intent.root == msg.sender, "TimestampIntent:invalid-root");
        require(intent.target == address(this), "TimestampIntent:invalid-target");

        (
            address priceFeed,
            address supplyAsset,
            address borrowAsset,
            uint256 interestRateMode,
            uint256 minHealthFactor,
            uint256 delta
        ) = abi.decode(intent.data, (address, address, address, uint256, uint256, uint256));

        // Before execution the health factor should be greater than the minimum health factor + delta.
        _checkHealthFactor(intent.root, minHealthFactor + delta);

        // ENFORCE: read root's current balance of the lending asset.
        uint256 balanceStart = IERC20(supplyAsset).balanceOf(intent.root);

        // HOOK: Release to the hook.
        // The expectation is that the hook will add funds to the root account.
        // Likely via a flash loan. But it could be any other mechanism.
        _hook(hook);
        _leverage(intent, hook);

        // Calculate how much of the borrowed asset must be returned.
        // Read the current price of the borrowed and suppled asset.
        // And send enough borrowed asset to repay the flash loan.
        // Keep the remaining borrowed asset as profit/leverage
        (uint256 depositAmount,,) = abi.decode(hook.data, (uint256, uint256, bytes));
        _repay(priceFeed, borrowAsset, supplyAsset, depositAmount);

        // After execution the health factor should be greater than the minimum health factor.
        _checkHealthFactor(intent.root, minHealthFactor);
        uint256 balanceEnd = IERC20(supplyAsset).balanceOf(intent.root);

        // ENFORCE: root's balance of the lending asset should be greater than the balance at the start of the
        // execution.
        require(balanceEnd >= balanceStart, "AaveLeverageLongIntent:insufficient-ending-balance");

        return true;
    }

    function _repay(address _priceFeed, address tokenIn, address tokenOut, uint256 exactAmountIn) internal {
        AggregatorV3Interface feed = AggregatorV3Interface(_priceFeed);
        uint256 priceFeedDecimals = feed.decimals();
        (, int256 price,,,) = feed.latestRoundData();
        uint256 usdcAmountOut = _calculateAmountOfToken2(
            uint256(price), exactAmountIn, IERC20(tokenIn).decimals(), IERC20(tokenOut).decimals(), priceFeedDecimals
        );

        uint256 derivedPrice = calculateSwapAmount(price, exactAmountIn, IERC20(tokenOut).decimals());

        console2.log("derivedPrice: %s", derivedPrice);
        console2.log("Price: %s", price);
        console2.log("Amount Out: %s", usdcAmountOut);
    }

    function calculateSwapAmount(int256 price, uint256 ethAmount, uint256 outDecimals) public view returns (uint256) {
        console2.log("Out Decimals: %s", outDecimals);
        console2.log("Price: %s", price);
        console2.log("ETH Amount: %s", ethAmount);
        return (ethAmount * (uint256(price)) / (10 ** (18 - outDecimals)));
    }


    function _calculateAmountOfToken2(
        uint256 price,
        uint256 amountOfToken1,
        uint256 decimalsToken1,
        uint256 decimalsToken2,
        uint256 decimalsPrice
    )
        public
        pure
        returns (uint256)
    {
        // Convert price to its smallest unit
        uint256 priceInSmallestUnit = price * (10 ** decimalsPrice);

        // Convert amountOfToken1 to its smallest unit
        uint256 amountOfToken1InSmallestUnit = amountOfToken1 * (10 ** decimalsToken1);

        // Multiply to get the raw amount in the smallest unit of token2
        uint256 rawAmountToken2 = (amountOfToken1InSmallestUnit * priceInSmallestUnit) / (10 ** decimalsToken1);

        // Convert the raw amount to the 6-decimal representation for USDC
        uint256 amountToken2 = rawAmountToken2 / (10 ** (decimalsToken1 + decimalsPrice - decimalsToken2));

        return amountToken2;
    }

    function _repay(address _priceFeed) internal {
        AggregatorV3Interface feed = AggregatorV3Interface(_priceFeed);
        uint256 priceFeedDecimals = feed.decimals();
        (, int256 price,,,) = feed.latestRoundData();
        console2.log("Price: %s", price);
        int256 normalizationFactor = int256(10 ** (18 - priceFeedDecimals)); // Assuming we want 2 decimal places
        console2.log("Normalized Price: %s", price * normalizationFactor);
    }

    // @TODO: Turn into a Safe Multicall
    function _leverage(Intent calldata intent, Hook calldata hook) internal {
        (, address supplyAsset, address borrowAsset, uint256 interestRateMode, uint256 minHealthFactor, uint256 delta) =
            abi.decode(intent.data, (address, address, address, uint256, uint256, uint256));
        (uint256 depositAmount, uint256 borrowAmount,) = abi.decode(hook.data, (uint256, uint256, bytes));

        bytes memory approveData = abi.encodeWithSignature("approve(address,uint256)", pool, depositAmount);
        executeFromRoot(supplyAsset, 0, approveData);

        // EXECUTE: Supply the lending asset to the Aave pool i.e. ETH
        // pool.deposit(supplyAsset, depositAmount, intent.root, 0);
        bytes memory depositData = abi.encodeWithSignature(
            "deposit(address,uint256,address,uint16)", supplyAsset, depositAmount, intent.root, 0
        );
        executeFromRoot(pool, 0, depositData);

        // EXECUTE: Borrow the borrowing asset from the Aave pool i.e. USDC
        // pool.borrow(borrowAsset, borrowAmount, interestRateMode, 0, intent.root);
        bytes memory borrowData = abi.encodeWithSignature(
            "borrow(address,uint256,uint256,uint16,address)",
            borrowAsset,
            borrowAmount,
            interestRateMode,
            0,
            intent.root
        );
        executeFromRoot(pool, 0, borrowData);
    }

    function _checkHealthFactor(address root, uint256 minHealthFactor) internal view {
        (,,,,, uint256 healthFactor) = IPool(pool).getUserAccountData(root);
        require(healthFactor >= minHealthFactor, "AaveLeverageLongIntent:insufficient-health-factor");
    }

    function _hook(Hook calldata hook) internal returns (bool success) {
        bytes memory errorMessage;
        (,, bytes memory hookData) = abi.decode(hook.data, (uint256, uint256, bytes));
        (success, errorMessage) = address(hook.target).call{ value: 0 }(hookData);

        if (!success) {
            if (errorMessage.length > 0) {
                string memory reason = _extractRevertReason(errorMessage);
                revert(reason);
            } else {
                revert("AaveLeverageLongIntent::hook-execution-failed");
            }
        }
    }

    function _extractRevertReason(bytes memory revertData) internal pure returns (string memory reason) {
        uint256 length = revertData.length;
        if (length < 68) return "";
        uint256 t;
        assembly {
            revertData := add(revertData, 4)
            t := mload(revertData) // Save the content of the length slot
            mstore(revertData, sub(length, 4)) // Set proper length
        }
        reason = abi.decode(revertData, (string));
        assembly {
            mstore(revertData, t) // Restore the content of the length slot
        }
    }
}
