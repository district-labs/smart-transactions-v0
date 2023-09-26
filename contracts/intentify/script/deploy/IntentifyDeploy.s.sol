// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { Intentify } from "../../src/Intentify.sol";

contract TwapIntentDeploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        Intentify intentify = new Intentify(
            vm.addr(deployerPrivateKey),
            "Intentify",
            "V0"
        );

        vm.stopBroadcast();
    }
}
