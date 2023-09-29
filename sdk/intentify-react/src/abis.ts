import {
  useContractRead,
  UseContractReadConfig,
  useContractWrite,
  UseContractWriteConfig,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
  useContractEvent,
  UseContractEventConfig,
} from 'wagmi'
import {
  ReadContractResult,
  WriteContractMode,
  PrepareWriteContractResult,
} from 'wagmi/actions'

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
] as const

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
        indexed: true,
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
      { name: 'root', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'intentBatchId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
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
] as const

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
] as const

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
] as const

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
] as const

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
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifyABI}__.
 */
export function useIntentifyRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof intentifyABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof intentifyABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifyABI,
    ...config,
  } as UseContractReadConfig<typeof intentifyABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifyABI}__ and `functionName` set to `"DOMAIN_SEPARATOR"`.
 */
export function useIntentifyDomainSeparator<
  TFunctionName extends 'DOMAIN_SEPARATOR',
  TSelectData = ReadContractResult<typeof intentifyABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof intentifyABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifyABI,
    functionName: 'DOMAIN_SEPARATOR',
    ...config,
  } as UseContractReadConfig<typeof intentifyABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifyABI}__ and `functionName` set to `"GET_DIMENSIONALNONCE_PACKETHASH"`.
 */
export function useIntentifyGetDimensionalnoncePackethash<
  TFunctionName extends 'GET_DIMENSIONALNONCE_PACKETHASH',
  TSelectData = ReadContractResult<typeof intentifyABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof intentifyABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifyABI,
    functionName: 'GET_DIMENSIONALNONCE_PACKETHASH',
    ...config,
  } as UseContractReadConfig<typeof intentifyABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifyABI}__ and `functionName` set to `"GET_EIP712DOMAIN_PACKETHASH"`.
 */
export function useIntentifyGetEip712DomainPackethash<
  TFunctionName extends 'GET_EIP712DOMAIN_PACKETHASH',
  TSelectData = ReadContractResult<typeof intentifyABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof intentifyABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifyABI,
    functionName: 'GET_EIP712DOMAIN_PACKETHASH',
    ...config,
  } as UseContractReadConfig<typeof intentifyABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifyABI}__ and `functionName` set to `"GET_HOOK_ARRAY_PACKETHASH"`.
 */
export function useIntentifyGetHookArrayPackethash<
  TFunctionName extends 'GET_HOOK_ARRAY_PACKETHASH',
  TSelectData = ReadContractResult<typeof intentifyABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof intentifyABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifyABI,
    functionName: 'GET_HOOK_ARRAY_PACKETHASH',
    ...config,
  } as UseContractReadConfig<typeof intentifyABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifyABI}__ and `functionName` set to `"GET_HOOK_PACKETHASH"`.
 */
export function useIntentifyGetHookPackethash<
  TFunctionName extends 'GET_HOOK_PACKETHASH',
  TSelectData = ReadContractResult<typeof intentifyABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof intentifyABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifyABI,
    functionName: 'GET_HOOK_PACKETHASH',
    ...config,
  } as UseContractReadConfig<typeof intentifyABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifyABI}__ and `functionName` set to `"GET_INTENTBATCHEXECUTION_PACKETHASH"`.
 */
export function useIntentifyGetIntentbatchexecutionPackethash<
  TFunctionName extends 'GET_INTENTBATCHEXECUTION_PACKETHASH',
  TSelectData = ReadContractResult<typeof intentifyABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof intentifyABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifyABI,
    functionName: 'GET_INTENTBATCHEXECUTION_PACKETHASH',
    ...config,
  } as UseContractReadConfig<typeof intentifyABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifyABI}__ and `functionName` set to `"GET_INTENTBATCH_PACKETHASH"`.
 */
export function useIntentifyGetIntentbatchPackethash<
  TFunctionName extends 'GET_INTENTBATCH_PACKETHASH',
  TSelectData = ReadContractResult<typeof intentifyABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof intentifyABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifyABI,
    functionName: 'GET_INTENTBATCH_PACKETHASH',
    ...config,
  } as UseContractReadConfig<typeof intentifyABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifyABI}__ and `functionName` set to `"GET_INTENT_ARRAY_PACKETHASH"`.
 */
