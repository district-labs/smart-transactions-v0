// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { ChainlinkDataFeedIntent } from "../../../src/intents/ChainlinkDataFeedIntent.sol";

contract ChainlinkDataFeedIntentDeploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        ChainlinkDataFeedIntent chainlinkDataFeedIntent = new ChainlinkDataFeedIntent();

        vm.stopBroadcast();
    }
}
