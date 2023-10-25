// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { UniswapV3TwapIntent } from "../../../src/intents/UniswapV3TwapIntent.sol";

contract TwapIntentDeploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        UniswapV3TwapIntent uniswapV3TwapIntent = new UniswapV3TwapIntent();

        vm.stopBroadcast();
    }
}