export function useIntentifyGetIntentArrayPackethash<
  TFunctionName extends 'GET_INTENT_ARRAY_PACKETHASH',
  TSelectData = ReadContractResult<typeof intentifyABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof intentifyABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifyABI,
    functionName: 'GET_INTENT_ARRAY_PACKETHASH',
    ...config,
  } as UseContractReadConfig<typeof intentifyABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifyABI}__ and `functionName` set to `"GET_INTENT_PACKETHASH"`.
 */
export function useIntentifyGetIntentPackethash<
  TFunctionName extends 'GET_INTENT_PACKETHASH',
  TSelectData = ReadContractResult<typeof intentifyABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof intentifyABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifyABI,
    functionName: 'GET_INTENT_PACKETHASH',
    ...config,
  } as UseContractReadConfig<typeof intentifyABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifyABI}__ and `functionName` set to `"GET_SIGNATURE_PACKETHASH"`.
 */
export function useIntentifyGetSignaturePackethash<
  TFunctionName extends 'GET_SIGNATURE_PACKETHASH',
  TSelectData = ReadContractResult<typeof intentifyABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof intentifyABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifyABI,
    functionName: 'GET_SIGNATURE_PACKETHASH',
    ...config,
  } as UseContractReadConfig<typeof intentifyABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifyABI}__ and `functionName` set to `"getIntentBatchTypedDataHash"`.
 */
export function useIntentifyGetIntentBatchTypedDataHash<
  TFunctionName extends 'getIntentBatchTypedDataHash',
  TSelectData = ReadContractResult<typeof intentifyABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof intentifyABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifyABI,
    functionName: 'getIntentBatchTypedDataHash',
    ...config,
  } as UseContractReadConfig<typeof intentifyABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifyABI}__ and `functionName` set to `"owner"`.
 */
export function useIntentifyOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof intentifyABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof intentifyABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifyABI,
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<typeof intentifyABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link intentifyABI}__.
 */
export function useIntentifyWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof intentifyABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof intentifyABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof intentifyABI, TFunctionName, TMode>({
    abi: intentifyABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link intentifyABI}__ and `functionName` set to `"execute"`.
 */
export function useIntentifyExecute<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof intentifyABI,
          'execute'
        >['request']['abi'],
        'execute',
        TMode
      > & { functionName?: 'execute' }
    : UseContractWriteConfig<typeof intentifyABI, 'execute', TMode> & {
        abi?: never
        functionName?: 'execute'
      } = {} as any,
) {
  return useContractWrite<typeof intentifyABI, 'execute', TMode>({
    abi: intentifyABI,
    functionName: 'execute',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link intentifyABI}__.
 */
export function usePrepareIntentifyWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof intentifyABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: intentifyABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof intentifyABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link intentifyABI}__ and `functionName` set to `"execute"`.
 */
export function usePrepareIntentifyExecute(
  config: Omit<
    UsePrepareContractWriteConfig<typeof intentifyABI, 'execute'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: intentifyABI,
    functionName: 'execute',
    ...config,
  } as UsePrepareContractWriteConfig<typeof intentifyABI, 'execute'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifySafeModuleABI}__.
 */
export function useIntentifySafeModuleRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<
    typeof intentifySafeModuleABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof intentifySafeModuleABI,
      TFunctionName,
      TSelectData
    >,
    'abi'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifySafeModuleABI,
    ...config,
  } as UseContractReadConfig<
    typeof intentifySafeModuleABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifySafeModuleABI}__ and `functionName` set to `"DOMAIN_SEPARATOR"`.
 */
export function useIntentifySafeModuleDomainSeparator<
  TFunctionName extends 'DOMAIN_SEPARATOR',
  TSelectData = ReadContractResult<
    typeof intentifySafeModuleABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof intentifySafeModuleABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifySafeModuleABI,
    functionName: 'DOMAIN_SEPARATOR',
    ...config,
  } as UseContractReadConfig<
    typeof intentifySafeModuleABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifySafeModuleABI}__ and `functionName` set to `"GET_DIMENSIONALNONCE_PACKETHASH"`.
 */
