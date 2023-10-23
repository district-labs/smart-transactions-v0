// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { ERC20Mintable } from "../../../src/periphery/ERC20Mintable.sol";
import { TickMath } from "uniswap-v3-core/libraries/TickMath.sol";
import { UniswapV3Address } from "./lib/UniswapV3Address.sol";
import { IUniswapV3Factory } from "uniswap-v3-core/interfaces/IUniswapV3Factory.sol";
import { IUniswapV3Pool } from "uniswap-v3-core/interfaces/IUniswapV3Pool.sol";
import { INonfungiblePositionManager } from "uniswap-v3-periphery/interfaces/INonfungiblePositionManager.sol";
import { TransferHelper } from "uniswap-v3-periphery/libraries/TransferHelper.sol";

// This script mints a new position in a Uniswap V3 pool.
contract UniswapV3MintPosition is Script {
    uint256 private _deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    address private _deployerAddress = vm.addr(_deployerPrivateKey);

    function run(address token0, address token1, uint24 poolFee, uint256 token0Amount, uint256 token1Amount) external {
        vm.startBroadcast(_deployerPrivateKey);

        address uniswapV3PoolAddress =
            IUniswapV3Factory(UniswapV3Address.UNIV3_FACTORY).getPool(token0, token1, poolFee);

        IUniswapV3Pool uniswapV3Pool = IUniswapV3Pool(uniswapV3PoolAddress);
        int24 tickSpacing = uniswapV3Pool.tickSpacing();

        int24 tickLower = _getClosestMultiple(TickMath.MIN_TICK, tickSpacing, true);
        int24 tickUpper = _getClosestMultiple(TickMath.MAX_TICK, tickSpacing, false);

        _mintTokensAndApprove(ERC20Mintable(token0), ERC20Mintable(token1), token0Amount, token1Amount);

        INonfungiblePositionManager.MintParams memory params = INonfungiblePositionManager.MintParams({
            token0: uniswapV3Pool.token0(),
            token1: uniswapV3Pool.token1(),
            fee: poolFee,
            tickLower: tickLower,
            tickUpper: tickUpper,
            amount0Desired: token0Amount,
            amount1Desired: token1Amount,
            amount0Min: 0,
            amount1Min: 0,
            recipient: _deployerAddress,
            deadline: block.timestamp + 1000
        });

        INonfungiblePositionManager(UniswapV3Address.UNIV3_POS_MANAGER).mint(params);

        vm.stopBroadcast();
    }

    function _getClosestMultiple(int24 value, int24 base, bool roundUp) internal pure returns (int24) {
        int24 quotient = value / base;

        if (roundUp) {
            if (value % base != 0) {
                quotient++;
            }
        }
        return quotient * base;
    }

    function _mintTokensAndApprove(
        ERC20Mintable token0,
        ERC20Mintable token1,
        uint256 amount0Desired,
        uint256 amount1Desired
    )
        internal
    {
        token0.mint(_deployerAddress, amount0Desired);
        token1.mint(_deployerAddress, amount1Desired);

        TransferHelper.safeApprove(address(token0), UniswapV3Address.UNIV3_POS_MANAGER, amount0Desired);
        TransferHelper.safeApprove(address(token1), UniswapV3Address.UNIV3_POS_MANAGER, amount1Desired);
    }
}
