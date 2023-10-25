// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import { ERC20 } from "solady/tokens/ERC20.sol";
import { IPool } from "@aave/v3-core/interfaces/IPool.sol";
import { IntentWithHookAbstract } from "../abstracts/IntentWithHookAbstract.sol";
import { AggregatorV3Interface } from "chainlink/interfaces/AggregatorV3Interface.sol";
import { Intent, Hook } from "../TypesAndDecoders.sol";
import { ChainlinkDataFeedHelper } from "../oracles/ChainlinkDataFeedHelper.sol";
import { ChainlinkDataFeedBaseUSDRoundData } from "../oracles/ChainlinkDataFeedBaseUSDRoundData.sol";
import { ExecuteRootTransaction } from "./utils/ExecuteRootTransaction.sol";

contract AaveLeverageLongIntent is IntentWithHookAbstract, ExecuteRootTransaction, ChainlinkDataFeedHelper {
    /*//////////////////////////////////////////////////////////////////////////
                                  CONSTANTS
    //////////////////////////////////////////////////////////////////////////*/
    uint8 internal constant DECIMAL_SCALE = 18;
    uint8 internal constant DECIMAL_USD_FEED = 8;
    uint256 internal constant FEED_THRESHOLD_SECONDS = 500_000; // TODO: Calcuate best value

    /*//////////////////////////////////////////////////////////////////////////
                                   INTERNAL STORAGE
    //////////////////////////////////////////////////////////////////////////*/
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

    /// @dev Insufficient token balance after intent execution
    error SupplyError();

    /// @dev Insufficient token balance after intent execution
    error DepositError();

    /*//////////////////////////////////////////////////////////////////////////
                                    CONSTRUCTOR
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Initialize the smart contract
    /// @param intentifySafeModule Canonical Intentify Safe Module
    /// @param __chainlinkDataFeedBaseUSDRoundData Chainlink Data Feed Base USD Round Data
    /// @param __pool Canonical Aave Pool
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

    /// @notice Helper function to encode hook instruction parameters into a byte array.
    /// @param supplyAmount Amount being supplied to Aave
    /// @param borrowAmount Amount being borrowed from Aave
    /// @return instructions The encoded instructions.
    function encodeHookInstructions(
        uint256 supplyAmount,
        uint256 borrowAmount
    )
        external
        pure
        returns (bytes memory instructions)
    {
        return abi.encode(supplyAmount, borrowAmount);
    }

    /// @notice Helper function to encode provided parameters into a byte array.
    /// @param supplyAsset ERC20 supplied to Aave
    /// @param borrowAsset ERC20 borrowed from Aave
    /// @param interestRateMode Interest rate mode for Aave
    /// @param minHealthFactor Minimum health factor after intent execution
    /// @param fee Fee paid to executor i.e. 3000 = 3%
    /// @return data The encoded parameters.
    function encodeIntent(
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

    /*//////////////////////////////////////////////////////////////////////////
                                   WRITE FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Executes an leverage long intent using the Aave protocol.
    /// @dev Expects the root account to have asset supplied to Aave and health factor to be greater than the minimum
    /// health factor.
    /// @param intent The intent created by the root account.
    /// @param hook The hook created by the executor.
    /// @return success Whether or not the intent was executed successfully.
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
        (
            address supplyAsset,
            address borrowAsset,
            , // interestRateMode
            uint256 minHealthFactor,
            uint32 fee
        ) = _decodeIntent(intent);
        uint256 balanceStart = ERC20(supplyAsset).balanceOf(intent.root); // change to borrow asset
        _hook(hook); // Expectation is that the hook will add funds to the intent module i.e. flash loan
        _leverage(intent, hook);
        uint256 repayAmount = _checkIntentAndHookData(supplyAsset, borrowAsset, fee, hook);
        _transferFromRoot(borrowAsset, hook.target, repayAmount);
        _checkHealthFactor(intent.root, minHealthFactor);
        _checkFinalBalance(intent.root, supplyAsset, balanceStart);

        return true;
    }

    /*//////////////////////////////////////////////////////////////////////////
                              INTERNAL READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Checks account health factor is above minimum threshold
    /// @param account address - Account to get Aave user data about
    /// @param token address - ERC20 token
    /// @param balanceStart uint256 - Balance at the start of intent execution
    function _checkFinalBalance(address account, address token, uint256 balanceStart) internal view {
        uint256 balanceEnd = ERC20(token).balanceOf(account);
        if (balanceEnd < balanceStart) revert InsufficientTokenBalance();
    }

    /// @notice Checks account health factor is above minimum threshold
    /// @param account address - Account to get Aave user data about
    /// @param minHealthFactor uint256 - Minimum health factor
    function _checkHealthFactor(address account, uint256 minHealthFactor) internal view {
        (,,,,, uint256 healthFactor) = IPool(_pool).getUserAccountData(account);
        if (healthFactor < minHealthFactor) revert InsufficientHealthFactor();
    }

    /// @notice Fetches external data required to constrain hook instructions
    /// @param supplyAsset The address of the numerator asset.
    /// @param borrowAsset The address of the denominator asset.
    /// @param fee The fee that will be charged by the execution of the transaction.
    /// @return amountRepay The amount of the borrowed asset that will be repaid to the executor
    function _checkIntentAndHookData(
        address supplyAsset,
        address borrowAsset,
        uint32 fee,
        Hook calldata hook
    )
        internal
        view
        returns (uint256 amountRepay)
    {
        (uint256 supplyAmount, uint256 borrowAmount) = _decodeHookInstructions(hook);
        uint256 supplyAmountWithFee = supplyAmount + (supplyAmount * fee / 100_000);
        int256 derivedPrice = _getDerivedPrice(supplyAsset, borrowAsset);
        uint256 outAmount = _calculateTokenInAmount(
            uint8(ERC20(supplyAsset).decimals()),
            uint8(ERC20(borrowAsset).decimals()),
            supplyAmountWithFee,
            DECIMAL_SCALE,
            derivedPrice
        );

        // Executor must only borrow the amount that is required to repay the flash loan
        // using the estimated price from the Chainlink oracle.
        if (outAmount > borrowAmount) revert InsufficientBorrowAmount();

        return outAmount;
    }

    /// @notice Helper function to decode hook instructions parameters from a byte array.
    /// @param hook The hook to be decoded.
    /// @return supplyAmount The amount of the supplied asset.
    /// @return borrowAmount The amount of the borrowed asset.
    function _decodeHookInstructions(Hook calldata hook)
        internal
        pure
        returns (uint256 supplyAmount, uint256 borrowAmount)
    {
        return abi.decode(hook.instructions, (uint256, uint256));
    }

    /// @notice Helper function to decode intent parameters from a byte array.
    /// @param intent The intent to be decoded.
    /// @return supplyAsset The address of the asset being supplied to Aave.
    /// @return borrowAsset The address of the asset being borrowed from Aave.
    /// @return interestRateMode The interest rate mode for the Aave borrow.
    /// @return minHealthFactor The minimum health factor after intent execution.
    /// @return fee The fee paid to the executor.
    function _decodeIntent(Intent calldata intent)
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
        return abi.decode(intent.data, (address, address, uint256, uint256, uint32));
    }

    /*//////////////////////////////////////////////////////////////////////////
                              INTERNAL WRITE FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Borrow assets from Aave lending pool.
    /// @param borrowAsset ERC20 token
    /// @param borrowAmount ERC20 amount
    /// @param interestRateMode Aave interest rate mode i.e. stable or variable
    /// @param root Account managing the position
    function _borrow(address borrowAsset, uint256 borrowAmount, uint256 interestRateMode, address root) internal {
        bytes memory borrowData = abi.encodeWithSignature(
            "borrow(address,uint256,uint256,uint16,address)", borrowAsset, borrowAmount, interestRateMode, 0, root
        );
        executeFromRoot(_pool, 0, borrowData);
    }

    /// @notice Fetches external data required to constrain hook instructions.
    /// @dev If WETH is supplied as an asset the Chainlink oracle will return the price of ETH.
    /// @param supplyAsset The address of the base asset.
    /// @param borrowAsset The address of the quote asset.
    function _getDerivedPrice(address supplyAsset, address borrowAsset) internal view returns (int256) {
        // Base Data
        (, int256 basePrice,, uint256 baseUpdatedAt,) =
            ChainlinkDataFeedBaseUSDRoundData(_chainlinkDataFeedBaseUSDRoundData).getLatestRoundData(supplyAsset);
        if (block.timestamp - baseUpdatedAt > FEED_THRESHOLD_SECONDS) {
            revert StalePrice(block.timestamp - baseUpdatedAt, FEED_THRESHOLD_SECONDS);
        }

        // Quote Data
        (, int256 quotePrice,, uint256 quoteUpdatedAt,) =
            ChainlinkDataFeedBaseUSDRoundData(_chainlinkDataFeedBaseUSDRoundData).getLatestRoundData(borrowAsset);
        if (block.timestamp - quoteUpdatedAt > FEED_THRESHOLD_SECONDS) {
            revert StalePrice(block.timestamp - quoteUpdatedAt, FEED_THRESHOLD_SECONDS);
        }

        int256 scaledDecimals = int256(10 ** uint256(DECIMAL_SCALE));

        return _calculateDerivedPrice(
            basePrice, DECIMAL_USD_FEED, quotePrice, DECIMAL_USD_FEED, DECIMAL_SCALE, scaledDecimals
        );
    }

    /// @notice Generic smart contract call passed by executor
    /// @param hook Executor supplied hook
    /// @return success Transaction execution status
    function _hook(Hook calldata hook) internal returns (bool success) {
        bytes memory errorMessage;
        (success, errorMessage) = address(hook.target).call(hook.data);
        if (!success) {
            if (errorMessage.length > 0) {
                _revertMessageReason(errorMessage);
            } else {
                revert("AaveLeverageLongIntent::hook-execution-failed");
            }
        }
    }

    /// @notice Supply assets to Aave and borrow against the collateral.
    /// @param intent User signed intent
    /// @param hook Executor supplied hook
    function _leverage(Intent calldata intent, Hook calldata hook) internal {
        // Intent Data
        (address supplyAsset, address borrowAsset, uint256 interestRateMode,,) = _decodeIntent(intent);

        // Hook Instructions
        (uint256 supplyAmount, uint256 borrowAmount) = _decodeHookInstructions(hook);

        _supply(supplyAsset, supplyAmount, intent.root);
        _borrow(borrowAsset, borrowAmount, interestRateMode, intent.root);
    }

    /// @notice Supply assets to Aave lending pool.
    /// @dev The AaveLeverageLongIntent is expected to be supplied with a "flash loan" before execution.
    /// @param supplyAsset ERC20 token
    /// @param supplyAmount ERC20 amount
    /// @param root Account managing the position
    function _supply(address supplyAsset, uint256 supplyAmount, address root) internal {
        bytes memory approveData = abi.encodeWithSignature("approve(address,uint256)", _pool, supplyAmount);
        (bool successApprove,) = address(supplyAsset).call(approveData);
        if (!successApprove) revert SupplyError();

        bytes memory depositData =
            abi.encodeWithSignature("deposit(address,uint256,address,uint16)", supplyAsset, supplyAmount, root, 0);

        (bool depositApprove,) = address(_pool).call(depositData);
        if (!depositApprove) revert DepositError();
    }

    /// @notice Transfer tokens from the root account.
    /// @param token ERC20 token
    /// @param to Account receiving tokens
    /// @param amount Amount being sent
    function _transferFromRoot(address token, address to, uint256 amount) internal {
        bytes memory approveData = abi.encodeWithSignature("transfer(address,uint256)", to, amount);
        executeFromRoot(token, 0, approveData);
    }
}
