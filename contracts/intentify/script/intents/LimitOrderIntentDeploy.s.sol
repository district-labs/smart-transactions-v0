// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { LimitOrderIntent } from "../../src/intents/LimitOrderIntent.sol";

contract LimitOrderIntentDeploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        LimitOrderIntent limitOrderIntent = new LimitOrderIntent();

        vm.stopBroadcast();
    }
}

// forge script script/intents/LimitOrderIntentDeploy.s.sol:LimitOrderIntentDeploy --fork-url http://localhost:8545 --broadcast
// forge script script/intents/LimitOrderIntentDeploy.s.sol:LimitOrderIntentDeploy --rpc-url $GOERLI_RPC_URL --broadcast --verify
