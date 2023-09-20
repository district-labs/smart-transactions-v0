import { eip712Types } from './eip712-types';
import { IntentBatch } from './types';

type SignIntentBundle = {
  chainId: number;
  verifyingContract: string;
  intentBatch: IntentBatch;
};

export function generateIntentBatchEIP712({
  chainId,
  verifyingContract,
  intentBatch,
}: SignIntentBundle) {
  return {
    domain: {
      name: 'Intentify',
      version: '0',
      chainId,
      verifyingContract,
    },
    message: intentBatch,
    primaryType: 'IntentBatch',
    types: eip712Types,
  };
}
