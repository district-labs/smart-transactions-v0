// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { ERC20RebalanceIntent } from "../../../src/intents/ERC20RebalanceIntent.sol";

contract ERC20RebalanceIntentDeploy is Script {
    function run(address intentifySafeModule, address multisend) external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        ERC20RebalanceIntent erc20RebalanceIntent = new ERC20RebalanceIntent(intentifySafeModule, multisend);

        vm.stopBroadcast();
    }
}
