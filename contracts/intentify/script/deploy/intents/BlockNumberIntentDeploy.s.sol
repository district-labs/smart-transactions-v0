// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { BlockNumberIntent } from "../../../src/intents/BlockNumberIntent.sol";

contract BlockNumberIntentDeploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        BlockNumberIntent blockNumberIntent = new BlockNumberIntent();

        vm.stopBroadcast();
    }
}
