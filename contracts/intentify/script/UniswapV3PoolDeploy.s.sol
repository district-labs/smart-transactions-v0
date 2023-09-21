// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import { TickMath } from "@uniswap/v3-core/contracts/libraries/TickMath.sol";
import { TransferHelper } from "v3-periphery/libraries/TransferHelper.sol";
import { INonfungiblePositionManager } from "v3-periphery/interfaces/INonfungiblePositionManager.sol";
import { IUniswapV3Factory } from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import { IUniswapV3Pool } from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";

import "forge-std/Script.sol";
import { ERC20Mintable } from "../src/periphery/ERC20Mintable.sol";

contract UniswapV3PoolDeploy is Script {
    address public immutable uniswapV3Factory = address(0x1F98431c8aD98523631AE4a59f267346ea31F984); // goerli
    INonfungiblePositionManager nonfungiblePositionManager =
        INonfungiblePositionManager(0xC36442b4a4522E871399CD717aBDD847Ab11FE88); // goerli

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        ERC20Mintable disUSDC = new ERC20Mintable("Test USDC","testUSDC",6);
        ERC20Mintable disWETH = new ERC20Mintable("Test WETH","testWETH",18);

        uint24 poolFee = uint24(3000);
        uint160 sqrtPriceX96 = TickMath.getSqrtRatioAtTick(TickMath.MAX_TICK);

        address uniswapV3PoolAddress =
            IUniswapV3Factory(uniswapV3Factory).createPool(address(disUSDC), address(disWETH), poolFee );

        IUniswapV3Pool uniswapV3Pool = IUniswapV3Pool(uniswapV3PoolAddress);
        uniswapV3Pool.initialize(sqrtPriceX96);

        // Mint to TESTING account
        address metamask = 0xbcB93066f45d7e10DABBd233c4898509cf271216;
        disUSDC.mint(metamask, 10_000e6);
        disWETH.mint(metamask, 10_000e18);

        address executor = 0x983d2CbE5525cFf49c3d4F949AD6766c7d01244F;
        // Mint to DEPLOYER address
        disUSDC.mint(address(executor), 10_000e6);
        disWETH.mint(address(executor), 10_000e18);
        TransferHelper.safeApprove(address(disUSDC), address(nonfungiblePositionManager), 10_000e6);
        TransferHelper.safeApprove(address(disWETH), address(nonfungiblePositionManager), 10_000e18);
        // disUSDC.approve(address(nonfungiblePositionManager), type(uint256).max);
        // disWETH.approve(address(nonfungiblePositionManager), type(uint256).max);

        address recipient = address(metamask);
        uint256 amount0Desired = 1000;
        uint256 amount1Desired = 1000;

        INonfungiblePositionManager.MintParams memory params = INonfungiblePositionManager.MintParams({
            token0: address(disUSDC),
            token1: address(disWETH),
            fee: poolFee,
            tickLower: TickMath.MIN_TICK,
            tickUpper: TickMath.MAX_TICK,
            amount0Desired: amount0Desired,
            amount1Desired: amount1Desired,
            amount0Min: 0,
            amount1Min: 0,
            recipient: recipient,
            deadline: block.timestamp
        });

        // int24 amount0 = 1;
        // int24 amount1 = 100;

        (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1) = nonfungiblePositionManager.mint(params);

        // TODO: add pool initialization

        vm.stopBroadcast();
    }
}
