// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { IUniswapV3Pool } from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import { TickMath } from "@uniswap/v3-core/contracts/libraries/TickMath.sol";
import { FixedPoint96 } from "@uniswap/v3-core/contracts/libraries/FixedPoint96.sol";
import { FullMath } from "@uniswap/v3-core/contracts/libraries/FullMath.sol";
import { UniswapV3TwapOracle } from "../periphery/Axiom/UniswapV3TwapOracle.sol";
import { Intent, Hook } from "../TypesAndDecoders.sol";
import {IIntentWithHook} from "../interfaces/IIntentWithHook.sol";

/// @title Uniswap V3 Historical Time Weighted Average Price Intent
/// @notice An intent that checks block windows and percentage differences based on Uniswap v3 TWAP data. If the price
/// difference percentage is not within the given range or the provided data is invalid, the intent will revert.
contract UniswapV3HistoricalTwapIntent is IIntentWithHook  {
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
                                PUBLIC STORAGE
    //////////////////////////////////////////////////////////////////////////*/

    UniswapV3TwapOracle internal _uniswapV3TwapOracle;

    /*//////////////////////////////////////////////////////////////////////////
                                CUSTOM ERRORS
    //////////////////////////////////////////////////////////////////////////*/

    /// @dev Intent root must be the msg sender.
    error InvalidRoot();

    /// @dev Intent target must be this contract.
    error InvalidTarget();

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
    function encode(
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

    /// @inheritdoc IIntentWithHook
    function execute(Intent calldata intent, Hook calldata hook) external view returns (bool) {
        if (intent.root != msg.sender) revert InvalidRoot();
        if (intent.target != address(this)) revert InvalidTarget();

        (
            ,
            uint256 numeratorReferenceBlockOffset,
            uint256 numeratorBlockWindow,
            uint256 numeratorBlockWindowTolerance,
            uint256 denominatorReferenceBlockOffset,
            uint256 denominatorBlockWindow,
            uint256 denominatorBlockWindowTolerance,
            ,
        ) = abi.decode(intent.data, (address, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256));

        (
            uint256 numeratorStartBlock,
            uint256 numeratorEndBlock,
            uint256 denominatorStartBlock,
            uint256 denominatorEndBlock
        ) = abi.decode(hook.data, (uint256, uint256, uint256, uint256));

        BlockData memory numerator = BlockData({
            referenceBlockOffset: numeratorReferenceBlockOffset,
            blockWindow: numeratorBlockWindow,
            blockWindowTolerance: numeratorBlockWindowTolerance,
            startBlock: numeratorStartBlock,
            endBlock: numeratorEndBlock
        });

        BlockData memory denominator = BlockData({
            referenceBlockOffset: denominatorReferenceBlockOffset,
            blockWindow: denominatorBlockWindow,
            blockWindowTolerance: denominatorBlockWindowTolerance,
            startBlock: denominatorStartBlock,
            endBlock: denominatorEndBlock
        });

        _checkBlocksRange(numerator, denominator);
        _checkPercentageDifference(intent.data, hook.data);

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
    /// @param intentData Encoded intent data.
    /// @param hookData Encoded hook data.
    function _checkPercentageDifference(bytes memory intentData, bytes memory hookData) internal view {
        (address uniswapV3Pool,,,,,,, uint256 minPercentageDifference, uint256 maxPercentageDifference) =
            abi.decode(intentData, (address, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256));

        (
            uint256 numeratorStartBlock,
            uint256 numeratorEndBlock,
            uint256 denominatorStartBlock,
            uint256 denominatorEndBlock
        ) = abi.decode(hookData, (uint256, uint256, uint256, uint256));

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
}
