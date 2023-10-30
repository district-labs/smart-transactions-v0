// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { ERC20SwapSpotPriceExactTokenOutIntent } from "../../../src/intents/ERC20SwapSpotPriceExactTokenOutIntent.sol";

contract ERC20SwapSpotPriceExactTokenOutIntentDeploy is Script {
    function run(address intentifySafeModule) external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        ERC20SwapSpotPriceExactTokenOutIntent erc20SwapSpotPriceExactTokenOutIntent =
            new ERC20SwapSpotPriceExactTokenOutIntent(intentifySafeModule);

        vm.stopBroadcast();
    }
}
