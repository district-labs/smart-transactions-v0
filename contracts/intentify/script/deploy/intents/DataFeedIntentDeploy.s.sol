// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { DataFeedIntent } from "../../../src/intents/DataFeedIntent.sol";

contract DataFeedIntentDeploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        DataFeedIntent dataFeedIntent = new DataFeedIntent();

        vm.stopBroadcast();
    }
}
