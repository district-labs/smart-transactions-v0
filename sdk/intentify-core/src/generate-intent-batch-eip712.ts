import { SignTypedDataParameters } from 'viem';
import { eip712Types } from './eip712-types';
import { IntentBatch } from './types';

type SignIntentBundle = {
  chainId: number;
  verifyingContract:  `0x${string}`;
  intentBatch?: IntentBatch;
};

export function generateIntentBatchEIP712({
  chainId,
  verifyingContract,
  intentBatch,
}: SignIntentBundle): SignTypedDataParameters {
  return {
    domain: {
      name: 'Intentify',
      version: '0',
      chainId,
      verifyingContract,
    },
    account: '0x0000000000' as `0x${string}`,
    message: intentBatch ?? {},
    primaryType: 'IntentBatch' as "IntentBatch",
    types: eip712Types,
  };
}
