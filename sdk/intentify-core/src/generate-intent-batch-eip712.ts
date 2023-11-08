import { SignTypedDataParameters, keccak256, toHex } from "viem";
import { eip712Types } from "./eip712-types";
import { IntentBatch } from "./types";
import { ADDRESS_ZERO } from "./constants";

type SignIntentBundle = {
  chainId: number;
  verifyingContract: `0x${string}`;
  intentBatch?: IntentBatch;
};

export function generateIntentBatchEIP712({
  chainId,
  verifyingContract,
  intentBatch,
}: SignIntentBundle): SignTypedDataParameters {
  return {
    domain: {
      name: "Intentify Safe Module",
      version: "0",
      chainId,
      verifyingContract,
    },
    account: ADDRESS_ZERO as `0x${string}`,
    message: intentBatch ?? {},
    primaryType: "IntentBatch" as "IntentBatch",
    types: eip712Types,
  };
}
