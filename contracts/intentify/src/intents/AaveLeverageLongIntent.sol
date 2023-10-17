// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { console2 } from "forge-std/console2.sol";
import { IPool } from "@aave/v3-core/interfaces/IPool.sol";
import { AggregatorV3Interface } from "chainlink/interfaces/AggregatorV3Interface.sol";
import { Intent, Hook } from "../TypesAndDecoders.sol";
import { ChainlinkOracleHelper } from "../oracles/ChainlinkOracleHelper.sol";
import { HookTransaction } from "./utils/HookTransaction.sol";
import { ExecuteRootTransaction } from "./utils/ExecuteRootTransaction.sol";

interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function decimals() external view returns (uint256);
}

contract AaveLeverageLongIntent is ExecuteRootTransaction, HookTransaction, ChainlinkOracleHelper {
    /*//////////////////////////////////////////////////////////////////////////
                                   PUBLIC STORAGE
    //////////////////////////////////////////////////////////////////////////*/
    address internal immutable _pool;

    /*//////////////////////////////////////////////////////////////////////////
                                    CONSTRUCTOR
    //////////////////////////////////////////////////////////////////////////*/
    /**
      * @notice Initialize the smart contract
      * @param intentifySafeModule Canonical Intentify Safe Module
      * @param __pool Canonical Aave Pool
     */
    constructor(address intentifySafeModule, address __pool) ExecuteRootTransaction(intentifySafeModule) {
        _pool = __pool;
    }

    /*//////////////////////////////////////////////////////////////////////////
                                    READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/
    /**
      * @notice Encode hook instructions.
      * @dev The executor/searcher should calculate these values before encoding.
      * @param swapType uint8 - Base or Quote asset used to calculate payout  
      * @param priceFeed address - Chainlink price feed for supply and borrow asset
      * @param supplyAsset address - ERC20 supplied to Aave
      * @param borrowAsset address - ERC20 borrowed from Aave
      * @param interestRateMode uint256 - Interest rate mode for Aave
      * @param minHealthFactor uint256 Minimum health factor after intent execution
      * @param fee uint32 - Fee paid to executor i.e. 3000 = 3%
     */
    function encode(
        uint8 swapType,
        address priceFeed,
        address supplyAsset,
        address borrowAsset,
        uint256 interestRateMode,
        uint256 minHealthFactor,
        uint32 fee
    )
        external
        pure
        returns (bytes memory data)
    {
        return abi.encode(swapType, priceFeed, supplyAsset, borrowAsset, interestRateMode, minHealthFactor, fee);
    }

    /**
      * @notice Encode hook instructions.
      * @dev The executor/searcher should calculate these values before encoding.
      * @param supplyAmount Amount being supplied to Aave
      * @param borrowAmount Amount being borrowed from Aave
     */
    function encodeHook(
        uint256 supplyAmount,
        uint256 borrowAmount,
        bytes calldata hookData
    )
        external
        pure
        returns (bytes memory data)
    {
        return abi.encode(supplyAmount, borrowAmount, hookData);
    }

    /*//////////////////////////////////////////////////////////////////////////
                                   WRITE FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /**
     * @notice Executes an leverage long intent using the Aave protocol.
     * @dev Expects the root account to have asset supplied to Aave and health factor to be greater than the minimum
     * health factor.
     * @param intent The intent created by the root account.
     * @param hook The hook created by the executor.
     * @return success Whether or not the intent was executed successfully.
     */
    function execute(Intent calldata intent, Hook calldata hook) external returns (bool) {
        require(intent.root == msg.sender, "TimestampIntent:invalid-root");
        require(intent.target == address(this), "TimestampIntent:invalid-target");
        (
            uint8 swapType,
            address priceFeed,
            address supplyAsset,
            address borrowAsset,
            , // interestRateMode
            uint256 minHealthFactor,
            uint32 fee
        ) = abi.decode(intent.data, (uint8, address, address, address, uint256, uint256, uint32));
        uint256 balanceStart = IERC20(supplyAsset).balanceOf(intent.root);
        _hook(hook); // Expectation is that the hook will add funds to the root account i.e. flash loan
        _leverage(intent, hook);
        uint256 repayAmount =
            _checkHookInstructions(swapType, priceFeed, supplyAsset, borrowAsset, fee, hook.data);
        _transferFromRoot(borrowAsset, hook.target, repayAmount);
        _checkHealthFactor(intent.root, minHealthFactor);
        _checkFinalBalance(intent.root, supplyAsset, balanceStart);

        return true;
    }

    /*//////////////////////////////////////////////////////////////////////////
                                  INTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /**
     * @notice Calculates the amount to be repaid to the executor of the transaction.
     * @param price int256 - Token pair price from Chainlink oracle
     * @param supplyAssetDecimals Decimal amount in supply asset
     * @param borrowAssetDecimals Decimal amount in borrow asset
     * @param supplyAmount uin256 - ERC20 token amount
     * @param borrowAmount uin256 - ERC20 token amount
     * @param fee uint32 - Fee paid to executor i.e. 3000 = 3%
     * @return amountRepay The amount of the borrowed asset that will be repaid to the executor
     */
    function _calculatePayout(
        uint8 swapType,
        int256 price,
        uint256 supplyAssetDecimals,
        uint256 borrowAssetDecimals,
        uint256 supplyAmount,
        uint256 borrowAmount,
        uint32 fee
    )
        internal
        view
        returns (uint256 amountRepay)
    {
        uint256 supplyAmountWithFee = supplyAmount + (supplyAmount * fee / 100_000);
        if (swapType == 0) {
            amountRepay = _calculateQuoteAsset(price, borrowAssetDecimals, supplyAmountWithFee);
            require(borrowAmount >= amountRepay, "AaveLeverageLongIntent:insufficient-supply-amount");
        } else if (swapType == 1) {
            amountRepay = _calculateBaseAsset(price, supplyAssetDecimals, supplyAmountWithFee);
            require(borrowAmount >= amountRepay, "AaveLeverageLongIntent:insufficient-supply-amount");
        } else {
            revert("AaveLeverageLongIntent:invalid-swap-type");
        }
    }

    /**
     * @notice Checks account health factor is above minimum threshold 
     * @param account address - Account to get Aave user data about
     * @param token address - ERC20 token
     * @param balanceStart uint256 - Balance at the start of intent execution
     */
    function _checkFinalBalance(address account, address token, uint256 balanceStart) internal view {
        uint256 balanceEnd = IERC20(token).balanceOf(account);
        require(balanceEnd >= balanceStart, "AaveLeverageLongIntent:insufficient-ending-balance");
    }

     /**
     * @notice Checks account health factor is above minimum threshold 
     * @param account address - Account to get Aave user data about
     * @param minHealthFactor uint256 - Minimum health factor
     */
    function _checkHealthFactor(address account, uint256 minHealthFactor) internal view {
        (,,,,, uint256 healthFactor) = IPool(_pool).getUserAccountData(account);
        require(healthFactor >= minHealthFactor, "AaveLeverageLongIntent:insufficient-health-factor");
    }

    /**
     * @notice Fetches external data required to constrain hook instructions 
     * @param priceFeed The price feed of the numerator asset.
     * @param supplyAsset The address of the numerator asset.
     * @param borrowAsset The address of the denominator asset.
     * @param fee The fee that will be charged by the execution of the transaction.
     * @return amountRepay The amount of the borrowed asset that will be repaid to the executor
     */
    function _checkHookInstructions(
        uint8 swapType,
        address priceFeed,
        address supplyAsset,
        address borrowAsset,
        uint32 fee,
        bytes memory hookData
    )
        internal
        returns (uint256 amountRepay)
    {
        AggregatorV3Interface feed = AggregatorV3Interface(priceFeed);
        (, int256 price,,,) = feed.latestRoundData();
        (uint256 supplyAmount, uint256 borrowAmount,) = abi.decode(hookData, (uint256, uint256, bytes));
        uint256 supplyAssetDecimals = IERC20(supplyAsset).decimals();
        uint256 borrowAssetDecimals = IERC20(borrowAsset).decimals();

        return
            _calculatePayout(swapType, price, supplyAssetDecimals, borrowAssetDecimals, supplyAmount, borrowAmount, fee);
    }

    /**
      * @notice Supply assets to Aave and borrow against the collateral.
      * @param intent Intent - User signed intent
      * @param hook Hook - Executor supplied hook
     */
    function _leverage(Intent calldata intent, Hook calldata hook) internal {
        // Intent Instructions
        (,, address supplyAsset, address borrowAsset, uint256 interestRateMode, uint256 minHealthFactor, uint256 delta)
        = abi.decode(intent.data, (uint8, address, address, address, uint256, uint256, uint256));

        // Hook Instructions
        (uint256 supplyAmount, uint256 borrowAmount,) = abi.decode(hook.data, (uint256, uint256, bytes));

        _supply(supplyAsset, supplyAmount, intent.root);
        _borrow(borrowAsset, borrowAmount, interestRateMode, intent.root);
    }

    /**
      * @notice Supply assets to Aave lending pool.
      * @dev The AaveLeverageLongIntent is expected to be supplied with a "flash loan" before execution.
      * @param supplyAsset address - ERC20 token
      * @param supplyAmount uint256 - ERC20 amount
      * @param root address - Account managing the position
     */
    function _supply(address supplyAsset, uint256 supplyAmount, address root) internal {
        bytes memory approveData = abi.encodeWithSignature("approve(address,uint256)", _pool, supplyAmount);
        (bool successApprove,) = address(supplyAsset).call(approveData);
        require(successApprove);

        bytes memory depositData = abi.encodeWithSignature(
            "deposit(address,uint256,address,uint16)", supplyAsset, supplyAmount, root, 0
        );

        (bool depositApprove,) = address(_pool).call(depositData);
        require(depositApprove);
    }
    
    /**
      * @notice Borrow assets from Aave lending pool.
      * @param borrowAsset address - ERC20 token
      * @param borrowAmount uint256 - ERC20 amount
      * @param interestRateMode uint256 - Aave interest rate mode i.e. stable or variable
      * @param root address - Account managing the position
     */
    function _borrow(address borrowAsset, uint256 borrowAmount, uint256 interestRateMode, address root) internal {
        bytes memory borrowData = abi.encodeWithSignature( 
            "borrow(address,uint256,uint256,uint16,address)",
            borrowAsset,
            borrowAmount,
            interestRateMode,
            0,
            root
        );
        executeFromRoot(_pool, 0, borrowData);
    }

    /**
      * @notice Transfer tokens from the root account. 
      * @param token address - ERC20 token
      * @param to address - Account receiving tokens
      * @param amount uint256 - Amount being sent
     */
    function _transferFromRoot(address token, address to, uint256 amount) internal {
        bytes memory approveData = abi.encodeWithSignature("transfer(address,uint256)", to, amount);
        executeFromRoot(token, 0, approveData);
    }

    /**
      * @notice Generic smart contract call passed by executor 
      * @param hook Hook - Executor supplied hook
      * @return success boolean - Transaction execution status
     */
    function _hook(Hook calldata hook) internal returns (bool success) {
        bytes memory errorMessage;
        (,, bytes memory hookData) = abi.decode(hook.data, (uint256, uint256, bytes));
        (success, errorMessage) = address(hook.target).call(hookData);
        if (!success) {
            if (errorMessage.length > 0) {
                string memory reason = _extractRevertReason(errorMessage);
                revert(reason);
            } else {
                revert("AaveLeverageLongIntent::hook-execution-failed");
            }
        }
    }
}
