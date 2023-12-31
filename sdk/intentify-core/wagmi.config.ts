import { defineConfig } from "@wagmi/cli";
import { foundry } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "src/abis.ts",
  contracts: [],
  plugins: [
    foundry({
      project: "../../contracts/intentify",
      include: [
        "EngineHub.json",
        "ERC20.json",
        "ERC4626.json",
        "Intentify.json",
        "MultiCallWithFlashLoan.json",
        "IntentifySafeModule.json",
        "IntentifySafeModuleBundler.json",
        "AaveLeverageLongIntent.json",
        "AaveV3SupplyBalanceContinualIntent.json",
        "BlockNumberIntent.json",
        "ChainlinkDataFeedIntent.json",
        "ERC20LimitOrderIntent.json",
        "ERC20TransferIntent.json",
        "ERC20RebalanceIntent.json",
        "ERC20SwapSpotPriceBalanceTokenOutIntent.json",
        "ERC20SwapSpotPriceExactTokenInIntent.json",
        "ERC20SwapSpotPriceExactTokenOutIntent.json",
        "ERC20TipIntent.json",
        "ERC4626DepositBalanceContinualIntent.json",
        "EthTipIntent.json",
        "TimestampIntent.json",
        "UniswapV3HistoricalTwapPercentageChangeIntent.json",
        "UniswapV3TwapIntent.json",
        "WalletFactory.json",
        "WalletFactoryTestnet.json",
      ],
    }),
  ],
});
