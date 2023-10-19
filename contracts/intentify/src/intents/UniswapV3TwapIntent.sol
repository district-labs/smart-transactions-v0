// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import { IUniswapV3Pool } from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import { TickMath } from "@uniswap/v3-core/contracts/libraries/TickMath.sol";
import { FullMath } from "@uniswap/v3-core/contracts/libraries/FullMath.sol";
import { FixedPoint96 } from "@uniswap/v3-core/contracts/libraries/FixedPoint96.sol";

import { IntentAbstract } from "../abstracts/IntentAbstract.sol";
import { Intent } from "../TypesAndDecoders.sol";

/// @title Uniswap V3 TWAP Intent
/// @notice An intent that executes if the time weighted average price of a Uniswap V3 pool is within a range over a
/// time period.
contract UniswapV3TwapIntent is IntentAbstract {
    /*//////////////////////////////////////////////////////////////////////////
                                CUSTOM ERRORS
    //////////////////////////////////////////////////////////////////////////*/

    /// @dev The twap price is below the minimum price.
    error LowPrice();

    /// @dev The twap price is above the maximum price.
    error HighPrice();

    /*//////////////////////////////////////////////////////////////////////////
                                READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Helper function to encode intent parameters into a byte array.
    /// @param uniswapV3Pool The address of the Uniswap V3 pool.
    /// @param twapIntervalSeconds The time period over which to calculate the twap.
    /// @param minPriceX96 The minimum price of the twap.
    /// @param maxPriceX96 The maximum price of the twap.
    /// @return data The encoded parameters.
    function encodeIntent(
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

    /*//////////////////////////////////////////////////////////////////////////
                                   WRITE FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @inheritdoc IntentAbstract
    function execute(Intent calldata intent)
        external
        view
        override
        validIntentRoot(intent)
        validIntentTarget(intent)
        returns (bool)
    {
        (address uniswapV3Pool, uint32 twapIntervalSeconds, uint256 minPriceX96, uint256 maxPriceX96) =
            _decodeIntent(intent);
        uint256 priceX96 = _getTwapX96(uniswapV3Pool, twapIntervalSeconds);

        if (priceX96 < minPriceX96) {
            revert LowPrice();
        }
        if (priceX96 > maxPriceX96) {
            revert HighPrice();
        }

        return true;
    }

    /*//////////////////////////////////////////////////////////////////////////
                              INTERNAL READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    function _decodeIntent(Intent calldata intent)
        internal
        pure
        returns (address uniswapV3Pool, uint32 twapIntervalSeconds, uint256 minPriceX96, uint256 maxPriceX96)
    {
        return abi.decode(intent.data, (address, uint32, uint256, uint256));
    }

    /// @notice Helper function to get the twap price of a Uniswap V3 pool.
    /// @param uniswapV3Pool The address of the Uniswap V3 pool.
    /// @param twapIntervalSeconds The time period over which to calculate the twap.
    /// @return priceX96 The twap price of the Uniswap V3 pool scaled up by 2**96.
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
