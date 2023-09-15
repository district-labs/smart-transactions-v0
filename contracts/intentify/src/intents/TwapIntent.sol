// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-core/contracts/libraries/TickMath.sol";
import "@uniswap/v3-core/contracts/libraries/FixedPoint96.sol";
import "@uniswap/v3-core/contracts/libraries/FullMath.sol";

import { IHook } from "../interfaces/IHook.sol";
import { Intent } from "../TypesAndDecoders.sol";
import { BytesLib } from "../libraries/BytesLib.sol";

contract TwapIntent is IHook {
    function execute(Intent calldata intent) external view returns (bool) {
        require(intent.exec.root == msg.sender, "TwapIntent:invalid-root");
        require(intent.exec.target == address(this), "TwapIntent:invalid-target");

        (address uniswapV3Pool, uint32 twapIntervalSeconds, uint256 minPriceX96, uint256 maxPriceX96) =
            abi.decode(intent.exec.data, (address, uint32, uint256, uint256));
        uint256 priceX96 = _getTwapX96(uniswapV3Pool, twapIntervalSeconds);

        if (priceX96 < minPriceX96) {
            revert("TwapIntent:low-price");
        }

        if (priceX96 > maxPriceX96) {
            revert("TwapIntent:high-price");
        }

        return true;
    }

    function encode(
        address uniswapV3Pool,
        uint32 twapIntervalSeconds,
        uint256 minPriceX96,
        uint256 maxPriceX96
    )
        external
        pure
        returns (bytes memory data)
    {
        data = abi.encode(uniswapV3Pool, twapIntervalSeconds, minPriceX96, maxPriceX96);
    }

    function _getTwapX96(address uniswapV3Pool, uint32 twapIntervalSeconds) internal view returns (uint256 priceX96) {
        uint160 sqrtPriceX96;

        if (twapIntervalSeconds == 0) {
            // return the current price if twapInterval == 0
            (sqrtPriceX96,,,,,,) = IUniswapV3Pool(uniswapV3Pool).slot0();
        } else {
            uint32[] memory secondsAgos = new uint32[](2);
            secondsAgos[0] = twapIntervalSeconds; // from (before)
            secondsAgos[1] = 0; // to (now)

            (int56[] memory tickCumulatives,) = IUniswapV3Pool(uniswapV3Pool).observe(secondsAgos);

            // tick(imprecise as it's an integer) to price
            sqrtPriceX96 = TickMath.getSqrtRatioAtTick(
                int24((tickCumulatives[1] - tickCumulatives[0]) / int56(int256(uint256(twapIntervalSeconds))))
            );
        }

        // Uniswap prices are scaled up by 2**96
        priceX96 = FullMath.mulDiv(sqrtPriceX96, sqrtPriceX96, FixedPoint96.Q96);
    }
}
