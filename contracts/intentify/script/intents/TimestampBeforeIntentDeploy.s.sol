// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { TimestampBeforeIntent } from "../../src/intents/TimestampBeforeIntent.sol";

contract TimestampBeforeIntentDeploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        TimestampBeforeIntent timestampBeforeIntent = new TimestampBeforeIntent();

        vm.stopBroadcast();
    }
}
