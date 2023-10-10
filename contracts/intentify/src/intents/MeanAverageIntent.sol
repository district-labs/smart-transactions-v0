// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-core/contracts/libraries/TickMath.sol";
import "@uniswap/v3-core/contracts/libraries/FixedPoint96.sol";
import "@uniswap/v3-core/contracts/libraries/FullMath.sol";

import { IHook } from "../interfaces/IHook.sol";
import { Intent } from "../TypesAndDecoders.sol";
import { BytesLib } from "../libraries/BytesLib.sol";
import { Oracle } from "@uniswap/v3-core/contracts/libraries/Oracle.sol";
import { UniswapV3TwapOracle } from "../periphery/Axiom/UniswapV3TwapOracle.sol";

contract MeanAverageIntent is IHook {
    UniswapV3TwapOracle internal _uniswapV3TwapOracle;

    constructor(address _uniswapV3TwapOracleAddress) {
        _uniswapV3TwapOracle = UniswapV3TwapOracle(_uniswapV3TwapOracleAddress);
    }

    function execute(Intent calldata intent) external view returns (bool) {
        require(intent.root == msg.sender, "MeanAverageIntent:invalid-root");
        require(intent.target == address(this), "MeanAverageIntent:invalid-target");

        (
            address uniswapV3Pool,
            uint256 startBlockNumber,
            uint256 endBlockNumber,
            uint256 minPriceX96,
            uint256 maxPriceX96
        ) = abi.decode(intent.data, (address, uint256, uint256, uint256, uint256));

        (int24 twaTick,,,) = _uniswapV3TwapOracle.getUniswapV3TWAP(uniswapV3Pool, startBlockNumber, endBlockNumber);

        uint256 twaPriceX96 = TickMath.getSqrtRatioAtTick(twaTick);

        if (twaPriceX96 < minPriceX96) {
            revert("TwapIntent:low-price");
        }

        if (twaPriceX96 > maxPriceX96) {
            revert("TwapIntent:high-price");
        }

        return true;
    }

    function encode(
        address uniswapV3Pool,
        uint256 startBlockNumber,
        uint256 endBlockNumber,
        uint256 minPriceX96,
        uint256 maxPriceX96
    )
        external
        pure
        returns (bytes memory data)
    {
        data = abi.encode(uniswapV3Pool, startBlockNumber, endBlockNumber, minPriceX96, maxPriceX96);
    }
}
