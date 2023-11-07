import { keccak256, toBytes } from 'viem';
import { eip712Types } from "./eip712-types";
import { IntentBatch } from "./types";

type SignIntentBundle = {
  chainId: number;
  verifyingContract: `0x${string}`;
  intentBatch?: IntentBatch;
};

export function generateIntentBatchEIP712({
  chainId,
  verifyingContract,
  intentBatch,
}: SignIntentBundle) {
  return {
    domain: {
      name: keccak256(toBytes("Intentify Safe Module")),
      version: keccak256(toBytes("0")),
      chainId,
      verifyingContract,
    },
    message: intentBatch as IntentBatch,
    primaryType: "IntentBatch",
    types: eip712Types,
  } as const;
}
