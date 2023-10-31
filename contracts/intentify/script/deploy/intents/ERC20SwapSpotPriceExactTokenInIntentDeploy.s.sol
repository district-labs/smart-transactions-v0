// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { ERC20SwapSpotPriceExactTokenInIntent } from "../../../src/intents/ERC20SwapSpotPriceExactTokenInIntent.sol";

contract ERC20SwapSpotPriceExactTokenInIntentDeploy is Script {
    function run(address intentifySafeModule) external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        ERC20SwapSpotPriceExactTokenInIntent erc20SwapSpotPriceExactTokenInIntent =
            new ERC20SwapSpotPriceExactTokenInIntent(intentifySafeModule);

        vm.stopBroadcast();
    }
}
