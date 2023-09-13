import { defineConfig } from "@wagmi/cli";
import { foundry, react } from "@wagmi/cli/plugins";

export default defineConfig({
	out: "src/blockchain.ts",
	plugins: [
		react(),
		foundry({
			project: "../../contracts/intentify",
			include: [
				"Intentify.json",
				"IntentifySafeModule.json",
				"TimestampBeforeIntent.json",
				"TokenRouterReleaseIntent.json",
				"LimitOrderIntent.json",
				"Safe.json",
				"SafeProxy.json",
				"SafeProxyFactory.json",
				"MultiSend.json",
				"WalletFactory.json",
			],
		}),
	],
});
