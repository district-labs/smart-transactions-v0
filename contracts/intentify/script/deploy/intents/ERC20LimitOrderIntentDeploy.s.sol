// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { ERC20LimitOrderIntent } from "../../../src/intents/ERC20LimitOrderIntent.sol";

contract ERC20LimitOrderIntentDeploy is Script {
    function run(address intentifySafeModule) external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        ERC20LimitOrderIntent erc20LimitOrderIntent = new ERC20LimitOrderIntent(intentifySafeModule);

        vm.stopBroadcast();
    }
}