export function useIntentifySafeModuleGetDimensionalnoncePackethash<
  TFunctionName extends 'GET_DIMENSIONALNONCE_PACKETHASH',
  TSelectData = ReadContractResult<
    typeof intentifySafeModuleABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof intentifySafeModuleABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifySafeModuleABI,
    functionName: 'GET_DIMENSIONALNONCE_PACKETHASH',
    ...config,
  } as UseContractReadConfig<
    typeof intentifySafeModuleABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifySafeModuleABI}__ and `functionName` set to `"GET_EIP712DOMAIN_PACKETHASH"`.
 */
export function useIntentifySafeModuleGetEip712DomainPackethash<
  TFunctionName extends 'GET_EIP712DOMAIN_PACKETHASH',
  TSelectData = ReadContractResult<
    typeof intentifySafeModuleABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof intentifySafeModuleABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifySafeModuleABI,
    functionName: 'GET_EIP712DOMAIN_PACKETHASH',
    ...config,
  } as UseContractReadConfig<
    typeof intentifySafeModuleABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifySafeModuleABI}__ and `functionName` set to `"GET_HOOK_ARRAY_PACKETHASH"`.
 */
export function useIntentifySafeModuleGetHookArrayPackethash<
  TFunctionName extends 'GET_HOOK_ARRAY_PACKETHASH',
  TSelectData = ReadContractResult<
    typeof intentifySafeModuleABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof intentifySafeModuleABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifySafeModuleABI,
    functionName: 'GET_HOOK_ARRAY_PACKETHASH',
    ...config,
  } as UseContractReadConfig<
    typeof intentifySafeModuleABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifySafeModuleABI}__ and `functionName` set to `"GET_HOOK_PACKETHASH"`.
 */
export function useIntentifySafeModuleGetHookPackethash<
  TFunctionName extends 'GET_HOOK_PACKETHASH',
  TSelectData = ReadContractResult<
    typeof intentifySafeModuleABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof intentifySafeModuleABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifySafeModuleABI,
    functionName: 'GET_HOOK_PACKETHASH',
    ...config,
  } as UseContractReadConfig<
    typeof intentifySafeModuleABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifySafeModuleABI}__ and `functionName` set to `"GET_INTENTBATCHEXECUTION_PACKETHASH"`.
 */
export function useIntentifySafeModuleGetIntentbatchexecutionPackethash<
  TFunctionName extends 'GET_INTENTBATCHEXECUTION_PACKETHASH',
  TSelectData = ReadContractResult<
    typeof intentifySafeModuleABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof intentifySafeModuleABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifySafeModuleABI,
    functionName: 'GET_INTENTBATCHEXECUTION_PACKETHASH',
    ...config,
  } as UseContractReadConfig<
    typeof intentifySafeModuleABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifySafeModuleABI}__ and `functionName` set to `"GET_INTENTBATCH_PACKETHASH"`.
 */
export function useIntentifySafeModuleGetIntentbatchPackethash<
  TFunctionName extends 'GET_INTENTBATCH_PACKETHASH',
  TSelectData = ReadContractResult<
    typeof intentifySafeModuleABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof intentifySafeModuleABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifySafeModuleABI,
    functionName: 'GET_INTENTBATCH_PACKETHASH',
    ...config,
  } as UseContractReadConfig<
    typeof intentifySafeModuleABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifySafeModuleABI}__ and `functionName` set to `"GET_INTENT_ARRAY_PACKETHASH"`.
 */
export function useIntentifySafeModuleGetIntentArrayPackethash<
  TFunctionName extends 'GET_INTENT_ARRAY_PACKETHASH',
  TSelectData = ReadContractResult<
    typeof intentifySafeModuleABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof intentifySafeModuleABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifySafeModuleABI,
    functionName: 'GET_INTENT_ARRAY_PACKETHASH',
    ...config,
  } as UseContractReadConfig<
    typeof intentifySafeModuleABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifySafeModuleABI}__ and `functionName` set to `"GET_INTENT_PACKETHASH"`.
 */
export function useIntentifySafeModuleGetIntentPackethash<
  TFunctionName extends 'GET_INTENT_PACKETHASH',
  TSelectData = ReadContractResult<
    typeof intentifySafeModuleABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof intentifySafeModuleABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifySafeModuleABI,
    functionName: 'GET_INTENT_PACKETHASH',
    ...config,
  } as UseContractReadConfig<
    typeof intentifySafeModuleABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifySafeModuleABI}__ and `functionName` set to `"GET_SIGNATURE_PACKETHASH"`.
 */
