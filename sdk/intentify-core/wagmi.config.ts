import { defineConfig } from "@wagmi/cli";
import { foundry } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "src/abis.ts",
  contracts: [],
  plugins: [
    foundry({
      project: "../../contracts/intentify",
      include: [
        "ERC20.json",
        "Intentify.json",
        "IntentifySafeModule.json",
        "IntentifySafeModuleBundler.json",
        "TimestampIntent.json",
        "TokenRouterReleaseIntent.json",
        "LimitOrderIntent.json",
        "EngineHub.json",
      ],
    }),
  ],
});
