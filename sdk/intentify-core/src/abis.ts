// Generated by @wagmi/cli@1.1.0 on 9/12/2023 at 10:40:19 AM

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
              {
                name: 'nonce',
                internalType: 'struct DimensionalNonce',
                type: 'tuple',
                components: [
                  { name: 'queue', internalType: 'uint128', type: 'uint128' },
                  {
                    name: 'accumulator',
                    internalType: 'uint128',
                    type: 'uint128',
                  },
                ],
              },
              {
                name: 'intents',
                internalType: 'struct Intent[]',
                type: 'tuple[]',
                components: [
                  {
                    name: 'exec',
                    internalType: 'struct IntentExecution',
                    type: 'tuple',
                    components: [
                      {
                        name: 'root',
                        internalType: 'address',
                        type: 'address',
                      },
                      {
                        name: 'target',
                        internalType: 'address',
                        type: 'address',
                      },
                      { name: 'data', internalType: 'bytes', type: 'bytes' },
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
          {
            name: 'nonce',
            internalType: 'struct DimensionalNonce',
            type: 'tuple',
            components: [
              { name: 'queue', internalType: 'uint128', type: 'uint128' },
              { name: 'accumulator', internalType: 'uint128', type: 'uint128' },
            ],
          },
          {
            name: 'intents',
            internalType: 'struct Intent[]',
            type: 'tuple[]',
            components: [
              {
                name: 'exec',
                internalType: 'struct IntentExecution',
                type: 'tuple',
                components: [
                  { name: 'root', internalType: 'address', type: 'address' },
                  { name: 'target', internalType: 'address', type: 'address' },
                  { name: 'data', internalType: 'bytes', type: 'bytes' },
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
        internalType: 'struct IntentExecution',
        type: 'tuple',
        components: [
          { name: 'root', internalType: 'address', type: 'address' },
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'GET_INTENTEXECUTION_PACKETHASH',
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
          {
            name: 'exec',
            internalType: 'struct IntentExecution',
            type: 'tuple',
            components: [
              { name: 'root', internalType: 'address', type: 'address' },
              { name: 'target', internalType: 'address', type: 'address' },
              { name: 'data', internalType: 'bytes', type: 'bytes' },
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
          {
            name: 'exec',
            internalType: 'struct IntentExecution',
            type: 'tuple',
            components: [
              { name: 'root', internalType: 'address', type: 'address' },
              { name: 'target', internalType: 'address', type: 'address' },
              { name: 'data', internalType: 'bytes', type: 'bytes' },
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
    name: 'INTENT_TYPEHASH',
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
              {
                name: 'nonce',
                internalType: 'struct DimensionalNonce',
                type: 'tuple',
                components: [
                  { name: 'queue', internalType: 'uint128', type: 'uint128' },
                  {
                    name: 'accumulator',
                    internalType: 'uint128',
                    type: 'uint128',
                  },
                ],
              },
              {
                name: 'intents',
                internalType: 'struct Intent[]',
                type: 'tuple[]',
                components: [
                  {
                    name: 'exec',
                    internalType: 'struct IntentExecution',
                    type: 'tuple',
                    components: [
                      {
                        name: 'root',
                        internalType: 'address',
                        type: 'address',
                      },
                      {
                        name: 'target',
                        internalType: 'address',
                        type: 'address',
                      },
                      { name: 'data', internalType: 'bytes', type: 'bytes' },
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
          {
            name: 'nonce',
            internalType: 'struct DimensionalNonce',
            type: 'tuple',
            components: [
              { name: 'queue', internalType: 'uint128', type: 'uint128' },
              { name: 'accumulator', internalType: 'uint128', type: 'uint128' },
            ],
          },
          {
            name: 'intents',
            internalType: 'struct Intent[]',
            type: 'tuple[]',
            components: [
              {
                name: 'exec',
                internalType: 'struct IntentExecution',
                type: 'tuple',
                components: [
                  { name: 'root', internalType: 'address', type: 'address' },
                  { name: 'target', internalType: 'address', type: 'address' },
                  { name: 'data', internalType: 'bytes', type: 'bytes' },
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
    inputs: [
      {
        name: 'intentExecution',
        internalType: 'struct IntentExecution',
        type: 'tuple',
        components: [
          { name: 'root', internalType: 'address', type: 'address' },
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'getIntentExecutionTypedDataHash',
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
              {
                name: 'nonce',
                internalType: 'struct DimensionalNonce',
                type: 'tuple',
                components: [
                  { name: 'queue', internalType: 'uint128', type: 'uint128' },
                  {
                    name: 'accumulator',
                    internalType: 'uint128',
                    type: 'uint128',
                  },
                ],
              },
              {
                name: 'intents',
                internalType: 'struct Intent[]',
                type: 'tuple[]',
                components: [
                  {
                    name: 'exec',
                    internalType: 'struct IntentExecution',
                    type: 'tuple',
                    components: [
                      {
                        name: 'root',
                        internalType: 'address',
                        type: 'address',
                      },
                      {
                        name: 'target',
                        internalType: 'address',
                        type: 'address',
                      },
                      { name: 'data', internalType: 'bytes', type: 'bytes' },
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
          {
            name: 'nonce',
            internalType: 'struct DimensionalNonce',
            type: 'tuple',
            components: [
              { name: 'queue', internalType: 'uint128', type: 'uint128' },
              { name: 'accumulator', internalType: 'uint128', type: 'uint128' },
            ],
          },
          {
            name: 'intents',
            internalType: 'struct Intent[]',
            type: 'tuple[]',
            components: [
              {
                name: 'exec',
                internalType: 'struct IntentExecution',
                type: 'tuple',
                components: [
                  { name: 'root', internalType: 'address', type: 'address' },
                  { name: 'target', internalType: 'address', type: 'address' },
                  { name: 'data', internalType: 'bytes', type: 'bytes' },
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
        internalType: 'struct IntentExecution',
        type: 'tuple',
        components: [
          { name: 'root', internalType: 'address', type: 'address' },
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'GET_INTENTEXECUTION_PACKETHASH',
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
          {
            name: 'exec',
            internalType: 'struct IntentExecution',
            type: 'tuple',
            components: [
              { name: 'root', internalType: 'address', type: 'address' },
              { name: 'target', internalType: 'address', type: 'address' },
              { name: 'data', internalType: 'bytes', type: 'bytes' },
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
          {
            name: 'exec',
            internalType: 'struct IntentExecution',
            type: 'tuple',
            components: [
              { name: 'root', internalType: 'address', type: 'address' },
              { name: 'target', internalType: 'address', type: 'address' },
              { name: 'data', internalType: 'bytes', type: 'bytes' },
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
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'root', internalType: 'address', type: 'address' },
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
              {
                name: 'nonce',
                internalType: 'struct DimensionalNonce',
                type: 'tuple',
                components: [
                  { name: 'queue', internalType: 'uint128', type: 'uint128' },
                  {
                    name: 'accumulator',
                    internalType: 'uint128',
                    type: 'uint128',
                  },
                ],
              },
              {
                name: 'intents',
                internalType: 'struct Intent[]',
                type: 'tuple[]',
                components: [
                  {
                    name: 'exec',
                    internalType: 'struct IntentExecution',
                    type: 'tuple',
                    components: [
                      {
                        name: 'root',
                        internalType: 'address',
                        type: 'address',
                      },
                      {
                        name: 'target',
                        internalType: 'address',
                        type: 'address',
                      },
                      { name: 'data', internalType: 'bytes', type: 'bytes' },
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
          {
            name: 'nonce',
            internalType: 'struct DimensionalNonce',
            type: 'tuple',
            components: [
              { name: 'queue', internalType: 'uint128', type: 'uint128' },
              { name: 'accumulator', internalType: 'uint128', type: 'uint128' },
            ],
          },
          {
            name: 'intents',
            internalType: 'struct Intent[]',
            type: 'tuple[]',
            components: [
              {
                name: 'exec',
                internalType: 'struct IntentExecution',
                type: 'tuple',
                components: [
                  { name: 'root', internalType: 'address', type: 'address' },
                  { name: 'target', internalType: 'address', type: 'address' },
                  { name: 'data', internalType: 'bytes', type: 'bytes' },
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
    inputs: [
      {
        name: 'intentExecution',
        internalType: 'struct IntentExecution',
        type: 'tuple',
        components: [
          { name: 'root', internalType: 'address', type: 'address' },
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'getIntentExecutionTypedDataHash',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LimitOrderIntent
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const limitOrderIntentABI = [
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'intent',
        internalType: 'struct Intent',
        type: 'tuple',
        components: [
          {
            name: 'exec',
            internalType: 'struct IntentExecution',
            type: 'tuple',
            components: [
              { name: 'root', internalType: 'address', type: 'address' },
              { name: 'target', internalType: 'address', type: 'address' },
              { name: 'data', internalType: 'bytes', type: 'bytes' },
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
    stateMutability: 'view',
    type: 'function',
    inputs: [
      {
        name: 'intent',
        internalType: 'struct Intent',
        type: 'tuple',
        components: [
          {
            name: 'exec',
            internalType: 'struct IntentExecution',
            type: 'tuple',
            components: [
              { name: 'root', internalType: 'address', type: 'address' },
              { name: 'target', internalType: 'address', type: 'address' },
              { name: 'data', internalType: 'bytes', type: 'bytes' },
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
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'intent',
        internalType: 'struct Intent',
        type: 'tuple',
        components: [
          {
            name: 'exec',
            internalType: 'struct IntentExecution',
            type: 'tuple',
            components: [
              { name: 'root', internalType: 'address', type: 'address' },
              { name: 'target', internalType: 'address', type: 'address' },
              { name: 'data', internalType: 'bytes', type: 'bytes' },
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
