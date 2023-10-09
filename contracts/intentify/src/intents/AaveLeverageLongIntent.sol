// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { Intent, Hook } from "../TypesAndDecoders.sol";
import { ExecuteRootTransaction } from "./utils/ExecuteRootTransaction.sol";
import { IPool } from "@aave/v3-core/interfaces/IPool.sol";

interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract AaveLeverageLongIntent is ExecuteRootTransaction {
    IPool internal pool;

    constructor(address _intentifySafeModule, address _pool) ExecuteRootTransaction(_intentifySafeModule) {
        pool = IPool(_pool);
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
        return abi.encode(supplyAsset, borrowAsset, interestRateMode, minHealthFactor, delta);
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

        (address supplyAsset, address borrowAsset, uint256 interestRateMode, uint256 minHealthFactor, uint256 delta) =
            abi.decode(intent.data, (address, address, uint256, uint256, uint256));

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

        // After execution the health factor should be greater than the minimum health factor.
        _checkHealthFactor(intent.root, minHealthFactor);
        uint256 balanceEnd = IERC20(supplyAsset).balanceOf(intent.root);

        // ENFORCE: root's balance of the lending asset should be greater than the balance at the start of the
        // execution.
        require(balanceEnd >= balanceStart, "AaveLeverageLongIntent:insufficient-ending-balance");

        return true;
    }

    function _leverage(Intent calldata intent, Hook calldata hook) internal {
        (address supplyAsset, address borrowAsset, uint256 interestRateMode, uint256 minHealthFactor, uint256 delta) =
            abi.decode(intent.data, (address, address, uint256, uint256, uint256));
        (uint256 depositAmount, uint256 borrowAmount,) = abi.decode(hook.data, (uint256, uint256, bytes));

        bytes memory approveData = abi.encodeWithSignature("approve(address,uint256)", address(pool), depositAmount);
        executeFromRoot(supplyAsset, 0, approveData);

        // EXECUTE: Supply the lending asset to the Aave pool i.e. ETH
        // pool.deposit(supplyAsset, depositAmount, intent.root, 0);
        bytes memory depositData = abi.encodeWithSignature(
            "deposit(address,uint256,address,uint16)", supplyAsset, depositAmount, intent.root, 0
        );
        executeFromRoot(address(pool), 0, depositData);

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
        executeFromRoot(address(pool), 0, borrowData);
    }

    function _checkHealthFactor(address root, uint256 minHealthFactor) internal view {
        (,,,,, uint256 healthFactor) = pool.getUserAccountData(root);
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