export function useIntentifySafeModuleGetSignaturePackethash<
  TFunctionName extends 'GET_SIGNATURE_PACKETHASH',
  TSelectData = ReadContractResult<
    typeof intentifySafeModuleABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof intentifySafeModuleABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifySafeModuleABI,
    functionName: 'GET_SIGNATURE_PACKETHASH',
    ...config,
  } as UseContractReadConfig<
    typeof intentifySafeModuleABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifySafeModuleABI}__ and `functionName` set to `"NAME"`.
 */
export function useIntentifySafeModuleName<
  TFunctionName extends 'NAME',
  TSelectData = ReadContractResult<
    typeof intentifySafeModuleABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof intentifySafeModuleABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifySafeModuleABI,
    functionName: 'NAME',
    ...config,
  } as UseContractReadConfig<
    typeof intentifySafeModuleABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifySafeModuleABI}__ and `functionName` set to `"VERSION"`.
 */
export function useIntentifySafeModuleVersion<
  TFunctionName extends 'VERSION',
  TSelectData = ReadContractResult<
    typeof intentifySafeModuleABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof intentifySafeModuleABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifySafeModuleABI,
    functionName: 'VERSION',
    ...config,
  } as UseContractReadConfig<
    typeof intentifySafeModuleABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifySafeModuleABI}__ and `functionName` set to `"_decodeDimensionalNonce"`.
 */
export function useIntentifySafeModuleDecodeDimensionalNonce<
  TFunctionName extends '_decodeDimensionalNonce',
  TSelectData = ReadContractResult<
    typeof intentifySafeModuleABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof intentifySafeModuleABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifySafeModuleABI,
    functionName: '_decodeDimensionalNonce',
    ...config,
  } as UseContractReadConfig<
    typeof intentifySafeModuleABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifySafeModuleABI}__ and `functionName` set to `"_decodeStandardNonce"`.
 */
export function useIntentifySafeModuleDecodeStandardNonce<
  TFunctionName extends '_decodeStandardNonce',
  TSelectData = ReadContractResult<
    typeof intentifySafeModuleABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof intentifySafeModuleABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifySafeModuleABI,
    functionName: '_decodeStandardNonce',
    ...config,
  } as UseContractReadConfig<
    typeof intentifySafeModuleABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifySafeModuleABI}__ and `functionName` set to `"_decodeTimeNonce"`.
 */
export function useIntentifySafeModuleDecodeTimeNonce<
  TFunctionName extends '_decodeTimeNonce',
  TSelectData = ReadContractResult<
    typeof intentifySafeModuleABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof intentifySafeModuleABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifySafeModuleABI,
    functionName: '_decodeTimeNonce',
    ...config,
  } as UseContractReadConfig<
    typeof intentifySafeModuleABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifySafeModuleABI}__ and `functionName` set to `"encodeDimensionalNonce"`.
 */
export function useIntentifySafeModuleEncodeDimensionalNonce<
  TFunctionName extends 'encodeDimensionalNonce',
  TSelectData = ReadContractResult<
    typeof intentifySafeModuleABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof intentifySafeModuleABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifySafeModuleABI,
    functionName: 'encodeDimensionalNonce',
    ...config,
  } as UseContractReadConfig<
    typeof intentifySafeModuleABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifySafeModuleABI}__ and `functionName` set to `"encodeStandardNonce"`.
 */
export function useIntentifySafeModuleEncodeStandardNonce<
  TFunctionName extends 'encodeStandardNonce',
  TSelectData = ReadContractResult<
    typeof intentifySafeModuleABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof intentifySafeModuleABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifySafeModuleABI,
    functionName: 'encodeStandardNonce',
    ...config,
  } as UseContractReadConfig<
    typeof intentifySafeModuleABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifySafeModuleABI}__ and `functionName` set to `"encodeTimeNonce"`.
 */
