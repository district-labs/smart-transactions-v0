// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { IntentifySafeModule } from "../../../src/module/IntentifySafeModule.sol";
import { IntentifySafeModuleBundler } from "../../../src/module/IntentifySafeModuleBundler.sol";
import { WalletFactoryTestnet } from "../../../src/WalletFactoryTestnet.sol";
import { ChainlinkDataFeedIntent } from "../../../src/intents/ChainlinkDataFeedIntent.sol";
import { EthTipIntent } from "../../../src/intents/EthTipIntent.sol";
import { ERC20LimitOrderIntent } from "../../../src/intents/ERC20LimitOrderIntent.sol";
import { ERC20RebalanceIntent } from "../../../src/intents/ERC20RebalanceIntent.sol";
import { ERC20SwapSpotPriceBalanceTokenOutIntent } from
    "../../../src/intents/ERC20SwapSpotPriceBalanceTokenOutIntent.sol";
import { ERC20SwapSpotPriceExactTokenInIntent } from "../../../src/intents/ERC20SwapSpotPriceExactTokenInIntent.sol";
import { ERC20SwapSpotPriceExactTokenOutIntent } from "../../../src/intents/ERC20SwapSpotPriceExactTokenOutIntent.sol";
import { ERC20TipIntent } from "../../../src/intents/ERC20TipIntent.sol";
import { ERC20TransferIntent } from "../../../src/intents/ERC20TransferIntent.sol";
import { ERC4626DepositBalanceContinualIntent } from "../../../src/intents/ERC4626DepositBalanceContinualIntent.sol";
import { ERC20TipIntent } from "../../../src/intents/ERC20TipIntent.sol";
import { BlockNumberIntent } from "../../../src/intents/BlockNumberIntent.sol";
import { TimestampIntent } from "../../../src/intents/TimestampIntent.sol";
import { UniswapV3HistoricalTwapPercentageChangeIntent } from
    "../../../src/intents/UniswapV3HistoricalTwapPercentageChangeIntent.sol";
import { UniswapV3TwapIntent } from "../../../src/intents/UniswapV3TwapIntent.sol";

contract GoerliCoreDeploy is Script {
    function run(address multisend, address uniswapV3TwapOracleAddress) external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Core Contracts
        address intentifySafeModule = address(new IntentifySafeModule());
        new IntentifySafeModuleBundler();

        // Intent Modules Contracts
        new BlockNumberIntent();
        new ChainlinkDataFeedIntent();
        new EthTipIntent(intentifySafeModule);
        new ERC20SwapSpotPriceBalanceTokenOutIntent(intentifySafeModule);
        new ERC20TipIntent(intentifySafeModule);
        new ERC20TransferIntent(intentifySafeModule);
        new ERC20RebalanceIntent(intentifySafeModule,multisend);
        new ERC20LimitOrderIntent(intentifySafeModule);
        new ERC4626DepositBalanceContinualIntent(intentifySafeModule);
        new ERC20SwapSpotPriceExactTokenInIntent(intentifySafeModule);
        new ERC20SwapSpotPriceExactTokenOutIntent(intentifySafeModule);
        new TimestampIntent();
        new UniswapV3HistoricalTwapPercentageChangeIntent(uniswapV3TwapOracleAddress);
        new UniswapV3TwapIntent();
        vm.stopBroadcast();
    }
}