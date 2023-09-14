export const eip712Types = {
  EIP712Domain: [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' },
  ],
  DimensionalNonce: [
    { name: 'queue', type: 'uint128' },
    { name: 'accumulator', type: 'uint128' },
  ],
  Signature: [
    { name: 'r', type: 'bytes32' },
    { name: 's', type: 'bytes32' },
    { name: 'v', type: 'uint8' },
  ],
  IntentExecution: [
    { name: 'root', type: 'address' },
    { name: 'target', type: 'address' },
    { name: 'data', type: 'bytes' },
  ],
  Intent: [
    { name: 'exec', type: 'IntentExecution' },
    { name: 'signature', type: 'Signature' },
  ],
  IntentBatch: [
    { name: 'nonce', type: 'DimensionalNonce' },
    { name: 'intents', type: 'Intent[]' },
  ],
  Hook: [
    { name: 'target', type: 'address' },
    { name: 'data', type: 'bytes' },
  ],
  IntentBatchExecution: [
    { name: 'batch', type: 'IntentBatch' },
    { name: 'signature', type: 'Signature' },
    { name: 'hooks', type: 'Hook[]' },
  ],
};
