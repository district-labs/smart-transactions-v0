// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { LimitOrderIntent } from "../../../src/intents/LimitOrderIntent.sol";

contract LimitOrderIntentDeploy is Script {
    function run(address intentifySafeModule) external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        LimitOrderIntent limitOrderIntent = new LimitOrderIntent(intentifySafeModule);

        vm.stopBroadcast();
    }
}
