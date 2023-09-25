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

contract TestnetDeploy is Script {
    function run() external {
        address DEPLOYER_PUBLIC = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
        uint256 DEPLOYER_PRIVATE = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
        vm.startBroadcast(DEPLOYER_PRIVATE);
        // Core Contracts
        new IntentifySafeModule();
        new WalletFactory();

        // Intent Modules Contracts
        new LimitOrderIntent();
        new TimestampAfterIntent();
        new TimestampBeforeIntent();
        new TokenRouterReleaseIntent();
        new TwapIntent();
        new IntentifySafeModuleBundler();
        vm.stopBroadcast();
    }
}
