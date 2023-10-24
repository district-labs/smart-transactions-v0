// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { IntentifySafeModule } from "../../src/module/IntentifySafeModule.sol";
import { IntentifySafeModuleBundler } from "../../src/module/IntentifySafeModuleBundler.sol";
import { WalletFactory } from "../../src/WalletFactory.sol";
import { ERC20LimitOrderIntent } from "../../src/intents/ERC20LimitOrderIntent.sol";
import { TimestampIntent } from "../../src/intents/TimestampIntent.sol";
import { UniswapV3TwapIntent } from "../../src/intents/UniswapV3TwapIntent.sol";

contract TestnetDeploy is Script {
    function run(address intentifySafeModule) external {
        address DEPLOYER_PUBLIC = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
        uint256 DEPLOYER_PRIVATE = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
        vm.startBroadcast(DEPLOYER_PRIVATE);
        // Core Contracts
        new IntentifySafeModule();
        new WalletFactory();

        // Intent Modules Contracts
        new ERC20LimitOrderIntent(intentifySafeModule);
        new TimestampIntent();
        new UniswapV3TwapIntent();
        new IntentifySafeModuleBundler();
        vm.stopBroadcast();
    }
}
