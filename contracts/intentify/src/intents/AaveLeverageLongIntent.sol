// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { console2 } from "forge-std/console2.sol";
import { IPool } from "@aave/v3-core/interfaces/IPool.sol";
import { AggregatorV3Interface } from "chainlink/interfaces/AggregatorV3Interface.sol";
import { Intent, Hook } from "../TypesAndDecoders.sol";
import { ChainlinkDataFeedHelper } from "../oracles/ChainlinkDataFeedHelper.sol";
import { ChainlinkDataFeedBaseUSDRoundData } from "../oracles/ChainlinkDataFeedBaseUSDRoundData.sol";
import { HookTransaction } from "./utils/HookTransaction.sol";
import { ExecuteRootTransaction } from "./utils/ExecuteRootTransaction.sol";

interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function decimals() external view returns (uint256);
}

contract AaveLeverageLongIntent is ExecuteRootTransaction, HookTransaction, ChainlinkDataFeedHelper {
    /*//////////////////////////////////////////////////////////////////////////
                                   PUBLIC STORAGE
    //////////////////////////////////////////////////////////////////////////*/
    uint8 internal constant DECIMAL_SCALE = 18;
    uint8 internal constant DECIMAL_USD_FEED = 8;
    uint256 internal immutable FEED_THRESHOLD_SECONDS = 500000; // TODO: Calcuate best value

    address internal immutable _pool;
    address internal immutable _chainlinkDataFeedBaseUSDRoundData;


    /*//////////////////////////////////////////////////////////////////////////
                                CUSTOM ERRORS
    //////////////////////////////////////////////////////////////////////////*/

    /// @dev Insufficient health factor after intent execution
    error InsufficientHealthFactor();

    /// @dev Insufficient token balance after intent execution
    error InsufficientTokenBalance();

    /// @dev Borrow amount exceeds estimated amount
    error InsufficientBorrowAmount();

    /*//////////////////////////////////////////////////////////////////////////
                                    CONSTRUCTOR
    //////////////////////////////////////////////////////////////////////////*/
    /**
     * @notice Initialize the smart contract
     * @param intentifySafeModule Canonical Intentify Safe Module
     * @param __chainlinkDataFeedBaseUSDRoundData Chainlink Data Feed Base USD Round Data
     * @param __pool Canonical Aave Pool
     */
    constructor(
        address intentifySafeModule,
        address __chainlinkDataFeedBaseUSDRoundData,
        address __pool
    )
        ExecuteRootTransaction(intentifySafeModule)
    {
        _chainlinkDataFeedBaseUSDRoundData = __chainlinkDataFeedBaseUSDRoundData;
        _pool = __pool;
    }

    /*//////////////////////////////////////////////////////////////////////////
                                    READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/
    /**
     * @notice Encode hook instructions.
     * @dev The executor/searcher should calculate these values before encoding.
     * @param supplyAsset address - ERC20 supplied to Aave
     * @param borrowAsset address - ERC20 borrowed from Aave
     * @param interestRateMode uint256 - Interest rate mode for Aave
     * @param minHealthFactor uint256 Minimum health factor after intent execution
     * @param fee uint32 - Fee paid to executor i.e. 3000 = 3%
     */
    function encode(
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
        return abi.encode(supplyAsset, borrowAsset, interestRateMode, minHealthFactor, fee);
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

    function _decodeIntentData(bytes calldata data)
        internal
        pure
        returns (
            address supplyAsset,
            address borrowAsset,
            uint256 interestRateMode,
            uint256 minHealthFactor,
            uint32 fee
        )
    {
        return abi.decode(data, (address, address, uint256, uint256, uint32));
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
            address supplyAsset,
            address borrowAsset,
            , // interestRateMode
            uint256 minHealthFactor,
            uint32 fee
        ) = _decodeIntentData(intent.data);
        uint256 balanceStart = IERC20(supplyAsset).balanceOf(intent.root); // change to borrow asset
        _hook(hook); // Expectation is that the hook will add funds to the intent module i.e. flash loan
        _leverage(intent, hook);
        uint256 repayAmount = _checkIntentAndHookData(supplyAsset, borrowAsset, fee, hook.data);
        _transferFromRoot(borrowAsset, hook.target, repayAmount);
        _checkHealthFactor(intent.root, minHealthFactor);
        _checkFinalBalance(intent.root, supplyAsset, balanceStart);

        return true;
    }

    /*//////////////////////////////////////////////////////////////////////////
                                  INTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /**
     * @notice Checks account health factor is above minimum threshold
     * @param account address - Account to get Aave user data about
     * @param token address - ERC20 token
     * @param balanceStart uint256 - Balance at the start of intent execution
     */
    function _checkFinalBalance(address account, address token, uint256 balanceStart) internal view {
        uint256 balanceEnd = IERC20(token).balanceOf(account);
        if (balanceEnd < balanceStart) revert InsufficientTokenBalance();
    }

    /**
     * @notice Checks account health factor is above minimum threshold
     * @param account address - Account to get Aave user data about
     * @param minHealthFactor uint256 - Minimum health factor
     */
    function _checkHealthFactor(address account, uint256 minHealthFactor) internal view {
        (,,,,, uint256 healthFactor) = IPool(_pool).getUserAccountData(account);
        if (healthFactor < minHealthFactor) revert InsufficientHealthFactor();
    }

    /**
     * @notice Fetches external data required to constrain hook instructions
     * @param supplyAsset The address of the numerator asset.
     * @param borrowAsset The address of the denominator asset.
     * @param fee The fee that will be charged by the execution of the transaction.
     * @return amountRepay The amount of the borrowed asset that will be repaid to the executor
     */

    function _checkIntentAndHookData(
        address supplyAsset,
        address borrowAsset,
        uint32 fee,
        bytes memory hookData
    )
        internal
        returns (uint256 amountRepay)
    {
        (uint256 supplyAmount, uint256 borrowAmount,) = abi.decode(hookData, (uint256, uint256, bytes));
        uint256 supplyAmountWithFee = supplyAmount + (supplyAmount * fee / 100_000);
        int256 derivedPrice = _getDerivedPrice(supplyAsset, borrowAsset);
        uint256 outAmount = _calculateTokenInAmount(
            uint8(IERC20(supplyAsset).decimals()),
            uint8(IERC20(borrowAsset).decimals()),
            supplyAmountWithFee,
            DECIMAL_SCALE,
            derivedPrice
        );

        // Executor must only borrow the amount that is required to repay the flash loan
        // using the estimated price from the Chainlink oracle.
        if (outAmount > borrowAmount) revert InsufficientBorrowAmount();

        return outAmount;
    }
    /**
     * @notice Fetches external data required to constrain hook instructions.
     * @dev If WETH is supplied as an asset the Chainlink oracle will return the price of ETH.
     * @param supplyAsset The address of the base asset.
     * @param borrowAsset The address of the quote asset.
     */

    function _getDerivedPrice(address supplyAsset, address borrowAsset) internal returns (int256) {
        // Base Data
        (, int256 basePrice,, uint256 baseUpdatedAt,) = ChainlinkDataFeedBaseUSDRoundData(_chainlinkDataFeedBaseUSDRoundData)
            .getLatestRoundData(supplyAsset);
        require(block.timestamp - baseUpdatedAt <= FEED_THRESHOLD_SECONDS, "ChainlinkDataFeedHelper:stale-price");

        // Quote Data
        (, int256 quotePrice,, uint256 quoteUpdatedAt,) = ChainlinkDataFeedBaseUSDRoundData(_chainlinkDataFeedBaseUSDRoundData)
            .getLatestRoundData(borrowAsset);
        require(block.timestamp - quoteUpdatedAt <= FEED_THRESHOLD_SECONDS, "ChainlinkDataFeedHelper:stale-price");

        int256 scaledDecimals = int256(10 ** uint256(DECIMAL_SCALE));

        return _calculateDerivedPrice(
            basePrice, DECIMAL_USD_FEED, quotePrice, DECIMAL_USD_FEED, DECIMAL_SCALE, scaledDecimals
        );
    }

    /**
     * @notice Supply assets to Aave and borrow against the collateral.
     * @param intent Intent - User signed intent
     * @param hook Hook - Executor supplied hook
     */
    function _leverage(Intent calldata intent, Hook calldata hook) internal {
        // Intent Data
        (address supplyAsset, address borrowAsset, uint256 interestRateMode, uint256 minHealthFactor, uint256 delta) =
            _decodeIntentData(intent.data);

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

        bytes memory depositData =
            abi.encodeWithSignature("deposit(address,uint256,address,uint16)", supplyAsset, supplyAmount, root, 0);

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
            "borrow(address,uint256,uint256,uint16,address)", borrowAsset, borrowAmount, interestRateMode, 0, root
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
