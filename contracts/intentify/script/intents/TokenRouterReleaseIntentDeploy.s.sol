// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { TokenRouterReleaseIntent } from "../../src/intents/TokenRouterReleaseIntent.sol";

contract TokenRouterReleaseIntentDeploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        TokenRouterReleaseIntent tokenRouterReleaseIntent = new TokenRouterReleaseIntent();

        vm.stopBroadcast();
    }
}

// forge script script/intents/TokenRouterReleaseIntentDeploy.s.sol:TokenRouterReleaseIntentDeploy --fork-url http://localhost:8545 --broadcast
// forge script script/intents/TokenRouterReleaseIntentDeploy.s.sol:TokenRouterReleaseIntentDeploy --rpc-url $GOERLI_RPC_URL --broadcast --verify