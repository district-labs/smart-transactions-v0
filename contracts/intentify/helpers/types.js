const typedMessage = {
  primaryType: "IntentBatch",
  domain: {
    name: "Intentify",
    version: "1",
  },

  types: {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
    ],
    DimensionalNonce: [
      { name: "queue", type: "uint128" },
      { name: "accumulator", type: "uint128" },
    ],
    Signature: [
      { name: "r", type: "bytes32" },
      { name: "s", type: "bytes32" },
      { name: "v", type: "uint8" },
    ],
    Intent: [
      { name: "root", type: "address" },
      { name: "target", type: "address" },
      { name: "value", type: "uint256" },
      { name: "data", type: "bytes" },
    ],
    IntentBatch: [
      { name: "root", type: "address" },
      { name: "nonce", type: "bytes" },
      { name: "intents", type: "Intent[]" },
    ],
    Hook: [
      { name: "target", type: "address" },
      { name: "data", type: "bytes" },
      { name: "instructions", type: "bytes"}
    ],
    IntentBatchExecution: [
      { name: "batch", type: "IntentBatch" },
      { name: "signature", type: "Signature" },
      { name: "hooks", type: "Hook[]" },
    ],
  },
};

module.exports = typedMessage;
