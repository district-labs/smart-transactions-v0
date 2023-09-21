// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import { TickMath } from "@uniswap/v3-core/libraries/TickMath.sol";
import { INonfungiblePositionManager } from "@uniswap/v3-periphery/interfaces/INonfungiblePositionManager.sol";
import "@uniswap/v3-core/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-core/interfaces/IUniswapV3Pool.sol";

import "forge-std/Script.sol";
import { console2 } from "forge-std/console2.sol";
import { ERC20Mintable } from "../src/periphery/ERC20Mintable.sol";

contract UniswapV3PoolDeploy is Script {
    address public immutable uniswapV3Factory = address(0x1F98431c8aD98523631AE4a59f267346ea31F984);

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        ERC20Mintable disUSDC = new ERC20Mintable("District Labs USDC","disUSDC",6);
        ERC20Mintable disWETH = new ERC20Mintable("District Labs WETH","disWETH",18);

        uint24 poolFee = uint24(100);

        address uniswapV3PoolAddress =
            IUniswapV3Factory(uniswapV3Factory).createPool(address(disUSDC), address(disWETH), poolFee);

        console2.log("UniswapV3Pool address: %s", uniswapV3PoolAddress);

        IUniswapV3Pool uniswapV3Pool = IUniswapV3Pool(uniswapV3PoolAddress);

        address recipient = vm.envAddress("RECIPIENT");
        int24 tickLower = vm.envInt("TICK_LOWER");
        int24 tickUpper = vm.envInt("TICK_UPPER");
        uint256 amount = vm.envUint("AMOUNT");
        bytes memory data = vm.envBytes("DATA");

        INonfungiblePositionManager.MintParams memory params =
            INonfungiblePositionManager.MintParams({
                token0: disUSDC,
                token1: disWETH,
                fee: poolFee,
                tickLower: TickMath.MIN_TICK,
                tickUpper: TickMath.MAX_TICK,
                amount0Desired: amount0ToMint,
                amount1Desired: amount1ToMint,
                amount0Min: 0,
                amount1Min: 0,
                recipient: recipient,
                deadline: block.timestamp
            });

        // Note that the pool defined by DAI/USDC and fee tier 0.3% must already be created and initialized in order to mint
        (tokenId, liquidity, amount0, amount1) = nonfungiblePositionManager.mint(params);

        // TODO: add pool initialization

        vm.stopBroadcast();
    }
}