export function useIntentifySafeModuleEncodeTimeNonce<
  TFunctionName extends 'encodeTimeNonce',
  TSelectData = ReadContractResult<
    typeof intentifySafeModuleABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof intentifySafeModuleABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifySafeModuleABI,
    functionName: 'encodeTimeNonce',
    ...config,
  } as UseContractReadConfig<
    typeof intentifySafeModuleABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifySafeModuleABI}__ and `functionName` set to `"getDimensionalNonce"`.
 */
export function useIntentifySafeModuleGetDimensionalNonce<
  TFunctionName extends 'getDimensionalNonce',
  TSelectData = ReadContractResult<
    typeof intentifySafeModuleABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof intentifySafeModuleABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifySafeModuleABI,
    functionName: 'getDimensionalNonce',
    ...config,
  } as UseContractReadConfig<
    typeof intentifySafeModuleABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifySafeModuleABI}__ and `functionName` set to `"getIntentBatchTypedDataHash"`.
 */
export function useIntentifySafeModuleGetIntentBatchTypedDataHash<
  TFunctionName extends 'getIntentBatchTypedDataHash',
  TSelectData = ReadContractResult<
    typeof intentifySafeModuleABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof intentifySafeModuleABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifySafeModuleABI,
    functionName: 'getIntentBatchTypedDataHash',
    ...config,
  } as UseContractReadConfig<
    typeof intentifySafeModuleABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifySafeModuleABI}__ and `functionName` set to `"getStandardNonce"`.
 */
export function useIntentifySafeModuleGetStandardNonce<
  TFunctionName extends 'getStandardNonce',
  TSelectData = ReadContractResult<
    typeof intentifySafeModuleABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof intentifySafeModuleABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifySafeModuleABI,
    functionName: 'getStandardNonce',
    ...config,
  } as UseContractReadConfig<
    typeof intentifySafeModuleABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link intentifySafeModuleABI}__ and `functionName` set to `"getTimeNonce"`.
 */
export function useIntentifySafeModuleGetTimeNonce<
  TFunctionName extends 'getTimeNonce',
  TSelectData = ReadContractResult<
    typeof intentifySafeModuleABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof intentifySafeModuleABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: intentifySafeModuleABI,
    functionName: 'getTimeNonce',
    ...config,
  } as UseContractReadConfig<
    typeof intentifySafeModuleABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link intentifySafeModuleABI}__.
 */
export function useIntentifySafeModuleWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof intentifySafeModuleABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<
        typeof intentifySafeModuleABI,
        TFunctionName,
        TMode
      > & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof intentifySafeModuleABI, TFunctionName, TMode>({
    abi: intentifySafeModuleABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link intentifySafeModuleABI}__ and `functionName` set to `"cancelIntentBatch"`.
 */
export function useIntentifySafeModuleCancelIntentBatch<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof intentifySafeModuleABI,
          'cancelIntentBatch'
        >['request']['abi'],
        'cancelIntentBatch',
        TMode
      > & { functionName?: 'cancelIntentBatch' }
    : UseContractWriteConfig<
        typeof intentifySafeModuleABI,
        'cancelIntentBatch',
        TMode
      > & {
        abi?: never
        functionName?: 'cancelIntentBatch'
      } = {} as any,
) {
  return useContractWrite<
    typeof intentifySafeModuleABI,
    'cancelIntentBatch',
    TMode
  >({
    abi: intentifySafeModuleABI,
    functionName: 'cancelIntentBatch',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link intentifySafeModuleABI}__ and `functionName` set to `"execute"`.
 */
export function useIntentifySafeModuleExecute<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof intentifySafeModuleABI,
          'execute'
        >['request']['abi'],
        'execute',
        TMode
      > & { functionName?: 'execute' }
    : UseContractWriteConfig<
        typeof intentifySafeModuleABI,
        'execute',
        TMode
      > & {
        abi?: never
        functionName?: 'execute'
      } = {} as any,
) {
  return useContractWrite<typeof intentifySafeModuleABI, 'execute', TMode>({
    abi: intentifySafeModuleABI,
    functionName: 'execute',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link intentifySafeModuleABI}__.
 */
export function usePrepareIntentifySafeModuleWrite<
  TFunctionName extends string,
>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof intentifySafeModuleABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: intentifySafeModuleABI,
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof intentifySafeModuleABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link intentifySafeModuleABI}__ and `functionName` set to `"cancelIntentBatch"`.
 */
export function usePrepareIntentifySafeModuleCancelIntentBatch(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof intentifySafeModuleABI,
      'cancelIntentBatch'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: intentifySafeModuleABI,
    functionName: 'cancelIntentBatch',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof intentifySafeModuleABI,
    'cancelIntentBatch'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link intentifySafeModuleABI}__ and `functionName` set to `"execute"`.
 */
export function usePrepareIntentifySafeModuleExecute(
  config: Omit<
    UsePrepareContractWriteConfig<typeof intentifySafeModuleABI, 'execute'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: intentifySafeModuleABI,
    functionName: 'execute',
    ...config,
  } as UsePrepareContractWriteConfig<typeof intentifySafeModuleABI, 'execute'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link intentifySafeModuleABI}__.
 */
export function useIntentifySafeModuleEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof intentifySafeModuleABI, TEventName>,
    'abi'
  > = {} as any,
) {
  return useContractEvent({
    abi: intentifySafeModuleABI,
    ...config,
  } as UseContractEventConfig<typeof intentifySafeModuleABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link intentifySafeModuleABI}__ and `eventName` set to `"IntentBatchCancelled"`.
 */
export function useIntentifySafeModuleIntentBatchCancelledEvent(
  config: Omit<
    UseContractEventConfig<
      typeof intentifySafeModuleABI,
      'IntentBatchCancelled'
    >,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: intentifySafeModuleABI,
    eventName: 'IntentBatchCancelled',
    ...config,
  } as UseContractEventConfig<
    typeof intentifySafeModuleABI,
    'IntentBatchCancelled'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link intentifySafeModuleABI}__ and `eventName` set to `"IntentBatchExecuted"`.
 */
