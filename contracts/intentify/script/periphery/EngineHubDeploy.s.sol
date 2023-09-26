// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { EngineHub } from "../../src/periphery/EngineHub.sol";

contract EngineHubDeploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        EngineHub engineHub = new EngineHub(vm.addr(deployerPrivateKey));

        vm.stopBroadcast();
    }
}
