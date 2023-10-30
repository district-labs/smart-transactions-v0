// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { IntentifySafeModule } from "../../src/module/IntentifySafeModule.sol";
import { IntentifySafeModuleBundler } from "../../src/module/IntentifySafeModuleBundler.sol";
import { WalletFactory } from "../../src/WalletFactory.sol";
import { ERC20LimitOrderIntent } from "../../src/intents/ERC20LimitOrderIntent.sol";
import { ERC20SwapSpotPriceExactTokenInIntent } from "../../src/intents/ERC20SwapSpotPriceExactTokenInIntent.sol";
import { ERC20SwapSpotPriceExactTokenOutIntent } from "../../src/intents/ERC20SwapSpotPriceExactTokenOutIntent.sol";
import { BlockNumberIntent } from "../../src/intents/BlockNumberIntent.sol";
import { TimestampIntent } from "../../src/intents/TimestampIntent.sol";
import { UniswapV3TwapIntent } from "../../src/intents/UniswapV3TwapIntent.sol";

contract CoreDeploy is Script {
    function run(address intentifySafeModule) external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        // Periphery Contracts
        new WalletFactory();

        // Core Contracts
        new IntentifySafeModule();
        new IntentifySafeModuleBundler();

        // Intent Modules Contracts
        new ERC20LimitOrderIntent(intentifySafeModule);
        new ERC20SwapSpotPriceExactTokenInIntent(intentifySafeModule);
        new ERC20SwapSpotPriceExactTokenOutIntent(intentifySafeModule);
        new BlockNumberIntent();
        new TimestampIntent();
        new UniswapV3TwapIntent();
        vm.stopBroadcast();
    }
}
