import { defineConfig } from '@wagmi/cli';
import { foundry } from '@wagmi/cli/plugins';

export default defineConfig({
  out: 'src/abis.ts',
  contracts: [],
  plugins: [
    foundry({
      project: '../../contracts/intentify',
      include: [
        'Intentify.json',
        'IntentifySafeModule.json',
        'IntentifySafeModuleBundler.json',
        'TimestampBeforeIntent.json',
        'TokenRouterReleaseIntent.json',
        'LimitOrderIntent.json',
      ],
    }),
  ],
});
