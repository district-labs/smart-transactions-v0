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
  r: `0x${string}`; // bytes32 can be represented as a hex string
  s: `0x${string}`; // bytes32 can be represented as a hex string
  v: number; // uint8 can be represented as a number in TypeScript
};

export type Intent = {
  readonly root: `0x${string}`; // Ethereum addresses are usually represented as strings in TypeScript
  readonly target: `0x${string}`; // Ethereum addresses are usually represented as strings in TypeScript
  readonly value: bigint; // Ethereum addresses are usually represented as strings in TypeScript
  readonly data: `0x${string}`; // bytes can be represented as a hex string
};

export type IntentBatch = {
  readonly root: `0x${string}`;
  readonly nonce: `0x${string}`;
  readonly intents: Intent[];
};

export type Hook = {
  target: `0x${string}`; // Ethereum addresses are usually represented as strings in TypeScript
  data: `0x${string}`; // bytes can be represented as a hex string
};

export type IntentBatchExecution = {
  batch: IntentBatch;
  signature: Signature;
  hooks: Hook[];
};