export function useIntentifySafeModuleIntentBatchExecutedEvent(
  config: Omit<
    UseContractEventConfig<
      typeof intentifySafeModuleABI,
      'IntentBatchExecuted'
    >,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: intentifySafeModuleABI,
    eventName: 'IntentBatchExecuted',
    ...config,
  } as UseContractEventConfig<
    typeof intentifySafeModuleABI,
    'IntentBatchExecuted'
  >)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link intentifySafeModuleBundlerABI}__.
 */
export function useIntentifySafeModuleBundlerWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof intentifySafeModuleBundlerABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<
        typeof intentifySafeModuleBundlerABI,
        TFunctionName,
        TMode
      > & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<
    typeof intentifySafeModuleBundlerABI,
    TFunctionName,
    TMode
  >({ abi: intentifySafeModuleBundlerABI, ...config } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link intentifySafeModuleBundlerABI}__ and `functionName` set to `"executeBundle"`.
 */
export function useIntentifySafeModuleBundlerExecuteBundle<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof intentifySafeModuleBundlerABI,
          'executeBundle'
        >['request']['abi'],
        'executeBundle',
        TMode
      > & { functionName?: 'executeBundle' }
    : UseContractWriteConfig<
        typeof intentifySafeModuleBundlerABI,
        'executeBundle',
        TMode
      > & {
        abi?: never
        functionName?: 'executeBundle'
      } = {} as any,
) {
  return useContractWrite<
    typeof intentifySafeModuleBundlerABI,
    'executeBundle',
    TMode
  >({
    abi: intentifySafeModuleBundlerABI,
    functionName: 'executeBundle',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link intentifySafeModuleBundlerABI}__.
 */
export function usePrepareIntentifySafeModuleBundlerWrite<
  TFunctionName extends string,
>(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof intentifySafeModuleBundlerABI,
      TFunctionName
    >,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: intentifySafeModuleBundlerABI,
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof intentifySafeModuleBundlerABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link intentifySafeModuleBundlerABI}__ and `functionName` set to `"executeBundle"`.
 */
export function usePrepareIntentifySafeModuleBundlerExecuteBundle(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof intentifySafeModuleBundlerABI,
      'executeBundle'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: intentifySafeModuleBundlerABI,
    functionName: 'executeBundle',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof intentifySafeModuleBundlerABI,
    'executeBundle'
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link limitOrderIntentABI}__.
 */
export function useLimitOrderIntentRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof limitOrderIntentABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof limitOrderIntentABI,
      TFunctionName,
      TSelectData
    >,
    'abi'
  > = {} as any,
) {
  return useContractRead({
    abi: limitOrderIntentABI,
    ...config,
  } as UseContractReadConfig<
    typeof limitOrderIntentABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link limitOrderIntentABI}__ and `functionName` set to `"encode"`.
 */
export function useLimitOrderIntentEncode<
  TFunctionName extends 'encode',
  TSelectData = ReadContractResult<typeof limitOrderIntentABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof limitOrderIntentABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: limitOrderIntentABI,
    functionName: 'encode',
    ...config,
  } as UseContractReadConfig<
    typeof limitOrderIntentABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link limitOrderIntentABI}__ and `functionName` set to `"till"`.
 */
