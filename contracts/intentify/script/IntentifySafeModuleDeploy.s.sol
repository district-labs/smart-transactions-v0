// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { IntentifySafeModule } from "../src/module/IntentifySafeModule.sol";

contract IntentifySafeModuleDeploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        IntentifySafeModule intentifySafeModule = new IntentifySafeModule();

        vm.stopBroadcast();
    }
}
