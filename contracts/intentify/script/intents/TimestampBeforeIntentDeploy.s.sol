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

// forge script script/intents/TimestampBeforeIntentDeploy.s.sol:TimestampBeforeIntentDeploy --fork-url http://localhost:8545 --broadcast
// forge script script/intents/TimestampBeforeIntentDeploy.s.sol:TimestampBeforeIntentDeploy --rpc-url $GOERLI_RPC_URL --broadcast --verify