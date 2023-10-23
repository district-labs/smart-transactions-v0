// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import { IUniswapV3Pool } from "uniswap-v3-core/interfaces/IUniswapV3Pool.sol";
import { TickMath } from "uniswap-v3-core/libraries/TickMath.sol";
import { FixedPoint96 } from "uniswap-v3-core/libraries/FixedPoint96.sol";
import { FullMath } from "uniswap-v3-core/libraries/FullMath.sol";
import { UniswapV3TwapOracle } from "../periphery/Axiom/UniswapV3TwapOracle.sol";
import { Intent, Hook } from "../TypesAndDecoders.sol";
import { IntentWithHookAbstract } from "../abstracts/IntentWithHookAbstract.sol";

/// @title Uniswap V3 Historical Time Weighted Average Price Intent
/// @notice An intent that checks block windows and percentage differences based on Uniswap v3 TWAP data. If the price
/// difference percentage is not within the given range or the provided data is invalid, the intent will revert.
contract UniswapV3HistoricalTwapIntent is IntentWithHookAbstract {
    /*//////////////////////////////////////////////////////////////////////////
                                TYPE DECLARATIONS
    //////////////////////////////////////////////////////////////////////////*/

    struct BlockData {
        uint256 referenceBlockOffset;
        uint256 blockWindow;
        uint256 blockWindowTolerance;
        uint256 startBlock;
        uint256 endBlock;
    }

    /*//////////////////////////////////////////////////////////////////////////
                                INTERNAL STORAGE
    //////////////////////////////////////////////////////////////////////////*/

    UniswapV3TwapOracle internal _uniswapV3TwapOracle;

    /*//////////////////////////////////////////////////////////////////////////
                                CUSTOM ERRORS
    //////////////////////////////////////////////////////////////////////////*/

    /// @dev Reference block offset must be less than the current block.
    error InvalidReferenceBlockOffset();

    /// @dev Start block not within the acceptable tolerance for the start block window.
    error InvalidStartBlockWindow(uint256 startBlock);

    /// @dev End block not within the acceptable tolerance for the end block window.
    error InvalidEndBlockWindow(uint256 endBlock);

    /// @dev Percentage difference between the numerator and denominator is too low.
    error LowPercentageDifference();

    /// @dev Percentage difference between the numerator and denominator is too high.
    error HighPercentageDifference();

    /*//////////////////////////////////////////////////////////////////////////
                                CONSTRUCTOR
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Initialize the smart contract
    /// @param _uniswapV3TwapOracleAddress Address of the UniswapV3TwapOracle contract.
    constructor(address _uniswapV3TwapOracleAddress) {
        _uniswapV3TwapOracle = UniswapV3TwapOracle(_uniswapV3TwapOracleAddress);
    }

    /*//////////////////////////////////////////////////////////////////////////
                                READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Helper function to encode hook parameters into a byte array.
    /// @param numeratorStartBlock The start block for the numerator.
    /// @param numeratorEndBlock The end block for the numerator.
    /// @param denominatorStartBlock The start block for the denominator.
    /// @param denominatorEndBlock The end block for the denominator.
    /// @return data The encoded data.
    function encodeHook(
        uint256 numeratorStartBlock,
        uint256 numeratorEndBlock,
        uint256 denominatorStartBlock,
        uint256 denominatorEndBlock
    )
        external
        pure
        returns (bytes memory data)
    {
        data = abi.encode(numeratorStartBlock, numeratorEndBlock, denominatorStartBlock, denominatorEndBlock);
    }

    /// @notice Helper function to encode provided parameters into a byte array.
    /// @param uniswapV3Pool Address of the UniswapV3Pool.
    /// @param numeratorReferenceBlockOffset Number of blocks previous to the current block
    /// @param numeratorBlockWindow Block window for numerator.
    /// @param numeratorBlockWindowTolerance Tolerance window for numerator.
    /// @param denominatorReferenceBlockOffset Number of blocks previous to the current block
    /// @param denominatorBlockWindow Block window for denominator.
    /// @param denominatorBlockWindowTolerance Tolerance window for denominator.
    /// @param minPercentageDifference Minimum allowed percentage difference.
    /// @param maxPercentageDifference Maximum allowed percentage difference.
    /// @return data The encoded parameters.
    function encodeIntent(
        address uniswapV3Pool,
        uint256 numeratorReferenceBlockOffset,
        uint256 numeratorBlockWindow,
        uint256 numeratorBlockWindowTolerance,
        uint256 denominatorReferenceBlockOffset,
        uint256 denominatorBlockWindow,
        uint256 denominatorBlockWindowTolerance,
        uint256 minPercentageDifference,
        uint256 maxPercentageDifference
    )
        external
        pure
        returns (bytes memory data)
    {
        data = abi.encode(
            uniswapV3Pool,
            numeratorReferenceBlockOffset,
            numeratorBlockWindow,
            numeratorBlockWindowTolerance,
            denominatorReferenceBlockOffset,
            denominatorBlockWindow,
            denominatorBlockWindowTolerance,
            minPercentageDifference,
            maxPercentageDifference
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
        view
        override
        validIntentRoot(intent)
        validIntentTarget(intent)
        returns (bool)
    {
        (
            ,
            uint256 numeratorReferenceBlockOffset,
            uint256 numeratorBlockWindow,
            uint256 numeratorBlockWindowTolerance,
            uint256 denominatorReferenceBlockOffset,
            uint256 denominatorBlockWindow,
            uint256 denominatorBlockWindowTolerance,
            ,
        ) = _decodeIntent(intent);

        (
            uint256 numeratorStartBlock,
            uint256 numeratorEndBlock,
            uint256 denominatorStartBlock,
            uint256 denominatorEndBlock
        ) = _decodeHook(hook);

        _checkBlocksRange(
            BlockData({
                referenceBlockOffset: numeratorReferenceBlockOffset,
                blockWindow: numeratorBlockWindow,
                blockWindowTolerance: numeratorBlockWindowTolerance,
                startBlock: numeratorStartBlock,
                endBlock: numeratorEndBlock
            }),
            BlockData({
                referenceBlockOffset: denominatorReferenceBlockOffset,
                blockWindow: denominatorBlockWindow,
                blockWindowTolerance: denominatorBlockWindowTolerance,
                startBlock: denominatorStartBlock,
                endBlock: denominatorEndBlock
            })
        );
        _checkPercentageDifference(intent, hook);

        return true;
    }

    /*//////////////////////////////////////////////////////////////////////////
                              INTERNAL READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Verifies that the block range for both the numerator and denominator is valid.
    /// This function ensures that the start and end blocks for the numerator and denominator
    /// are within the acceptable tolerance range of their respective target blocks.
    /// @param numerator Data for the numerator's block range.
    /// @param denominator Data for the denominator's block range.
    function _checkBlocksRange(BlockData memory numerator, BlockData memory denominator) internal view {
        _checkBlockWindow(numerator);
        _checkBlockWindow(denominator);
    }

    /// @notice Internal function to validate block windows.
    /// @param blockData Block data that contains details about reference, window, tolerance, start and end blocks.
    function _checkBlockWindow(BlockData memory blockData) internal view {
        if (blockData.referenceBlockOffset >= block.number) revert InvalidReferenceBlockOffset();

        uint256 referenceBlock = block.number - blockData.referenceBlockOffset;

        if (
            referenceBlock - blockData.blockWindowTolerance > blockData.endBlock
                || referenceBlock + blockData.blockWindowTolerance < blockData.endBlock
        ) {
            revert InvalidEndBlockWindow(blockData.endBlock);
        }

        uint256 targetBlock = referenceBlock - blockData.blockWindow;

        if (
            targetBlock - blockData.blockWindowTolerance > blockData.startBlock
                || targetBlock + blockData.blockWindowTolerance < blockData.startBlock
        ) {
            revert InvalidStartBlockWindow(blockData.startBlock);
        }
    }

    /// @notice Checks if the percentage difference between the numerator and denominator
    /// is within the allowed range. This function determines the TWAP (Time Weighted Average Price)
    /// for the numerator and denominator using the Uniswap V3 TWAP Oracle. It then computes the
    /// percentage difference between them and ensures it's within the given min and max limits.
    /// @param intent Intent data.
    /// @param hook Hook data.
    function _checkPercentageDifference(Intent calldata intent, Hook calldata hook) internal view {
        (address uniswapV3Pool,,,,,,, uint256 minPercentageDifference, uint256 maxPercentageDifference) =
            _decodeIntent(intent);

        (
            uint256 numeratorStartBlock,
            uint256 numeratorEndBlock,
            uint256 denominatorStartBlock,
            uint256 denominatorEndBlock
        ) = _decodeHook(hook);

        (int24 numeratorTwaTick,,) =
            _uniswapV3TwapOracle.getTwaTick(uniswapV3Pool, numeratorStartBlock, numeratorEndBlock);

        (int24 denominatorTwaTick,,) =
            _uniswapV3TwapOracle.getTwaTick(uniswapV3Pool, denominatorStartBlock, denominatorEndBlock);

        uint160 numeratorSqrtPriceX96 = TickMath.getSqrtRatioAtTick(numeratorTwaTick);
        uint160 denominatorSqrtPriceX96 = TickMath.getSqrtRatioAtTick(denominatorTwaTick);

        uint256 numeratorPriceX96 = FullMath.mulDiv(numeratorSqrtPriceX96, numeratorSqrtPriceX96, FixedPoint96.Q96);
        uint256 denominatorPriceX96 =
            FullMath.mulDiv(denominatorSqrtPriceX96, denominatorSqrtPriceX96, FixedPoint96.Q96);

        uint256 percentageDifference = (numeratorPriceX96 * 100_000) / denominatorPriceX96;

        if (percentageDifference < minPercentageDifference) revert LowPercentageDifference();
        if (percentageDifference > maxPercentageDifference) revert HighPercentageDifference();
    }

    /// @notice Helper function to decode hook parameters from a byte array.
    /// @param hook The hook to be decoded.
    /// @return numeratorStartBlock The start block for the numerator.
    /// @return numeratorEndBlock The end block for the numerator.
    /// @return denominatorStartBlock The start block for the denominator.
    /// @return denominatorEndBlock The end block for the denominator.
    function _decodeHook(Hook calldata hook)
        internal
        pure
        returns (
            uint256 numeratorStartBlock,
            uint256 numeratorEndBlock,
            uint256 denominatorStartBlock,
            uint256 denominatorEndBlock
        )
    {
        return abi.decode(hook.data, (uint256, uint256, uint256, uint256));
    }
    /// @notice Helper function to decode intent parameters from a byte array.
    /// @param intent The intent.
    /// @return uniswapV3Pool The address of the Uniswap V3 pool.
    /// @return numeratorReferenceBlockOffset Number of blocks previous to the current block
    /// @return numeratorBlockWindow Block window for numerator.
    /// @return numeratorBlockWindowTolerance Tolerance window for numerator.
    /// @return denominatorReferenceBlockOffset Number of blocks previous to the current block
    /// @return denominatorBlockWindow Block window for denominator.
    /// @return denominatorBlockWindowTolerance Tolerance window for denominator.
    /// @return minPercentageDifference Minimum allowed percentage difference.
    /// @return maxPercentageDifference Maximum allowed percentage difference.

    function _decodeIntent(Intent calldata intent)
        internal
        pure
        returns (
            address uniswapV3Pool,
            uint256 numeratorReferenceBlockOffset,
            uint256 numeratorBlockWindow,
            uint256 numeratorBlockWindowTolerance,
            uint256 denominatorReferenceBlockOffset,
            uint256 denominatorBlockWindow,
            uint256 denominatorBlockWindowTolerance,
            uint256 minPercentageDifference,
            uint256 maxPercentageDifference
        )
    {
        return
            abi.decode(intent.data, (address, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256));
    }
}
