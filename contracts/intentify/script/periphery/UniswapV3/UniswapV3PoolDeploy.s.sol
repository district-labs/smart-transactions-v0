// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import "./lib/SqrtMath.sol";

import { console2 } from "forge-std/console2.sol";
import { UniswapV3Address } from "./lib/UniswapV3Address.sol";
import { IUniswapV3Factory } from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import { IUniswapV3Pool } from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import { INonfungiblePositionManager } from "@uniswap/v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol";

// This script deploys a Uniswap V3 pool and initializes it.
contract UniswapV3PoolDeploy is Script {
    function run(address token0, address token1, uint24 poolFee, uint256 token0Amount, uint256 token1Amount) external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        uint160 sqrtPriceX96 = encodePriceSqrt(token1Amount, token0Amount);
        address uniswapV3PoolAddress = INonfungiblePositionManager(UniswapV3Address.UNIV3_POS_MANAGER)
            .createAndInitializePoolIfNecessary(token0, token1, poolFee, sqrtPriceX96);

        console2.log("UniswapV3 Pool Adress: %s", uniswapV3PoolAddress);
        vm.stopBroadcast();
    }
}
