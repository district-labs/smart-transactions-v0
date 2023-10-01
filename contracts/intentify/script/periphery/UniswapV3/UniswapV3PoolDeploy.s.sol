// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import "./lib/SqrtMath.sol";
import { UniswapV3Address } from "./lib/UniswapV3Address.sol";
import { TickMath } from "@uniswap/v3-core/contracts/libraries/TickMath.sol";
import { TransferHelper } from "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import { INonfungiblePositionManager } from "@uniswap/v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol";
import { IUniswapV3Factory } from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import { IUniswapV3Pool } from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";

import { ERC20Mintable } from "../../../src/periphery/ERC20Mintable.sol";

contract UniswapV3PoolDeploy is Script {
    INonfungiblePositionManager public nonfungiblePositionManager =
        INonfungiblePositionManager(UniswapV3Address.UNIV3_POS_MANAGER);
    uint256 private deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    address private deployerAddress = vm.addr(deployerPrivateKey);

    function run() external {
        vm.startBroadcast(deployerPrivateKey);

        uint24 poolFee = 3000;
        uint24 tickWidth = 2;
        int24 tickSpacing;

        uint256 amount0Desired = 15_000e6;
        uint256 amount1Desired = 10e18;

        uint160 sqrtPriceX96 = encodePriceSqrt(amount1Desired, amount0Desired);

        // address uniswapV3PoolAddress =
        //     IUniswapV3Factory(UniswapV3Address.UNIV3_FACTORY).createPool(address(disUSDC), address(disWETH),
        // poolFee);
        IUniswapV3Pool uniswapV3Pool = IUniswapV3Pool(address(0x5c33044BdBbE55dAb3d526CE70F908aAF6990373));
        // uniswapV3Pool.initialize(sqrtPriceX96);

        tickSpacing = uniswapV3Pool.tickSpacing();

        mintTokensAndApprove(
            ERC20Mintable(0x18Be8De03fb9c521703DE8DED7Da5031851CbBEB),
            ERC20Mintable(0xb3c67821F9DCbB424ca3Ddbe0B349024D5E2A739),
            amount0Desired,
            amount1Desired
        );

        (, int24 curTick,,,,,) = uniswapV3Pool.slot0();
        curTick = curTick - (curTick % tickSpacing);

        int24 lowerTick = -887_220;
        //  curTick - (tickSpacing * int24(tickWidth));
        int24 upperTick = 887_220;
        //  curTick + (tickSpacing * int24(tickWidth));

        INonfungiblePositionManager.MintParams memory params = INonfungiblePositionManager.MintParams({
            token0: uniswapV3Pool.token0(),
            token1: uniswapV3Pool.token1(),
            fee: poolFee,
            tickLower: lowerTick,
            tickUpper: upperTick,
            amount0Desired: amount0Desired,
            amount1Desired: amount1Desired,
            amount0Min: 0e6,
            amount1Min: 0e18,
            recipient: deployerAddress,
            deadline: block.timestamp + 1000
        });

        nonfungiblePositionManager.mint(params);

        vm.stopBroadcast();
    }

    function mintTokensAndApprove(
        ERC20Mintable token0,
        ERC20Mintable token1,
        uint256 amount0Desired,
        uint256 amount1Desired
    )
        internal
    {
        token0.mint(deployerAddress, amount0Desired);
        token1.mint(deployerAddress, amount1Desired);

        TransferHelper.safeApprove(address(token0), address(nonfungiblePositionManager), amount0Desired);
        TransferHelper.safeApprove(address(token1), address(nonfungiblePositionManager), amount1Desired);
    }
}