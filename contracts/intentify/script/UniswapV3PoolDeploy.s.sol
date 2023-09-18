// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
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

        address uniswapV3PoolAddress =
            IUniswapV3Factory(uniswapV3Factory).createPool(address(disUSDC), address(disWETH), uint24(100));

        console2.log("UniswapV3Pool address: %s", uniswapV3PoolAddress);

        // TODO: add pool initialization

        vm.stopBroadcast();
    }
}