export function useLimitOrderIntentTill<
  TFunctionName extends 'till',
  TSelectData = ReadContractResult<typeof limitOrderIntentABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof limitOrderIntentABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: limitOrderIntentABI,
    functionName: 'till',
    ...config,
  } as UseContractReadConfig<
    typeof limitOrderIntentABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link limitOrderIntentABI}__.
 */
export function useLimitOrderIntentWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof limitOrderIntentABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<
        typeof limitOrderIntentABI,
        TFunctionName,
        TMode
      > & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof limitOrderIntentABI, TFunctionName, TMode>({
    abi: limitOrderIntentABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link limitOrderIntentABI}__ and `functionName` set to `"execute"`.
 */
export function useLimitOrderIntentExecute<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof limitOrderIntentABI,
          'execute'
        >['request']['abi'],
        'execute',
        TMode
      > & { functionName?: 'execute' }
    : UseContractWriteConfig<typeof limitOrderIntentABI, 'execute', TMode> & {
        abi?: never
        functionName?: 'execute'
      } = {} as any,
) {
  return useContractWrite<typeof limitOrderIntentABI, 'execute', TMode>({
    abi: limitOrderIntentABI,
    functionName: 'execute',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link limitOrderIntentABI}__.
 */
export function usePrepareLimitOrderIntentWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof limitOrderIntentABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: limitOrderIntentABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof limitOrderIntentABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link limitOrderIntentABI}__ and `functionName` set to `"execute"`.
 */
export function usePrepareLimitOrderIntentExecute(
  config: Omit<
    UsePrepareContractWriteConfig<typeof limitOrderIntentABI, 'execute'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: limitOrderIntentABI,
    functionName: 'execute',
    ...config,
  } as UsePrepareContractWriteConfig<typeof limitOrderIntentABI, 'execute'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link timestampBeforeIntentABI}__.
 */
export function useTimestampBeforeIntentRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<
    typeof timestampBeforeIntentABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof timestampBeforeIntentABI,
      TFunctionName,
      TSelectData
    >,
    'abi'
  > = {} as any,
) {
  return useContractRead({
    abi: timestampBeforeIntentABI,
    ...config,
  } as UseContractReadConfig<
    typeof timestampBeforeIntentABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link timestampBeforeIntentABI}__ and `functionName` set to `"encode"`.
 */
export function useTimestampBeforeIntentEncode<
  TFunctionName extends 'encode',
  TSelectData = ReadContractResult<
    typeof timestampBeforeIntentABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof timestampBeforeIntentABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: timestampBeforeIntentABI,
    functionName: 'encode',
    ...config,
  } as UseContractReadConfig<
    typeof timestampBeforeIntentABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link timestampBeforeIntentABI}__ and `functionName` set to `"execute"`.
 */
export function useTimestampBeforeIntentExecute<
  TFunctionName extends 'execute',
  TSelectData = ReadContractResult<
    typeof timestampBeforeIntentABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof timestampBeforeIntentABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: timestampBeforeIntentABI,
    functionName: 'execute',
    ...config,
  } as UseContractReadConfig<
    typeof timestampBeforeIntentABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenRouterReleaseIntentABI}__.
 */
export function useTokenRouterReleaseIntentRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<
    typeof tokenRouterReleaseIntentABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenRouterReleaseIntentABI,
      TFunctionName,
      TSelectData
    >,
    'abi'
  > = {} as any,
) {
  return useContractRead({
    abi: tokenRouterReleaseIntentABI,
    ...config,
  } as UseContractReadConfig<
    typeof tokenRouterReleaseIntentABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenRouterReleaseIntentABI}__ and `functionName` set to `"encode"`.
 */
export function useTokenRouterReleaseIntentEncode<
  TFunctionName extends 'encode',
  TSelectData = ReadContractResult<
    typeof tokenRouterReleaseIntentABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenRouterReleaseIntentABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tokenRouterReleaseIntentABI,
    functionName: 'encode',
    ...config,
  } as UseContractReadConfig<
    typeof tokenRouterReleaseIntentABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenRouterReleaseIntentABI}__ and `functionName` set to `"till"`.
 */
