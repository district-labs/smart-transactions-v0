import { defineConfig } from "@wagmi/cli"
import { foundry, react } from "@wagmi/cli/plugins"
import { erc20ABI } from "wagmi"

export default defineConfig({
  out: "lib/generated/blockchain.ts",
  plugins: [
    react(),
    foundry({
      project: "../../contracts/core",
    }),
  ],
})
