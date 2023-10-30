import { defineConfig } from '@wagmi/cli';
import { foundry, react } from '@wagmi/cli/plugins';

export default defineConfig({
  out: 'src/blockchain.ts',
  contracts: [],
  plugins: [
    react(),
    foundry({
      project: '../../contracts/intentify',
      include: [
        'Intentify.json',
        'IntentifySafeModule.json',
        'IntentifySafeModuleBundler.json',
        'TimestampIntent.json',
        'TokenRouterReleaseIntent.json',
        'LimitOrderIntent.json',
        'Safe.json',
        'WalletFactory.json',
        'WalletFactoryTestnet.json',
      ],
    }),
  ],
});
