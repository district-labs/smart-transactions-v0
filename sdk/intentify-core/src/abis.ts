//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Intentify
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const intentifyABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: '_owner', internalType: 'address', type: 'address' },
      { name: 'contractName', internalType: 'string', type: 'string' },
      { name: 'version', internalType: 'string', type: 'string' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      {
        name: '_input',
        internalType: 'struct DimensionalNonce',
        type: 'tuple',
        components: [
          { name: 'queue', internalType: 'uint128', type: 'uint128' },
          { name: 'accumulator', internalType: 'uint128', type: 'uint128' },
        ],
      },
    ],
    name: 'GET_DIMENSIONALNONCE_PACKETHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      {
        name: '_input',
        internalType: 'struct EIP712Domain',
        type: 'tuple',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'version', internalType: 'string', type: 'string' },
          { name: 'chainId', internalType: 'uint256', type: 'uint256' },
          {
            name: 'verifyingContract',
            internalType: 'address',
            type: 'address',
          },
        ],
      },
    ],
    name: 'GET_EIP712DOMAIN_PACKETHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      {
        name: '_input',
        internalType: 'struct Hook[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'GET_HOOK_ARRAY_PACKETHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      {
        name: '_input',
        internalType: 'struct Hook',
        type: 'tuple',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'GET_HOOK_PACKETHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      {
        name: '_input',
        internalType: 'struct IntentBatchExecution',
        type: 'tuple',
        components: [
          {
            name: 'batch',
            internalType: 'struct IntentBatch',
            type: 'tuple',
            components: [
              { name: 'root', internalType: 'address', type: 'address' },
              { name: 'nonce', internalType: 'bytes', type: 'bytes' },
              {
                name: 'intents',
                internalType: 'struct Intent[]',
                type: 'tuple[]',
                components: [
                  { name: 'root', internalType: 'address', type: 'address' },
                  { name: 'target', internalType: 'address', type: 'address' },
                  { name: 'value', internalType: 'uint256', type: 'uint256' },
                  { name: 'data', internalType: 'bytes', type: 'bytes' },
                ],
              },
            ],
          },
          {
            name: 'signature',
            internalType: 'struct Signature',
            type: 'tuple',
            components: [
              { name: 'r', internalType: 'bytes32', type: 'bytes32' },
              { name: 's', internalType: 'bytes32', type: 'bytes32' },
              { name: 'v', internalType: 'uint8', type: 'uint8' },
            ],
          },
          {
            name: 'hooks',
            internalType: 'struct Hook[]',
            type: 'tuple[]',
            components: [
              { name: 'target', internalType: 'address', type: 'address' },
              { name: 'data', internalType: 'bytes', type: 'bytes' },
            ],
          },
        ],
      },
    ],
    name: 'GET_INTENTBATCHEXECUTION_PACKETHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      {
        name: '_input',
        internalType: 'struct IntentBatch',
        type: 'tuple',
        components: [
          { name: 'root', internalType: 'address', type: 'address' },
          { name: 'nonce', internalType: 'bytes', type: 'bytes' },
          {
            name: 'intents',
            internalType: 'struct Intent[]',
            type: 'tuple[]',
            components: [
              { name: 'root', internalType: 'address', type: 'address' },
              { name: 'target', internalType: 'address', type: 'address' },
              { name: 'value', internalType: 'uint256', type: 'uint256' },
              { name: 'data', internalType: 'bytes', type: 'bytes' },
            ],
          },
        ],
      },
    ],
    name: 'GET_INTENTBATCH_PACKETHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      {
        name: '_input',
        internalType: 'struct Intent[]',
        type: 'tuple[]',
        components: [
          { name: 'root', internalType: 'address', type: 'address' },
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'GET_INTENT_ARRAY_PACKETHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      {
        name: '_input',
        internalType: 'struct Intent',
        type: 'tuple',
        components: [
          { name: 'root', internalType: 'address', type: 'address' },
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'GET_INTENT_PACKETHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      {
        name: '_input',
        internalType: 'struct Signature',
        type: 'tuple',
        components: [
          { name: 'r', internalType: 'bytes32', type: 'bytes32' },
          { name: 's', internalType: 'bytes32', type: 'bytes32' },
          { name: 'v', internalType: 'uint8', type: 'uint8' },
        ],
      },
    ],
    name: 'GET_SIGNATURE_PACKETHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'execution',
        internalType: 'struct IntentBatchExecution',
        type: 'tuple',
        components: [
          {
            name: 'batch',
            internalType: 'struct IntentBatch',
            type: 'tuple',
            components: [
              { name: 'root', internalType: 'address', type: 'address' },
              { name: 'nonce', internalType: 'bytes', type: 'bytes' },
              {
                name: 'intents',
                internalType: 'struct Intent[]',
                type: 'tuple[]',
                components: [
                  { name: 'root', internalType: 'address', type: 'address' },
                  { name: 'target', internalType: 'address', type: 'address' },
                  { name: 'value', internalType: 'uint256', type: 'uint256' },
                  { name: 'data', internalType: 'bytes', type: 'bytes' },
                ],
              },
            ],
          },
          {
            name: 'signature',
            internalType: 'struct Signature',
            type: 'tuple',
            components: [
              { name: 'r', internalType: 'bytes32', type: 'bytes32' },
              { name: 's', internalType: 'bytes32', type: 'bytes32' },
              { name: 'v', internalType: 'uint8', type: 'uint8' },
            ],
          },
          {
            name: 'hooks',
            internalType: 'struct Hook[]',
            type: 'tuple[]',
            components: [
              { name: 'target', internalType: 'address', type: 'address' },
              { name: 'data', internalType: 'bytes', type: 'bytes' },
            ],
          },
        ],
      },
    ],
    name: 'execute',
    outputs: [{ name: 'executed', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      {
        name: 'intent',
        internalType: 'struct IntentBatch',
        type: 'tuple',
        components: [
          { name: 'root', internalType: 'address', type: 'address' },
          { name: 'nonce', internalType: 'bytes', type: 'bytes' },
          {
            name: 'intents',
            internalType: 'struct Intent[]',
            type: 'tuple[]',
            components: [
              { name: 'root', internalType: 'address', type: 'address' },
              { name: 'target', internalType: 'address', type: 'address' },
              { name: 'value', internalType: 'uint256', type: 'uint256' },
              { name: 'data', internalType: 'bytes', type: 'bytes' },
            ],
          },
        ],
      },
    ],
    name: 'getIntentBatchTypedDataHash',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IntentifySafeModule
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const intentifySafeModuleABI = [
  { stateMutability: 'nonpayable', type: 'constructor', inputs: [] },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'root',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'intentBatchId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'IntentBatchCancelled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'executor',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'root',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'intentBatchId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'IntentBatchExecuted',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      {
        name: '_input',
        internalType: 'struct DimensionalNonce',
        type: 'tuple',
        components: [
          { name: 'queue', internalType: 'uint128', type: 'uint128' },
          { name: 'accumulator', internalType: 'uint128', type: 'uint128' },
        ],
      },
    ],
    name: 'GET_DIMENSIONALNONCE_PACKETHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      {
        name: '_input',
        internalType: 'struct EIP712Domain',
        type: 'tuple',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'version', internalType: 'string', type: 'string' },
          { name: 'chainId', internalType: 'uint256', type: 'uint256' },
          {
            name: 'verifyingContract',
            internalType: 'address',
            type: 'address',
          },
        ],
      },
    ],
    name: 'GET_EIP712DOMAIN_PACKETHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      {
        name: '_input',
        internalType: 'struct Hook[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'GET_HOOK_ARRAY_PACKETHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      {
        name: '_input',
        internalType: 'struct Hook',
        type: 'tuple',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'GET_HOOK_PACKETHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      {
        name: '_input',
        internalType: 'struct IntentBatchExecution',
        type: 'tuple',
        components: [
          {
            name: 'batch',
            internalType: 'struct IntentBatch',
            type: 'tuple',
            components: [
              { name: 'root', internalType: 'address', type: 'address' },
              { name: 'nonce', internalType: 'bytes', type: 'bytes' },
              {
                name: 'intents',
                internalType: 'struct Intent[]',
                type: 'tuple[]',
                components: [
                  { name: 'root', internalType: 'address', type: 'address' },
                  { name: 'target', internalType: 'address', type: 'address' },
                  { name: 'value', internalType: 'uint256', type: 'uint256' },
                  { name: 'data', internalType: 'bytes', type: 'bytes' },
                ],
              },
            ],
          },
          {
            name: 'signature',
            internalType: 'struct Signature',
            type: 'tuple',
            components: [
              { name: 'r', internalType: 'bytes32', type: 'bytes32' },
              { name: 's', internalType: 'bytes32', type: 'bytes32' },
              { name: 'v', internalType: 'uint8', type: 'uint8' },
            ],
          },
          {
            name: 'hooks',
            internalType: 'struct Hook[]',
            type: 'tuple[]',
            components: [
              { name: 'target', internalType: 'address', type: 'address' },
              { name: 'data', internalType: 'bytes', type: 'bytes' },
            ],
          },
        ],
      },
    ],
    name: 'GET_INTENTBATCHEXECUTION_PACKETHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      {
        name: '_input',
        internalType: 'struct IntentBatch',
        type: 'tuple',
        components: [
          { name: 'root', internalType: 'address', type: 'address' },
          { name: 'nonce', internalType: 'bytes', type: 'bytes' },
          {
            name: 'intents',
            internalType: 'struct Intent[]',
            type: 'tuple[]',
            components: [
              { name: 'root', internalType: 'address', type: 'address' },
              { name: 'target', internalType: 'address', type: 'address' },
              { name: 'value', internalType: 'uint256', type: 'uint256' },
              { name: 'data', internalType: 'bytes', type: 'bytes' },
            ],
          },
        ],
      },
    ],
    name: 'GET_INTENTBATCH_PACKETHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      {
        name: '_input',
        internalType: 'struct Intent[]',
        type: 'tuple[]',
        components: [
          { name: 'root', internalType: 'address', type: 'address' },
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'GET_INTENT_ARRAY_PACKETHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      {
        name: '_input',
        internalType: 'struct Intent',
        type: 'tuple',
        components: [
          { name: 'root', internalType: 'address', type: 'address' },
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'GET_INTENT_PACKETHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      {
        name: '_input',
        internalType: 'struct Signature',
        type: 'tuple',
        components: [
          { name: 'r', internalType: 'bytes32', type: 'bytes32' },
          { name: 's', internalType: 'bytes32', type: 'bytes32' },
          { name: 'v', internalType: 'uint8', type: 'uint8' },
        ],
      },
    ],
    name: 'GET_SIGNATURE_PACKETHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'NAME',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'VERSION',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [{ name: 'encodedNonce', internalType: 'bytes', type: 'bytes' }],
    name: '_decodeDimensionalNonce',
    outputs: [
      { name: 'nonceType', internalType: 'uint8', type: 'uint8' },
      { name: 'queue', internalType: 'uint120', type: 'uint120' },
      { name: 'accumulator', internalType: 'uint128', type: 'uint128' },
    ],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [{ name: 'encodedNonce', internalType: 'bytes', type: 'bytes' }],
    name: '_decodeStandardNonce',
    outputs: [
      { name: 'nonceType', internalType: 'uint8', type: 'uint8' },
      { name: 'accumulator', internalType: 'uint248', type: 'uint248' },
    ],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [{ name: 'encodedNonce', internalType: 'bytes', type: 'bytes' }],
    name: '_decodeTimeNonce',
    outputs: [
      { name: 'nonceType', internalType: 'uint8', type: 'uint8' },
      { name: 'id', internalType: 'uint32', type: 'uint32' },
      { name: 'delta', internalType: 'uint128', type: 'uint128' },
      { name: 'count', internalType: 'uint88', type: 'uint88' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'intentBatch',
        internalType: 'struct IntentBatch',
        type: 'tuple',
        components: [
          { name: 'root', internalType: 'address', type: 'address' },
          { name: 'nonce', internalType: 'bytes', type: 'bytes' },
          {
            name: 'intents',
            internalType: 'struct Intent[]',
            type: 'tuple[]',
            components: [
              { name: 'root', internalType: 'address', type: 'address' },
              { name: 'target', internalType: 'address', type: 'address' },
              { name: 'value', internalType: 'uint256', type: 'uint256' },
              { name: 'data', internalType: 'bytes', type: 'bytes' },
            ],
          },
        ],
      },
    ],
    name: 'cancelIntentBatch',
    outputs: [],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: 'queue', internalType: 'uint120', type: 'uint120' },
      { name: 'accumulator', internalType: 'uint128', type: 'uint128' },
    ],
    name: 'encodeDimensionalNonce',
    outputs: [{ name: 'encodedNonce', internalType: 'bytes', type: 'bytes' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [{ name: 'accumulator', internalType: 'uint248', type: 'uint248' }],
    name: 'encodeStandardNonce',
    outputs: [{ name: 'encodedNonce', internalType: 'bytes', type: 'bytes' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint32', type: 'uint32' },
      { name: 'delta', internalType: 'uint128', type: 'uint128' },
      { name: 'count', internalType: 'uint88', type: 'uint88' },
    ],
    name: 'encodeTimeNonce',
    outputs: [{ name: 'encodedNonce', internalType: 'bytes', type: 'bytes' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'execution',
        internalType: 'struct IntentBatchExecution',
        type: 'tuple',
        components: [
          {
            name: 'batch',
            internalType: 'struct IntentBatch',
            type: 'tuple',
            components: [
              { name: 'root', internalType: 'address', type: 'address' },
              { name: 'nonce', internalType: 'bytes', type: 'bytes' },
              {
                name: 'intents',
                internalType: 'struct Intent[]',
                type: 'tuple[]',
                components: [
                  { name: 'root', internalType: 'address', type: 'address' },
                  { name: 'target', internalType: 'address', type: 'address' },
                  { name: 'value', internalType: 'uint256', type: 'uint256' },
                  { name: 'data', internalType: 'bytes', type: 'bytes' },
                ],
              },
            ],
          },
          {
            name: 'signature',
            internalType: 'struct Signature',
            type: 'tuple',
            components: [
              { name: 'r', internalType: 'bytes32', type: 'bytes32' },
              { name: 's', internalType: 'bytes32', type: 'bytes32' },
              { name: 'v', internalType: 'uint8', type: 'uint8' },
            ],
          },
          {
            name: 'hooks',
            internalType: 'struct Hook[]',
            type: 'tuple[]',
            components: [
              { name: 'target', internalType: 'address', type: 'address' },
              { name: 'data', internalType: 'bytes', type: 'bytes' },
            ],
          },
        ],
      },
    ],
    name: 'execute',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'queue', internalType: 'uint120', type: 'uint120' },
    ],
    name: 'getDimensionalNonce',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      {
        name: 'intent',
        internalType: 'struct IntentBatch',
        type: 'tuple',
        components: [
          { name: 'root', internalType: 'address', type: 'address' },
          { name: 'nonce', internalType: 'bytes', type: 'bytes' },
          {
            name: 'intents',
            internalType: 'struct Intent[]',
            type: 'tuple[]',
            components: [
              { name: 'root', internalType: 'address', type: 'address' },
              { name: 'target', internalType: 'address', type: 'address' },
              { name: 'value', internalType: 'uint256', type: 'uint256' },
              { name: 'data', internalType: 'bytes', type: 'bytes' },
            ],
          },
        ],
      },
    ],
    name: 'getIntentBatchTypedDataHash',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getStandardNonce',
    outputs: [{ name: '', internalType: 'uint248', type: 'uint248' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'getTimeNonce',
    outputs: [
      {
        name: '',
        internalType: 'struct TimeTracker',
        type: 'tuple',
        components: [
          { name: 'delta', internalType: 'uint128', type: 'uint128' },
          { name: 'count', internalType: 'uint96', type: 'uint96' },
        ],
      },
    ],
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IntentifySafeModuleBundler
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const intentifySafeModuleBundlerABI = [
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'module',
        internalType: 'contract IntentifySafeModule',
        type: 'address',
      },
      {
        name: 'executionBundles',
        internalType: 'struct IntentBatchExecution[]',
        type: 'tuple[]',
        components: [
          {
            name: 'batch',
            internalType: 'struct IntentBatch',
            type: 'tuple',
            components: [
              { name: 'root', internalType: 'address', type: 'address' },
              { name: 'nonce', internalType: 'bytes', type: 'bytes' },
              {
                name: 'intents',
                internalType: 'struct Intent[]',
                type: 'tuple[]',
                components: [
                  { name: 'root', internalType: 'address', type: 'address' },
                  { name: 'target', internalType: 'address', type: 'address' },
                  { name: 'value', internalType: 'uint256', type: 'uint256' },
                  { name: 'data', internalType: 'bytes', type: 'bytes' },
                ],
              },
            ],
          },
          {
            name: 'signature',
            internalType: 'struct Signature',
            type: 'tuple',
            components: [
              { name: 'r', internalType: 'bytes32', type: 'bytes32' },
              { name: 's', internalType: 'bytes32', type: 'bytes32' },
              { name: 'v', internalType: 'uint8', type: 'uint8' },
            ],
          },
          {
            name: 'hooks',
            internalType: 'struct Hook[]',
            type: 'tuple[]',
            components: [
              { name: 'target', internalType: 'address', type: 'address' },
              { name: 'data', internalType: 'bytes', type: 'bytes' },
            ],
          },
        ],
      },
    ],
    name: 'executeBundle',
    outputs: [],
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LimitOrderIntent
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const limitOrderIntentABI = [
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: 'tokenOut', internalType: 'address', type: 'address' },
      { name: 'tokenIn', internalType: 'address', type: 'address' },
      { name: 'amountOutMax', internalType: 'uint256', type: 'uint256' },
      { name: 'amountInMin', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'encode',
    outputs: [{ name: 'data', internalType: 'bytes', type: 'bytes' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'intent',
        internalType: 'struct Intent',
        type: 'tuple',
        components: [
          { name: 'root', internalType: 'address', type: 'address' },
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
      {
        name: 'hook',
        internalType: 'struct Hook',
        type: 'tuple',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'execute',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'till',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TimestampBeforeIntent
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const timestampBeforeIntentABI = [
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [{ name: 'timestamp', internalType: 'uint128', type: 'uint128' }],
    name: 'encode',
    outputs: [{ name: 'data', internalType: 'bytes', type: 'bytes' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      {
        name: 'intent',
        internalType: 'struct Intent',
        type: 'tuple',
        components: [
          { name: 'root', internalType: 'address', type: 'address' },
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'execute',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TokenRouterReleaseIntent
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const tokenRouterReleaseIntentABI = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Release',
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'claim',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'encode',
    outputs: [{ name: 'data', internalType: 'bytes', type: 'bytes' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'intent',
        internalType: 'struct Intent',
        type: 'tuple',
        components: [
          { name: 'root', internalType: 'address', type: 'address' },
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'execute',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'till',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
] as const;
