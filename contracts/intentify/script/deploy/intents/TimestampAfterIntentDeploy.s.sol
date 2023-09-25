// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import {TimestampAfterIntent} from "../../../src/intents/TimestampAfterIntent.sol";

contract TimestampAfterIntentDeploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        TimestampAfterIntent timestampAfterIntent = new TimestampAfterIntent();

        vm.stopBroadcast();
    }
}
