// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { TimestampIntent } from "../../../src/intents/TimestampIntent.sol";

contract TimestampIntentDeploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        TimestampIntent TimestampIntent = new TimestampIntent();

        vm.stopBroadcast();
    }
}
