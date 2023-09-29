// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { IntentifySafeModule } from "../../src/module/IntentifySafeModule.sol";
import { IntentifySafeModuleBundler } from "../../src/module/IntentifySafeModuleBundler.sol";
import { WalletFactory } from "../../src/WalletFactory.sol";
import { LimitOrderIntent } from "../../src/intents/LimitOrderIntent.sol";
import { TimestampAfterIntent } from "../../src/intents/TimestampAfterIntent.sol";
import { TimestampBeforeIntent } from "../../src/intents/TimestampBeforeIntent.sol";
import { TokenRouterReleaseIntent } from "../../src/intents/TokenRouterReleaseIntent.sol";
import { TwapIntent } from "../../src/intents/TwapIntent.sol";

contract CoreDeploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        // Periphery Contracts
        new WalletFactory();

        // Core Contracts
        new IntentifySafeModule();
        new IntentifySafeModuleBundler();

        // Intent Modules Contracts
        new LimitOrderIntent();
        new TimestampAfterIntent();
        new TimestampBeforeIntent();
        new TokenRouterReleaseIntent();
        new TwapIntent();
        vm.stopBroadcast();
    }
}