export function useTokenRouterReleaseIntentTill<
  TFunctionName extends 'till',
  TSelectData = ReadContractResult<
    typeof tokenRouterReleaseIntentABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenRouterReleaseIntentABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tokenRouterReleaseIntentABI,
    functionName: 'till',
    ...config,
  } as UseContractReadConfig<
    typeof tokenRouterReleaseIntentABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenRouterReleaseIntentABI}__.
 */
export function useTokenRouterReleaseIntentWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenRouterReleaseIntentABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<
        typeof tokenRouterReleaseIntentABI,
        TFunctionName,
        TMode
      > & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<
    typeof tokenRouterReleaseIntentABI,
    TFunctionName,
    TMode
  >({ abi: tokenRouterReleaseIntentABI, ...config } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenRouterReleaseIntentABI}__ and `functionName` set to `"claim"`.
 */
export function useTokenRouterReleaseIntentClaim<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenRouterReleaseIntentABI,
          'claim'
        >['request']['abi'],
        'claim',
        TMode
      > & { functionName?: 'claim' }
    : UseContractWriteConfig<
        typeof tokenRouterReleaseIntentABI,
        'claim',
        TMode
      > & {
        abi?: never
        functionName?: 'claim'
      } = {} as any,
) {
  return useContractWrite<typeof tokenRouterReleaseIntentABI, 'claim', TMode>({
    abi: tokenRouterReleaseIntentABI,
    functionName: 'claim',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenRouterReleaseIntentABI}__ and `functionName` set to `"execute"`.
 */
export function useTokenRouterReleaseIntentExecute<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenRouterReleaseIntentABI,
          'execute'
        >['request']['abi'],
        'execute',
        TMode
      > & { functionName?: 'execute' }
    : UseContractWriteConfig<
        typeof tokenRouterReleaseIntentABI,
        'execute',
        TMode
      > & {
        abi?: never
        functionName?: 'execute'
      } = {} as any,
) {
  return useContractWrite<typeof tokenRouterReleaseIntentABI, 'execute', TMode>(
    {
      abi: tokenRouterReleaseIntentABI,
      functionName: 'execute',
      ...config,
    } as any,
  )
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenRouterReleaseIntentABI}__.
 */
export function usePrepareTokenRouterReleaseIntentWrite<
  TFunctionName extends string,
>(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenRouterReleaseIntentABI,
      TFunctionName
    >,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: tokenRouterReleaseIntentABI,
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof tokenRouterReleaseIntentABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenRouterReleaseIntentABI}__ and `functionName` set to `"claim"`.
 */
export function usePrepareTokenRouterReleaseIntentClaim(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenRouterReleaseIntentABI, 'claim'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: tokenRouterReleaseIntentABI,
    functionName: 'claim',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof tokenRouterReleaseIntentABI,
    'claim'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenRouterReleaseIntentABI}__ and `functionName` set to `"execute"`.
 */
export function usePrepareTokenRouterReleaseIntentExecute(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenRouterReleaseIntentABI,
      'execute'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: tokenRouterReleaseIntentABI,
    functionName: 'execute',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof tokenRouterReleaseIntentABI,
    'execute'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenRouterReleaseIntentABI}__.
 */
export function useTokenRouterReleaseIntentEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof tokenRouterReleaseIntentABI, TEventName>,
    'abi'
  > = {} as any,
) {
  return useContractEvent({
    abi: tokenRouterReleaseIntentABI,
    ...config,
  } as UseContractEventConfig<typeof tokenRouterReleaseIntentABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenRouterReleaseIntentABI}__ and `eventName` set to `"Release"`.
 */
export function useTokenRouterReleaseIntentReleaseEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenRouterReleaseIntentABI, 'Release'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: tokenRouterReleaseIntentABI,
    eventName: 'Release',
    ...config,
  } as UseContractEventConfig<typeof tokenRouterReleaseIntentABI, 'Release'>)
}
