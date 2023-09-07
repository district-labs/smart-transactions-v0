import { defineConfig } from "@wagmi/cli"
import { foundry, react } from "@wagmi/cli/plugins"

export default defineConfig({
  out: "lib/generated/blockchain.ts",
  plugins: [
    react(),
    // foundry({
    //   project: "../../contracts/intentify",
    // }),
  ],
})
