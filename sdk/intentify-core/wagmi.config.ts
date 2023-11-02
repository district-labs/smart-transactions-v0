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
        'ERC20.json',
        'Intentify.json',
        'EngineHub.json',
        'IntentifySafeModule.json',
        'IntentifySafeModuleBundler.json',
        'AaveLeverageLongIntent.json',
        'BlockNumberIntent.json',
        'ChainlinkDataFeedIntent.json',
        'ERC20LimitOrderIntent.json',
        'ERC20TransferIntent.json',
        'ERC20RebalanceIntent.json',
        'ERC20SwapSpotPriceExactTokenInIntent.json',
        'ERC20SwapSpotPriceExactTokenOutIntent.json',
        'ERC20TipIntent.json',
        'EthTipIntent.json',
        'TimestampIntent.json',
        'UniswapV3HistoricalTwapPercentageChangeIntent.json',
        'UniswapV3TwapIntent.json'
      ],
    }),
  ],
});
