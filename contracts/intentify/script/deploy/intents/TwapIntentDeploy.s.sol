// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { TwapIntent } from "../../../src/intents/TwapIntent.sol";

contract TwapIntentDeploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        TwapIntent twapIntent = new TwapIntent();

        vm.stopBroadcast();
    }
}
