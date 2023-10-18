// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { IUniswapV3Pool } from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import { TickMath } from "@uniswap/v3-core/contracts/libraries/TickMath.sol";
import { FixedPoint96 } from "@uniswap/v3-core/contracts/libraries/FixedPoint96.sol";
import { FullMath } from "@uniswap/v3-core/contracts/libraries/FullMath.sol";
import { UniswapV3TwapOracle } from "../periphery/Axiom/UniswapV3TwapOracle.sol";
import { Intent, Hook } from "../TypesAndDecoders.sol";

/**
 * @title UniV3HistoricalTwapIntent
 * @dev A contract that checks block windows and percentage differences based on Uniswap v3 TWAP data.
 * @notice This contract is intended to be used in combination with another system that provides intent and hook data.
 */
contract UniV3HistoricalTwapIntent {
    UniswapV3TwapOracle internal _uniswapV3TwapOracle;

    struct BlockData {
        uint256 referenceBlockOffset;
        uint256 blockWindow;
        uint256 blockWindowTolerance;
        uint256 startBlock;
        uint256 endBlock;
    }

    /**
     * @dev Contract constructor
     * @param _uniswapV3TwapOracleAddress Address of the UniswapV3TwapOracle contract.
     */
    constructor(address _uniswapV3TwapOracleAddress) {
        _uniswapV3TwapOracle = UniswapV3TwapOracle(_uniswapV3TwapOracleAddress);
    }

    /**
     * @dev Internal function to validate block windows.
     * @param blockData Block data that contains details about reference, window, tolerance, start and end blocks.
     * @param errorMessageStart Error message to revert with if the start block check fails.
     * @param errorMessageEnd Error message to revert with if the end block check fails.
     */
    function _checkBlockWindow(
        BlockData memory blockData,
        string memory errorMessageStart,
        string memory errorMessageEnd
    )
        internal
        view
    {
        require(blockData.referenceBlockOffset < block.number, "UniV3HistoricalTwapIntent:invalid-reference-block");

        uint256 referenceBlock = block.number - blockData.referenceBlockOffset;

        if (
            referenceBlock - blockData.blockWindowTolerance > blockData.endBlock
                || referenceBlock + blockData.blockWindowTolerance < blockData.endBlock
        ) {
            revert(errorMessageEnd);
        }

        uint256 targetBlock = referenceBlock - blockData.blockWindow;

        if (
            targetBlock - blockData.blockWindowTolerance > blockData.startBlock
                || targetBlock + blockData.blockWindowTolerance < blockData.startBlock
        ) {
            revert(errorMessageStart);
        }
    }

    /**
     * @dev Verifies that the block range for both the numerator and denominator is valid.
     * This function ensures that the start and end blocks for the numerator and denominator
     * are within the acceptable tolerance range of their respective target blocks.
     *
     * @param numerator Data for the numerator's block range.
     * @param denominator Data for the denominator's block range.
     */
    function _checkBlocksRange(BlockData memory numerator, BlockData memory denominator) internal view {
        _checkBlockWindow(
            numerator,
            "UniV3HistoricalTwapIntent:invalid-numerator-block-window-start",
            "UniV3HistoricalTwapIntent:invalid-numerator-block-window-end"
        );
        _checkBlockWindow(
            denominator,
            "UniV3HistoricalTwapIntent:invalid-denominator-block-window-start",
            "UniV3HistoricalTwapIntent:invalid-denominator-block-window-end"
        );
    }

    /**
     * @dev Checks if the percentage difference between the numerator and denominator
     * is within the allowed range. This function determines the TWAP (Time Weighted Average Price)
     * for the numerator and denominator using the Uniswap V3 TWAP Oracle. It then computes the
     * percentage difference between them and ensures it's within the given min and max limits.
     *
     * @param intentData Encoded intent data.
     * @param hookData Encoded hook data.
     */
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

        require(percentageDifference >= minPercentageDifference, "UniV3HistoricalTwapIntent:low-difference");
        require(percentageDifference <= maxPercentageDifference, "UniV3HistoricalTwapIntent:high-difference");
    }

    /**
     * @dev Function to execute the intent and hook checks.
     * @param intent Contains data related to intent.
     * @param hook Contains data related to hook.
     */
    function execute(Intent calldata intent, Hook calldata hook) external view returns (bool) {
        require(intent.root == msg.sender, "UniV3HistoricalTwapIntent:invalid-root");
        require(intent.target == address(this), "UniV3HistoricalTwapIntent:invalid-target");

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

    /**
     * @dev Helper function to encode provided parameters into a byte array.
     * @param uniswapV3Pool Address of the UniswapV3Pool.
     * @param numeratorReferenceBlockOffset Number of blocks previous to the current block
     * @param numeratorBlockWindow Block window for numerator.
     * @param numeratorBlockWindowTolerance Tolerance window for numerator.
     * @param denominatorReferenceBlockOffset Number of blocks previous to the current block
     * @param denominatorBlockWindow Block window for denominator.
     * @param denominatorBlockWindowTolerance Tolerance window for denominator.
     * @param minPercentageDifference Minimum allowed percentage difference.
     * @param maxPercentageDifference Maximum allowed percentage difference.
     */
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
}
