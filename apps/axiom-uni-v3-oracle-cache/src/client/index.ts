import { createPublicClient, http } from 'viem';
import { goerli } from 'viem/chains';

export const goerliclient = createPublicClient({ 
  chain: goerli,
  transport: http()
})