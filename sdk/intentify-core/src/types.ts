export type EIP712Domain = {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string; // Ethereum addresses are usually represented as strings in TypeScript
};

export type DimensionalNonce = {
  queue: number; // uint128 can be represented as a number in TypeScript
  accumulator: number; // uint128 can be represented as a number in TypeScript
};

export type Signature = {
  r: string; // bytes32 can be represented as a hex string
  s: string; // bytes32 can be represented as a hex string
  v: number; // uint8 can be represented as a number in TypeScript
};

export type IntentExecution = {
  root: string; // Ethereum addresses are usually represented as strings in TypeScript
  target: string; // Ethereum addresses are usually represented as strings in TypeScript
  data: string; // bytes can be represented as a hex string
};

export type Intent = {
  exec: IntentExecution;
  signature: Signature;
};

export type IntentBatch = {
  nonce: DimensionalNonce;
  intents: Intent[];
};

export type Hook = {
  target: string; // Ethereum addresses are usually represented as strings in TypeScript
  data: string; // bytes can be represented as a hex string
};

export type IntentBatchExecution = {
  batch: IntentBatch;
  signature: Signature;
  hooks: Hook[];
};
