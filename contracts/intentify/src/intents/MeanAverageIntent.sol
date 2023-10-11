// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { IUniswapV3Pool } from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import { TickMath } from "@uniswap/v3-core/contracts/libraries/TickMath.sol";
import { FixedPoint96 } from "@uniswap/v3-core/contracts/libraries/FixedPoint96.sol";
import { FullMath } from "@uniswap/v3-core/contracts/libraries/FullMath.sol";
import { UniswapV3TwapOracle } from "../periphery/Axiom/UniswapV3TwapOracle.sol";
import { console2 } from "forge-std/console2.sol";
import { Intent, Hook } from "../TypesAndDecoders.sol";

contract MeanAverageIntent {
    UniswapV3TwapOracle internal _uniswapV3TwapOracle;

    constructor(address _uniswapV3TwapOracleAddress) {
        _uniswapV3TwapOracle = UniswapV3TwapOracle(_uniswapV3TwapOracleAddress);
    }

    function _checkBlocksRange(
        Intent calldata intent,
        uint256 numeratorStartBlock,
        uint256 numeratorEndBlock,
        uint256 denominatorStartBlock,
        uint256 denominatorEndBlock
    )
        internal
        view
    {
        (
            ,
            uint256 numeratorBlockWindow,
            uint256 numeratorBlockWindowTolerance,
            uint256 denominatorBlockWindow,
            uint256 denominatorBlockWindowTolerance,
            ,
        ) = abi.decode(intent.data, (address, uint256, uint256, uint256, uint256, uint256, uint256));

        // Check if the block window is within tolerance
        if (block.number < numeratorEndBlock || block.number - numeratorBlockWindowTolerance > numeratorEndBlock) {
            revert("MeanAverageIntent:invalid-numerator-end-block");
        }
        if (block.number < denominatorEndBlock || block.number - denominatorBlockWindowTolerance > denominatorEndBlock)
        {
            revert("MeanAverageIntent:invalid-denominator-end-block");
        }

        uint256 numeratorTargetBlock = block.number - numeratorBlockWindow;
        uint256 denominatorTargetBlock = block.number - denominatorBlockWindow;

        if (
            numeratorTargetBlock - numeratorBlockWindowTolerance > numeratorStartBlock
                || numeratorTargetBlock + numeratorBlockWindowTolerance < numeratorStartBlock
        ) {
            revert("MeanAverageIntent:invalid-numerator-block-window");
        }

        if (
            denominatorTargetBlock - denominatorBlockWindowTolerance > denominatorStartBlock
                || denominatorTargetBlock + denominatorBlockWindowTolerance < denominatorStartBlock
        ) {
            revert("MeanAverageIntent:invalid-denominator-block-window");
        }
    }

    function _checkPercentageDifference(
        Intent calldata intent,
        uint256 numeratorStartBlock,
        uint256 numeratorEndBlock,
        uint256 denominatorStartBlock,
        uint256 denominatorEndBlock
    )
        internal
        view
    {
        (address uniswapV3Pool,,,,, uint256 minPercentageDifference, uint256 maxPercentageDifference) =
            abi.decode(intent.data, (address, uint256, uint256, uint256, uint256, uint256, uint256));

        (int24 numeratorTwaTick,,,) =
            _uniswapV3TwapOracle.getUniswapV3TWAP(uniswapV3Pool, numeratorStartBlock, numeratorEndBlock);

        (int24 denominatorTwaTick,,,) =
            _uniswapV3TwapOracle.getUniswapV3TWAP(uniswapV3Pool, denominatorStartBlock, denominatorEndBlock);

        uint160 numeratorSqrtPriceX96 = TickMath.getSqrtRatioAtTick(numeratorTwaTick);
        uint160 denominatorSqrtPriceX96 = TickMath.getSqrtRatioAtTick(denominatorTwaTick);

        uint256 numeratorPriceX96 = FullMath.mulDiv(numeratorSqrtPriceX96, numeratorSqrtPriceX96, FixedPoint96.Q96);
        uint256 denominatorPriceX96 =
            FullMath.mulDiv(denominatorSqrtPriceX96, denominatorSqrtPriceX96, FixedPoint96.Q96);

        // Check Percentage difference 3 decimals
        uint256 percentageDifference = (numeratorPriceX96 * 100_000) / denominatorPriceX96;

        if (percentageDifference < minPercentageDifference) {
            revert("MeanAverageIntent:low-difference");
        }

        if (percentageDifference > maxPercentageDifference) {
            revert("MeanAverageIntent:high-difference");
        }
    }

    function execute(Intent calldata intent, Hook calldata hook) external view returns (bool) {
        require(intent.root == msg.sender, "MeanAverageIntent:invalid-root");
        require(intent.target == address(this), "MeanAverageIntent:invalid-target");

        (
            uint256 numeratorStartBlock,
            uint256 numeratorEndBlock,
            uint256 denominatorStartBlock,
            uint256 denominatorEndBlock
        ) = abi.decode(hook.data, (uint256, uint256, uint256, uint256));

        _checkBlocksRange(intent, numeratorStartBlock, numeratorEndBlock, denominatorStartBlock, denominatorEndBlock);

        _checkPercentageDifference(
            intent, numeratorStartBlock, numeratorEndBlock, denominatorStartBlock, denominatorEndBlock
        );
        return true;
    }

    function encode(
        address uniswapV3Pool,
        uint256 numeratorBlockWindow,
        uint256 numeratorBlockWindowTolerance,
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
            numeratorBlockWindow,
            numeratorBlockWindowTolerance,
            denominatorBlockWindow,
            denominatorBlockWindowTolerance,
            minPercentageDifference,
            maxPercentageDifference
        );
    }
}
