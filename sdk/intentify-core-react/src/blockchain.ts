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
// IntentifySafeModule
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const intentifySafeModuleABI = [
  { stateMutability: 'nonpayable', type: 'constructor', inputs: [] },
  { type: 'error', inputs: [], name: 'ExecutionFailed' },
  { type: 'error', inputs: [], name: 'IntentAlreadyCancelled' },
  { type: 'error', inputs: [], name: 'IntentExecutionFailed' },
  { type: 'error', inputs: [], name: 'InvalidHookLength' },
  { type: 'error', inputs: [], name: 'OnlyIntentBatchRootCanCancel' },
  { type: 'error', inputs: [], name: 'ReentrantCall' },
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
          { name: 'instructions', internalType: 'bytes', type: 'bytes' },
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
          { name: 'instructions', internalType: 'bytes', type: 'bytes' },
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
              { name: 'instructions', internalType: 'bytes', type: 'bytes' },
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
              { name: 'instructions', internalType: 'bytes', type: 'bytes' },
            ],
          },
        ],
      },
    ],
    name: 'execute',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'operation', internalType: 'enum Enum.Operation', type: 'uint8' },
    ],
    name: 'executeTransactionFromIntentModule',
    outputs: [{ name: 'success', internalType: 'bool', type: 'bool' }],
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
              { name: 'instructions', internalType: 'bytes', type: 'bytes' },
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
// Safe
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const safeABI = [
  { stateMutability: 'nonpayable', type: 'constructor', inputs: [] },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'AddedOwner',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'approvedHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ApproveHash',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'handler',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ChangedFallbackHandler',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'guard',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ChangedGuard',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'threshold',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ChangedThreshold',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'module',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'DisabledModule',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'module',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'EnabledModule',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'txHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'payment',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ExecutionFailure',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'module',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ExecutionFromModuleFailure',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'module',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ExecutionFromModuleSuccess',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'txHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'payment',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ExecutionSuccess',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RemovedOwner',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'SafeReceived',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'initiator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'owners',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
      {
        name: 'threshold',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'initializer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'fallbackHandler',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'SafeSetup',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'msgHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'SignMsg',
  },
  { stateMutability: 'nonpayable', type: 'fallback' },
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
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: '_threshold', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'addOwnerWithThreshold',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'hashToApprove', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'approveHash',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'approvedHashes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_threshold', internalType: 'uint256', type: 'uint256' }],
    name: 'changeThreshold',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'dataHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'signatures', internalType: 'bytes', type: 'bytes' },
      { name: 'requiredSignatures', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'checkNSignatures',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'dataHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'signatures', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'checkSignatures',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'prevModule', internalType: 'address', type: 'address' },
      { name: 'module', internalType: 'address', type: 'address' },
    ],
    name: 'disableModule',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'domainSeparator',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'module', internalType: 'address', type: 'address' }],
    name: 'enableModule',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'operation', internalType: 'enum Enum.Operation', type: 'uint8' },
      { name: 'safeTxGas', internalType: 'uint256', type: 'uint256' },
      { name: 'baseGas', internalType: 'uint256', type: 'uint256' },
      { name: 'gasPrice', internalType: 'uint256', type: 'uint256' },
      { name: 'gasToken', internalType: 'address', type: 'address' },
      { name: 'refundReceiver', internalType: 'address', type: 'address' },
      { name: '_nonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'encodeTransactionData',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'operation', internalType: 'enum Enum.Operation', type: 'uint8' },
      { name: 'safeTxGas', internalType: 'uint256', type: 'uint256' },
      { name: 'baseGas', internalType: 'uint256', type: 'uint256' },
      { name: 'gasPrice', internalType: 'uint256', type: 'uint256' },
      { name: 'gasToken', internalType: 'address', type: 'address' },
      {
        name: 'refundReceiver',
        internalType: 'address payable',
        type: 'address',
      },
      { name: 'signatures', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'execTransaction',
    outputs: [{ name: 'success', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'operation', internalType: 'enum Enum.Operation', type: 'uint8' },
    ],
    name: 'execTransactionFromModule',
    outputs: [{ name: 'success', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'operation', internalType: 'enum Enum.Operation', type: 'uint8' },
    ],
    name: 'execTransactionFromModuleReturnData',
    outputs: [
      { name: 'success', internalType: 'bool', type: 'bool' },
      { name: 'returnData', internalType: 'bytes', type: 'bytes' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getChainId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'start', internalType: 'address', type: 'address' },
      { name: 'pageSize', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getModulesPaginated',
    outputs: [
      { name: 'array', internalType: 'address[]', type: 'address[]' },
      { name: 'next', internalType: 'address', type: 'address' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getOwners',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'offset', internalType: 'uint256', type: 'uint256' },
      { name: 'length', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getStorageAt',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getThreshold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'operation', internalType: 'enum Enum.Operation', type: 'uint8' },
      { name: 'safeTxGas', internalType: 'uint256', type: 'uint256' },
      { name: 'baseGas', internalType: 'uint256', type: 'uint256' },
      { name: 'gasPrice', internalType: 'uint256', type: 'uint256' },
      { name: 'gasToken', internalType: 'address', type: 'address' },
      { name: 'refundReceiver', internalType: 'address', type: 'address' },
      { name: '_nonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getTransactionHash',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'module', internalType: 'address', type: 'address' }],
    name: 'isModuleEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'isOwner',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'nonce',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'prevOwner', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: '_threshold', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'removeOwner',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'handler', internalType: 'address', type: 'address' }],
    name: 'setFallbackHandler',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'guard', internalType: 'address', type: 'address' }],
    name: 'setGuard',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_owners', internalType: 'address[]', type: 'address[]' },
      { name: '_threshold', internalType: 'uint256', type: 'uint256' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'fallbackHandler', internalType: 'address', type: 'address' },
      { name: 'paymentToken', internalType: 'address', type: 'address' },
      { name: 'payment', internalType: 'uint256', type: 'uint256' },
      {
        name: 'paymentReceiver',
        internalType: 'address payable',
        type: 'address',
      },
    ],
    name: 'setup',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'signedMessages',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'targetContract', internalType: 'address', type: 'address' },
      { name: 'calldataPayload', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'simulateAndRevert',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'prevOwner', internalType: 'address', type: 'address' },
      { name: 'oldOwner', internalType: 'address', type: 'address' },
      { name: 'newOwner', internalType: 'address', type: 'address' },
    ],
    name: 'swapOwner',
    outputs: [],
  },
  { stateMutability: 'payable', type: 'receive' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TimestampIntent
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const timestampIntentABI = [
  { type: 'error', inputs: [], name: 'Early' },
  { type: 'error', inputs: [], name: 'Expired' },
  { type: 'error', inputs: [], name: 'InvalidRoot' },
  { type: 'error', inputs: [], name: 'InvalidTarget' },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: 'minTimestamp', internalType: 'uint128', type: 'uint128' },
      { name: 'maxTimestamp', internalType: 'uint128', type: 'uint128' },
    ],
    name: 'encodeIntent',
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
// WalletFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const walletFactoryABI = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proxy',
        internalType: 'contract SafeProxy',
        type: 'address',
        indexed: true,
      },
      {
        name: 'singleton',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ProxyCreation',
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_singleton', internalType: 'address', type: 'address' },
      { name: 'initializer', internalType: 'bytes', type: 'bytes' },
      { name: 'saltNonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createChainSpecificProxyWithNonce',
    outputs: [
      { name: 'proxy', internalType: 'contract SafeProxy', type: 'address' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_singleton', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'saltNonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createDeterministicWallet',
    outputs: [
      { name: 'proxy', internalType: 'contract SafeProxy', type: 'address' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_singleton', internalType: 'address', type: 'address' },
      { name: 'initializer', internalType: 'bytes', type: 'bytes' },
      { name: 'saltNonce', internalType: 'uint256', type: 'uint256' },
      {
        name: 'callback',
        internalType: 'contract IProxyCreationCallback',
        type: 'address',
      },
    ],
    name: 'createProxyWithCallback',
    outputs: [
      { name: 'proxy', internalType: 'contract SafeProxy', type: 'address' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_singleton', internalType: 'address', type: 'address' },
      { name: 'initializer', internalType: 'bytes', type: 'bytes' },
      { name: 'saltNonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createProxyWithNonce',
    outputs: [
      { name: 'proxy', internalType: 'contract SafeProxy', type: 'address' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getChainId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '_singleton', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'saltNonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getDeterministicWalletAddress',
    outputs: [{ name: 'proxy', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '_singleton', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'saltNonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'isWalletMaterialized',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [],
    name: 'proxyCreationCode',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// WalletFactoryTestnet
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const walletFactoryTestnetABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      {
        name: 'tokenAddressList',
        internalType: 'address[]',
        type: 'address[]',
      },
      { name: 'amountList', internalType: 'uint256[]', type: 'uint256[]' },
    ],
  },
  { type: 'error', inputs: [], name: 'InvalidTestTokens' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proxy',
        internalType: 'contract SafeProxy',
        type: 'address',
        indexed: true,
      },
      {
        name: 'singleton',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ProxyCreation',
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_singleton', internalType: 'address', type: 'address' },
      { name: 'initializer', internalType: 'bytes', type: 'bytes' },
      { name: 'saltNonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createChainSpecificProxyWithNonce',
    outputs: [
      { name: 'proxy', internalType: 'contract SafeProxy', type: 'address' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_singleton', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'saltNonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createDeterministicWallet',
    outputs: [
      { name: 'proxy', internalType: 'contract SafeProxy', type: 'address' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_singleton', internalType: 'address', type: 'address' },
      { name: 'initializer', internalType: 'bytes', type: 'bytes' },
      { name: 'saltNonce', internalType: 'uint256', type: 'uint256' },
      {
        name: 'callback',
        internalType: 'contract IProxyCreationCallback',
        type: 'address',
      },
    ],
    name: 'createProxyWithCallback',
    outputs: [
      { name: 'proxy', internalType: 'contract SafeProxy', type: 'address' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_singleton', internalType: 'address', type: 'address' },
      { name: 'initializer', internalType: 'bytes', type: 'bytes' },
      { name: 'saltNonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createProxyWithNonce',
    outputs: [
      { name: 'proxy', internalType: 'contract SafeProxy', type: 'address' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getChainId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '_singleton', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'saltNonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getDeterministicWalletAddress',
    outputs: [{ name: 'proxy', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '_singleton', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'saltNonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'isWalletMaterialized',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [],
    name: 'proxyCreationCode',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'testTokens',
    outputs: [
      { name: 'tokenAddress', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link intentifySafeModuleABI}__ and `functionName` set to `"executeTransactionFromIntentModule"`.
 */
export function useIntentifySafeModuleExecuteTransactionFromIntentModule<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof intentifySafeModuleABI,
          'executeTransactionFromIntentModule'
        >['request']['abi'],
        'executeTransactionFromIntentModule',
        TMode
      > & { functionName?: 'executeTransactionFromIntentModule' }
    : UseContractWriteConfig<
        typeof intentifySafeModuleABI,
        'executeTransactionFromIntentModule',
        TMode
      > & {
        abi?: never
        functionName?: 'executeTransactionFromIntentModule'
      } = {} as any,
) {
  return useContractWrite<
    typeof intentifySafeModuleABI,
    'executeTransactionFromIntentModule',
    TMode
  >({
    abi: intentifySafeModuleABI,
    functionName: 'executeTransactionFromIntentModule',
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
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link intentifySafeModuleABI}__ and `functionName` set to `"executeTransactionFromIntentModule"`.
 */
export function usePrepareIntentifySafeModuleExecuteTransactionFromIntentModule(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof intentifySafeModuleABI,
      'executeTransactionFromIntentModule'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: intentifySafeModuleABI,
    functionName: 'executeTransactionFromIntentModule',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof intentifySafeModuleABI,
    'executeTransactionFromIntentModule'
  >)
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
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link safeABI}__.
 */
export function useSafeRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof safeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({ abi: safeABI, ...config } as UseContractReadConfig<
    typeof safeABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"VERSION"`.
 */
export function useSafeVersion<
  TFunctionName extends 'VERSION',
  TSelectData = ReadContractResult<typeof safeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: safeABI,
    functionName: 'VERSION',
    ...config,
  } as UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"approvedHashes"`.
 */
export function useSafeApprovedHashes<
  TFunctionName extends 'approvedHashes',
  TSelectData = ReadContractResult<typeof safeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: safeABI,
    functionName: 'approvedHashes',
    ...config,
  } as UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"checkNSignatures"`.
 */
export function useSafeCheckNSignatures<
  TFunctionName extends 'checkNSignatures',
  TSelectData = ReadContractResult<typeof safeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: safeABI,
    functionName: 'checkNSignatures',
    ...config,
  } as UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"checkSignatures"`.
 */
export function useSafeCheckSignatures<
  TFunctionName extends 'checkSignatures',
  TSelectData = ReadContractResult<typeof safeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: safeABI,
    functionName: 'checkSignatures',
    ...config,
  } as UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"domainSeparator"`.
 */
export function useSafeDomainSeparator<
  TFunctionName extends 'domainSeparator',
  TSelectData = ReadContractResult<typeof safeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: safeABI,
    functionName: 'domainSeparator',
    ...config,
  } as UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"encodeTransactionData"`.
 */
export function useSafeEncodeTransactionData<
  TFunctionName extends 'encodeTransactionData',
  TSelectData = ReadContractResult<typeof safeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: safeABI,
    functionName: 'encodeTransactionData',
    ...config,
  } as UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"getChainId"`.
 */
export function useSafeGetChainId<
  TFunctionName extends 'getChainId',
  TSelectData = ReadContractResult<typeof safeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: safeABI,
    functionName: 'getChainId',
    ...config,
  } as UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"getModulesPaginated"`.
 */
export function useSafeGetModulesPaginated<
  TFunctionName extends 'getModulesPaginated',
  TSelectData = ReadContractResult<typeof safeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: safeABI,
    functionName: 'getModulesPaginated',
    ...config,
  } as UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"getOwners"`.
 */
export function useSafeGetOwners<
  TFunctionName extends 'getOwners',
  TSelectData = ReadContractResult<typeof safeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: safeABI,
    functionName: 'getOwners',
    ...config,
  } as UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"getStorageAt"`.
 */
export function useSafeGetStorageAt<
  TFunctionName extends 'getStorageAt',
  TSelectData = ReadContractResult<typeof safeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: safeABI,
    functionName: 'getStorageAt',
    ...config,
  } as UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"getThreshold"`.
 */
export function useSafeGetThreshold<
  TFunctionName extends 'getThreshold',
  TSelectData = ReadContractResult<typeof safeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: safeABI,
    functionName: 'getThreshold',
    ...config,
  } as UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"getTransactionHash"`.
 */
export function useSafeGetTransactionHash<
  TFunctionName extends 'getTransactionHash',
  TSelectData = ReadContractResult<typeof safeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: safeABI,
    functionName: 'getTransactionHash',
    ...config,
  } as UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"isModuleEnabled"`.
 */
export function useSafeIsModuleEnabled<
  TFunctionName extends 'isModuleEnabled',
  TSelectData = ReadContractResult<typeof safeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: safeABI,
    functionName: 'isModuleEnabled',
    ...config,
  } as UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"isOwner"`.
 */
export function useSafeIsOwner<
  TFunctionName extends 'isOwner',
  TSelectData = ReadContractResult<typeof safeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: safeABI,
    functionName: 'isOwner',
    ...config,
  } as UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"nonce"`.
 */
export function useSafeNonce<
  TFunctionName extends 'nonce',
  TSelectData = ReadContractResult<typeof safeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: safeABI,
    functionName: 'nonce',
    ...config,
  } as UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"signedMessages"`.
 */
export function useSafeSignedMessages<
  TFunctionName extends 'signedMessages',
  TSelectData = ReadContractResult<typeof safeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: safeABI,
    functionName: 'signedMessages',
    ...config,
  } as UseContractReadConfig<typeof safeABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link safeABI}__.
 */
export function useSafeWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof safeABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof safeABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof safeABI, TFunctionName, TMode>({
    abi: safeABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"addOwnerWithThreshold"`.
 */
export function useSafeAddOwnerWithThreshold<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof safeABI,
          'addOwnerWithThreshold'
        >['request']['abi'],
        'addOwnerWithThreshold',
        TMode
      > & { functionName?: 'addOwnerWithThreshold' }
    : UseContractWriteConfig<typeof safeABI, 'addOwnerWithThreshold', TMode> & {
        abi?: never
        functionName?: 'addOwnerWithThreshold'
      } = {} as any,
) {
  return useContractWrite<typeof safeABI, 'addOwnerWithThreshold', TMode>({
    abi: safeABI,
    functionName: 'addOwnerWithThreshold',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"approveHash"`.
 */
export function useSafeApproveHash<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof safeABI,
          'approveHash'
        >['request']['abi'],
        'approveHash',
        TMode
      > & { functionName?: 'approveHash' }
    : UseContractWriteConfig<typeof safeABI, 'approveHash', TMode> & {
        abi?: never
        functionName?: 'approveHash'
      } = {} as any,
) {
  return useContractWrite<typeof safeABI, 'approveHash', TMode>({
    abi: safeABI,
    functionName: 'approveHash',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"changeThreshold"`.
 */
export function useSafeChangeThreshold<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof safeABI,
          'changeThreshold'
        >['request']['abi'],
        'changeThreshold',
        TMode
      > & { functionName?: 'changeThreshold' }
    : UseContractWriteConfig<typeof safeABI, 'changeThreshold', TMode> & {
        abi?: never
        functionName?: 'changeThreshold'
      } = {} as any,
) {
  return useContractWrite<typeof safeABI, 'changeThreshold', TMode>({
    abi: safeABI,
    functionName: 'changeThreshold',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"disableModule"`.
 */
export function useSafeDisableModule<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof safeABI,
          'disableModule'
        >['request']['abi'],
        'disableModule',
        TMode
      > & { functionName?: 'disableModule' }
    : UseContractWriteConfig<typeof safeABI, 'disableModule', TMode> & {
        abi?: never
        functionName?: 'disableModule'
      } = {} as any,
) {
  return useContractWrite<typeof safeABI, 'disableModule', TMode>({
    abi: safeABI,
    functionName: 'disableModule',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"enableModule"`.
 */
export function useSafeEnableModule<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof safeABI,
          'enableModule'
        >['request']['abi'],
        'enableModule',
        TMode
      > & { functionName?: 'enableModule' }
    : UseContractWriteConfig<typeof safeABI, 'enableModule', TMode> & {
        abi?: never
        functionName?: 'enableModule'
      } = {} as any,
) {
  return useContractWrite<typeof safeABI, 'enableModule', TMode>({
    abi: safeABI,
    functionName: 'enableModule',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"execTransaction"`.
 */
export function useSafeExecTransaction<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof safeABI,
          'execTransaction'
        >['request']['abi'],
        'execTransaction',
        TMode
      > & { functionName?: 'execTransaction' }
    : UseContractWriteConfig<typeof safeABI, 'execTransaction', TMode> & {
        abi?: never
        functionName?: 'execTransaction'
      } = {} as any,
) {
  return useContractWrite<typeof safeABI, 'execTransaction', TMode>({
    abi: safeABI,
    functionName: 'execTransaction',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"execTransactionFromModule"`.
 */
export function useSafeExecTransactionFromModule<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof safeABI,
          'execTransactionFromModule'
        >['request']['abi'],
        'execTransactionFromModule',
        TMode
      > & { functionName?: 'execTransactionFromModule' }
    : UseContractWriteConfig<
        typeof safeABI,
        'execTransactionFromModule',
        TMode
      > & {
        abi?: never
        functionName?: 'execTransactionFromModule'
      } = {} as any,
) {
  return useContractWrite<typeof safeABI, 'execTransactionFromModule', TMode>({
    abi: safeABI,
    functionName: 'execTransactionFromModule',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"execTransactionFromModuleReturnData"`.
 */
export function useSafeExecTransactionFromModuleReturnData<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof safeABI,
          'execTransactionFromModuleReturnData'
        >['request']['abi'],
        'execTransactionFromModuleReturnData',
        TMode
      > & { functionName?: 'execTransactionFromModuleReturnData' }
    : UseContractWriteConfig<
        typeof safeABI,
        'execTransactionFromModuleReturnData',
        TMode
      > & {
        abi?: never
        functionName?: 'execTransactionFromModuleReturnData'
      } = {} as any,
) {
  return useContractWrite<
    typeof safeABI,
    'execTransactionFromModuleReturnData',
    TMode
  >({
    abi: safeABI,
    functionName: 'execTransactionFromModuleReturnData',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"removeOwner"`.
 */
export function useSafeRemoveOwner<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof safeABI,
          'removeOwner'
        >['request']['abi'],
        'removeOwner',
        TMode
      > & { functionName?: 'removeOwner' }
    : UseContractWriteConfig<typeof safeABI, 'removeOwner', TMode> & {
        abi?: never
        functionName?: 'removeOwner'
      } = {} as any,
) {
  return useContractWrite<typeof safeABI, 'removeOwner', TMode>({
    abi: safeABI,
    functionName: 'removeOwner',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"setFallbackHandler"`.
 */
export function useSafeSetFallbackHandler<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof safeABI,
          'setFallbackHandler'
        >['request']['abi'],
        'setFallbackHandler',
        TMode
      > & { functionName?: 'setFallbackHandler' }
    : UseContractWriteConfig<typeof safeABI, 'setFallbackHandler', TMode> & {
        abi?: never
        functionName?: 'setFallbackHandler'
      } = {} as any,
) {
  return useContractWrite<typeof safeABI, 'setFallbackHandler', TMode>({
    abi: safeABI,
    functionName: 'setFallbackHandler',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"setGuard"`.
 */
export function useSafeSetGuard<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof safeABI,
          'setGuard'
        >['request']['abi'],
        'setGuard',
        TMode
      > & { functionName?: 'setGuard' }
    : UseContractWriteConfig<typeof safeABI, 'setGuard', TMode> & {
        abi?: never
        functionName?: 'setGuard'
      } = {} as any,
) {
  return useContractWrite<typeof safeABI, 'setGuard', TMode>({
    abi: safeABI,
    functionName: 'setGuard',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"setup"`.
 */
export function useSafeSetup<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof safeABI, 'setup'>['request']['abi'],
        'setup',
        TMode
      > & { functionName?: 'setup' }
    : UseContractWriteConfig<typeof safeABI, 'setup', TMode> & {
        abi?: never
        functionName?: 'setup'
      } = {} as any,
) {
  return useContractWrite<typeof safeABI, 'setup', TMode>({
    abi: safeABI,
    functionName: 'setup',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"simulateAndRevert"`.
 */
export function useSafeSimulateAndRevert<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof safeABI,
          'simulateAndRevert'
        >['request']['abi'],
        'simulateAndRevert',
        TMode
      > & { functionName?: 'simulateAndRevert' }
    : UseContractWriteConfig<typeof safeABI, 'simulateAndRevert', TMode> & {
        abi?: never
        functionName?: 'simulateAndRevert'
      } = {} as any,
) {
  return useContractWrite<typeof safeABI, 'simulateAndRevert', TMode>({
    abi: safeABI,
    functionName: 'simulateAndRevert',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"swapOwner"`.
 */
export function useSafeSwapOwner<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof safeABI,
          'swapOwner'
        >['request']['abi'],
        'swapOwner',
        TMode
      > & { functionName?: 'swapOwner' }
    : UseContractWriteConfig<typeof safeABI, 'swapOwner', TMode> & {
        abi?: never
        functionName?: 'swapOwner'
      } = {} as any,
) {
  return useContractWrite<typeof safeABI, 'swapOwner', TMode>({
    abi: safeABI,
    functionName: 'swapOwner',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link safeABI}__.
 */
export function usePrepareSafeWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof safeABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: safeABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof safeABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"addOwnerWithThreshold"`.
 */
export function usePrepareSafeAddOwnerWithThreshold(
  config: Omit<
    UsePrepareContractWriteConfig<typeof safeABI, 'addOwnerWithThreshold'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: safeABI,
    functionName: 'addOwnerWithThreshold',
    ...config,
  } as UsePrepareContractWriteConfig<typeof safeABI, 'addOwnerWithThreshold'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"approveHash"`.
 */
export function usePrepareSafeApproveHash(
  config: Omit<
    UsePrepareContractWriteConfig<typeof safeABI, 'approveHash'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: safeABI,
    functionName: 'approveHash',
    ...config,
  } as UsePrepareContractWriteConfig<typeof safeABI, 'approveHash'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"changeThreshold"`.
 */
export function usePrepareSafeChangeThreshold(
  config: Omit<
    UsePrepareContractWriteConfig<typeof safeABI, 'changeThreshold'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: safeABI,
    functionName: 'changeThreshold',
    ...config,
  } as UsePrepareContractWriteConfig<typeof safeABI, 'changeThreshold'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"disableModule"`.
 */
export function usePrepareSafeDisableModule(
  config: Omit<
    UsePrepareContractWriteConfig<typeof safeABI, 'disableModule'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: safeABI,
    functionName: 'disableModule',
    ...config,
  } as UsePrepareContractWriteConfig<typeof safeABI, 'disableModule'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"enableModule"`.
 */
export function usePrepareSafeEnableModule(
  config: Omit<
    UsePrepareContractWriteConfig<typeof safeABI, 'enableModule'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: safeABI,
    functionName: 'enableModule',
    ...config,
  } as UsePrepareContractWriteConfig<typeof safeABI, 'enableModule'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"execTransaction"`.
 */
export function usePrepareSafeExecTransaction(
  config: Omit<
    UsePrepareContractWriteConfig<typeof safeABI, 'execTransaction'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: safeABI,
    functionName: 'execTransaction',
    ...config,
  } as UsePrepareContractWriteConfig<typeof safeABI, 'execTransaction'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"execTransactionFromModule"`.
 */
export function usePrepareSafeExecTransactionFromModule(
  config: Omit<
    UsePrepareContractWriteConfig<typeof safeABI, 'execTransactionFromModule'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: safeABI,
    functionName: 'execTransactionFromModule',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof safeABI,
    'execTransactionFromModule'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"execTransactionFromModuleReturnData"`.
 */
export function usePrepareSafeExecTransactionFromModuleReturnData(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof safeABI,
      'execTransactionFromModuleReturnData'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: safeABI,
    functionName: 'execTransactionFromModuleReturnData',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof safeABI,
    'execTransactionFromModuleReturnData'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"removeOwner"`.
 */
export function usePrepareSafeRemoveOwner(
  config: Omit<
    UsePrepareContractWriteConfig<typeof safeABI, 'removeOwner'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: safeABI,
    functionName: 'removeOwner',
    ...config,
  } as UsePrepareContractWriteConfig<typeof safeABI, 'removeOwner'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"setFallbackHandler"`.
 */
export function usePrepareSafeSetFallbackHandler(
  config: Omit<
    UsePrepareContractWriteConfig<typeof safeABI, 'setFallbackHandler'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: safeABI,
    functionName: 'setFallbackHandler',
    ...config,
  } as UsePrepareContractWriteConfig<typeof safeABI, 'setFallbackHandler'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"setGuard"`.
 */
export function usePrepareSafeSetGuard(
  config: Omit<
    UsePrepareContractWriteConfig<typeof safeABI, 'setGuard'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: safeABI,
    functionName: 'setGuard',
    ...config,
  } as UsePrepareContractWriteConfig<typeof safeABI, 'setGuard'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"setup"`.
 */
export function usePrepareSafeSetup(
  config: Omit<
    UsePrepareContractWriteConfig<typeof safeABI, 'setup'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: safeABI,
    functionName: 'setup',
    ...config,
  } as UsePrepareContractWriteConfig<typeof safeABI, 'setup'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"simulateAndRevert"`.
 */
export function usePrepareSafeSimulateAndRevert(
  config: Omit<
    UsePrepareContractWriteConfig<typeof safeABI, 'simulateAndRevert'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: safeABI,
    functionName: 'simulateAndRevert',
    ...config,
  } as UsePrepareContractWriteConfig<typeof safeABI, 'simulateAndRevert'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link safeABI}__ and `functionName` set to `"swapOwner"`.
 */
export function usePrepareSafeSwapOwner(
  config: Omit<
    UsePrepareContractWriteConfig<typeof safeABI, 'swapOwner'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: safeABI,
    functionName: 'swapOwner',
    ...config,
  } as UsePrepareContractWriteConfig<typeof safeABI, 'swapOwner'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link safeABI}__.
 */
export function useSafeEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof safeABI, TEventName>,
    'abi'
  > = {} as any,
) {
  return useContractEvent({ abi: safeABI, ...config } as UseContractEventConfig<
    typeof safeABI,
    TEventName
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link safeABI}__ and `eventName` set to `"AddedOwner"`.
 */
export function useSafeAddedOwnerEvent(
  config: Omit<
    UseContractEventConfig<typeof safeABI, 'AddedOwner'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: safeABI,
    eventName: 'AddedOwner',
    ...config,
  } as UseContractEventConfig<typeof safeABI, 'AddedOwner'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link safeABI}__ and `eventName` set to `"ApproveHash"`.
 */
export function useSafeApproveHashEvent(
  config: Omit<
    UseContractEventConfig<typeof safeABI, 'ApproveHash'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: safeABI,
    eventName: 'ApproveHash',
    ...config,
  } as UseContractEventConfig<typeof safeABI, 'ApproveHash'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link safeABI}__ and `eventName` set to `"ChangedFallbackHandler"`.
 */
export function useSafeChangedFallbackHandlerEvent(
  config: Omit<
    UseContractEventConfig<typeof safeABI, 'ChangedFallbackHandler'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: safeABI,
    eventName: 'ChangedFallbackHandler',
    ...config,
  } as UseContractEventConfig<typeof safeABI, 'ChangedFallbackHandler'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link safeABI}__ and `eventName` set to `"ChangedGuard"`.
 */
export function useSafeChangedGuardEvent(
  config: Omit<
    UseContractEventConfig<typeof safeABI, 'ChangedGuard'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: safeABI,
    eventName: 'ChangedGuard',
    ...config,
  } as UseContractEventConfig<typeof safeABI, 'ChangedGuard'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link safeABI}__ and `eventName` set to `"ChangedThreshold"`.
 */
export function useSafeChangedThresholdEvent(
  config: Omit<
    UseContractEventConfig<typeof safeABI, 'ChangedThreshold'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: safeABI,
    eventName: 'ChangedThreshold',
    ...config,
  } as UseContractEventConfig<typeof safeABI, 'ChangedThreshold'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link safeABI}__ and `eventName` set to `"DisabledModule"`.
 */
export function useSafeDisabledModuleEvent(
  config: Omit<
    UseContractEventConfig<typeof safeABI, 'DisabledModule'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: safeABI,
    eventName: 'DisabledModule',
    ...config,
  } as UseContractEventConfig<typeof safeABI, 'DisabledModule'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link safeABI}__ and `eventName` set to `"EnabledModule"`.
 */
export function useSafeEnabledModuleEvent(
  config: Omit<
    UseContractEventConfig<typeof safeABI, 'EnabledModule'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: safeABI,
    eventName: 'EnabledModule',
    ...config,
  } as UseContractEventConfig<typeof safeABI, 'EnabledModule'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link safeABI}__ and `eventName` set to `"ExecutionFailure"`.
 */
export function useSafeExecutionFailureEvent(
  config: Omit<
    UseContractEventConfig<typeof safeABI, 'ExecutionFailure'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: safeABI,
    eventName: 'ExecutionFailure',
    ...config,
  } as UseContractEventConfig<typeof safeABI, 'ExecutionFailure'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link safeABI}__ and `eventName` set to `"ExecutionFromModuleFailure"`.
 */
export function useSafeExecutionFromModuleFailureEvent(
  config: Omit<
    UseContractEventConfig<typeof safeABI, 'ExecutionFromModuleFailure'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: safeABI,
    eventName: 'ExecutionFromModuleFailure',
    ...config,
  } as UseContractEventConfig<typeof safeABI, 'ExecutionFromModuleFailure'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link safeABI}__ and `eventName` set to `"ExecutionFromModuleSuccess"`.
 */
export function useSafeExecutionFromModuleSuccessEvent(
  config: Omit<
    UseContractEventConfig<typeof safeABI, 'ExecutionFromModuleSuccess'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: safeABI,
    eventName: 'ExecutionFromModuleSuccess',
    ...config,
  } as UseContractEventConfig<typeof safeABI, 'ExecutionFromModuleSuccess'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link safeABI}__ and `eventName` set to `"ExecutionSuccess"`.
 */
export function useSafeExecutionSuccessEvent(
  config: Omit<
    UseContractEventConfig<typeof safeABI, 'ExecutionSuccess'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: safeABI,
    eventName: 'ExecutionSuccess',
    ...config,
  } as UseContractEventConfig<typeof safeABI, 'ExecutionSuccess'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link safeABI}__ and `eventName` set to `"RemovedOwner"`.
 */
export function useSafeRemovedOwnerEvent(
  config: Omit<
    UseContractEventConfig<typeof safeABI, 'RemovedOwner'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: safeABI,
    eventName: 'RemovedOwner',
    ...config,
  } as UseContractEventConfig<typeof safeABI, 'RemovedOwner'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link safeABI}__ and `eventName` set to `"SafeReceived"`.
 */
export function useSafeSafeReceivedEvent(
  config: Omit<
    UseContractEventConfig<typeof safeABI, 'SafeReceived'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: safeABI,
    eventName: 'SafeReceived',
    ...config,
  } as UseContractEventConfig<typeof safeABI, 'SafeReceived'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link safeABI}__ and `eventName` set to `"SafeSetup"`.
 */
export function useSafeSafeSetupEvent(
  config: Omit<
    UseContractEventConfig<typeof safeABI, 'SafeSetup'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: safeABI,
    eventName: 'SafeSetup',
    ...config,
  } as UseContractEventConfig<typeof safeABI, 'SafeSetup'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link safeABI}__ and `eventName` set to `"SignMsg"`.
 */
export function useSafeSignMsgEvent(
  config: Omit<
    UseContractEventConfig<typeof safeABI, 'SignMsg'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: safeABI,
    eventName: 'SignMsg',
    ...config,
  } as UseContractEventConfig<typeof safeABI, 'SignMsg'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link timestampIntentABI}__.
 */
export function useTimestampIntentRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof timestampIntentABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof timestampIntentABI,
      TFunctionName,
      TSelectData
    >,
    'abi'
  > = {} as any,
) {
  return useContractRead({
    abi: timestampIntentABI,
    ...config,
  } as UseContractReadConfig<
    typeof timestampIntentABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link timestampIntentABI}__ and `functionName` set to `"encodeIntent"`.
 */
export function useTimestampIntentEncodeIntent<
  TFunctionName extends 'encodeIntent',
  TSelectData = ReadContractResult<typeof timestampIntentABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof timestampIntentABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: timestampIntentABI,
    functionName: 'encodeIntent',
    ...config,
  } as UseContractReadConfig<
    typeof timestampIntentABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link timestampIntentABI}__ and `functionName` set to `"execute"`.
 */
export function useTimestampIntentExecute<
  TFunctionName extends 'execute',
  TSelectData = ReadContractResult<typeof timestampIntentABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof timestampIntentABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: timestampIntentABI,
    functionName: 'execute',
    ...config,
  } as UseContractReadConfig<
    typeof timestampIntentABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link walletFactoryABI}__.
 */
export function useWalletFactoryRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof walletFactoryABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof walletFactoryABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({
    abi: walletFactoryABI,
    ...config,
  } as UseContractReadConfig<
    typeof walletFactoryABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link walletFactoryABI}__ and `functionName` set to `"getChainId"`.
 */
export function useWalletFactoryGetChainId<
  TFunctionName extends 'getChainId',
  TSelectData = ReadContractResult<typeof walletFactoryABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof walletFactoryABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: walletFactoryABI,
    functionName: 'getChainId',
    ...config,
  } as UseContractReadConfig<
    typeof walletFactoryABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link walletFactoryABI}__ and `functionName` set to `"getDeterministicWalletAddress"`.
 */
export function useWalletFactoryGetDeterministicWalletAddress<
  TFunctionName extends 'getDeterministicWalletAddress',
  TSelectData = ReadContractResult<typeof walletFactoryABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof walletFactoryABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: walletFactoryABI,
    functionName: 'getDeterministicWalletAddress',
    ...config,
  } as UseContractReadConfig<
    typeof walletFactoryABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link walletFactoryABI}__ and `functionName` set to `"isWalletMaterialized"`.
 */
export function useWalletFactoryIsWalletMaterialized<
  TFunctionName extends 'isWalletMaterialized',
  TSelectData = ReadContractResult<typeof walletFactoryABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof walletFactoryABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: walletFactoryABI,
    functionName: 'isWalletMaterialized',
    ...config,
  } as UseContractReadConfig<
    typeof walletFactoryABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link walletFactoryABI}__ and `functionName` set to `"proxyCreationCode"`.
 */
export function useWalletFactoryProxyCreationCode<
  TFunctionName extends 'proxyCreationCode',
  TSelectData = ReadContractResult<typeof walletFactoryABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof walletFactoryABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: walletFactoryABI,
    functionName: 'proxyCreationCode',
    ...config,
  } as UseContractReadConfig<
    typeof walletFactoryABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link walletFactoryABI}__.
 */
export function useWalletFactoryWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof walletFactoryABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof walletFactoryABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof walletFactoryABI, TFunctionName, TMode>({
    abi: walletFactoryABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link walletFactoryABI}__ and `functionName` set to `"createChainSpecificProxyWithNonce"`.
 */
export function useWalletFactoryCreateChainSpecificProxyWithNonce<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof walletFactoryABI,
          'createChainSpecificProxyWithNonce'
        >['request']['abi'],
        'createChainSpecificProxyWithNonce',
        TMode
      > & { functionName?: 'createChainSpecificProxyWithNonce' }
    : UseContractWriteConfig<
        typeof walletFactoryABI,
        'createChainSpecificProxyWithNonce',
        TMode
      > & {
        abi?: never
        functionName?: 'createChainSpecificProxyWithNonce'
      } = {} as any,
) {
  return useContractWrite<
    typeof walletFactoryABI,
    'createChainSpecificProxyWithNonce',
    TMode
  >({
    abi: walletFactoryABI,
    functionName: 'createChainSpecificProxyWithNonce',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link walletFactoryABI}__ and `functionName` set to `"createDeterministicWallet"`.
 */
export function useWalletFactoryCreateDeterministicWallet<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof walletFactoryABI,
          'createDeterministicWallet'
        >['request']['abi'],
        'createDeterministicWallet',
        TMode
      > & { functionName?: 'createDeterministicWallet' }
    : UseContractWriteConfig<
        typeof walletFactoryABI,
        'createDeterministicWallet',
        TMode
      > & {
        abi?: never
        functionName?: 'createDeterministicWallet'
      } = {} as any,
) {
  return useContractWrite<
    typeof walletFactoryABI,
    'createDeterministicWallet',
    TMode
  >({
    abi: walletFactoryABI,
    functionName: 'createDeterministicWallet',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link walletFactoryABI}__ and `functionName` set to `"createProxyWithCallback"`.
 */
export function useWalletFactoryCreateProxyWithCallback<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof walletFactoryABI,
          'createProxyWithCallback'
        >['request']['abi'],
        'createProxyWithCallback',
        TMode
      > & { functionName?: 'createProxyWithCallback' }
    : UseContractWriteConfig<
        typeof walletFactoryABI,
        'createProxyWithCallback',
        TMode
      > & {
        abi?: never
        functionName?: 'createProxyWithCallback'
      } = {} as any,
) {
  return useContractWrite<
    typeof walletFactoryABI,
    'createProxyWithCallback',
    TMode
  >({
    abi: walletFactoryABI,
    functionName: 'createProxyWithCallback',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link walletFactoryABI}__ and `functionName` set to `"createProxyWithNonce"`.
 */
export function useWalletFactoryCreateProxyWithNonce<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof walletFactoryABI,
          'createProxyWithNonce'
        >['request']['abi'],
        'createProxyWithNonce',
        TMode
      > & { functionName?: 'createProxyWithNonce' }
    : UseContractWriteConfig<
        typeof walletFactoryABI,
        'createProxyWithNonce',
        TMode
      > & {
        abi?: never
        functionName?: 'createProxyWithNonce'
      } = {} as any,
) {
  return useContractWrite<
    typeof walletFactoryABI,
    'createProxyWithNonce',
    TMode
  >({
    abi: walletFactoryABI,
    functionName: 'createProxyWithNonce',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link walletFactoryABI}__.
 */
export function usePrepareWalletFactoryWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof walletFactoryABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: walletFactoryABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof walletFactoryABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link walletFactoryABI}__ and `functionName` set to `"createChainSpecificProxyWithNonce"`.
 */
export function usePrepareWalletFactoryCreateChainSpecificProxyWithNonce(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof walletFactoryABI,
      'createChainSpecificProxyWithNonce'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: walletFactoryABI,
    functionName: 'createChainSpecificProxyWithNonce',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof walletFactoryABI,
    'createChainSpecificProxyWithNonce'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link walletFactoryABI}__ and `functionName` set to `"createDeterministicWallet"`.
 */
export function usePrepareWalletFactoryCreateDeterministicWallet(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof walletFactoryABI,
      'createDeterministicWallet'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: walletFactoryABI,
    functionName: 'createDeterministicWallet',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof walletFactoryABI,
    'createDeterministicWallet'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link walletFactoryABI}__ and `functionName` set to `"createProxyWithCallback"`.
 */
export function usePrepareWalletFactoryCreateProxyWithCallback(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof walletFactoryABI,
      'createProxyWithCallback'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: walletFactoryABI,
    functionName: 'createProxyWithCallback',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof walletFactoryABI,
    'createProxyWithCallback'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link walletFactoryABI}__ and `functionName` set to `"createProxyWithNonce"`.
 */
export function usePrepareWalletFactoryCreateProxyWithNonce(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof walletFactoryABI,
      'createProxyWithNonce'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: walletFactoryABI,
    functionName: 'createProxyWithNonce',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof walletFactoryABI,
    'createProxyWithNonce'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link walletFactoryABI}__.
 */
export function useWalletFactoryEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof walletFactoryABI, TEventName>,
    'abi'
  > = {} as any,
) {
  return useContractEvent({
    abi: walletFactoryABI,
    ...config,
  } as UseContractEventConfig<typeof walletFactoryABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link walletFactoryABI}__ and `eventName` set to `"ProxyCreation"`.
 */
export function useWalletFactoryProxyCreationEvent(
  config: Omit<
    UseContractEventConfig<typeof walletFactoryABI, 'ProxyCreation'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: walletFactoryABI,
    eventName: 'ProxyCreation',
    ...config,
  } as UseContractEventConfig<typeof walletFactoryABI, 'ProxyCreation'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link walletFactoryTestnetABI}__.
 */
export function useWalletFactoryTestnetRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<
    typeof walletFactoryTestnetABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof walletFactoryTestnetABI,
      TFunctionName,
      TSelectData
    >,
    'abi'
  > = {} as any,
) {
  return useContractRead({
    abi: walletFactoryTestnetABI,
    ...config,
  } as UseContractReadConfig<
    typeof walletFactoryTestnetABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link walletFactoryTestnetABI}__ and `functionName` set to `"getChainId"`.
 */
export function useWalletFactoryTestnetGetChainId<
  TFunctionName extends 'getChainId',
  TSelectData = ReadContractResult<
    typeof walletFactoryTestnetABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof walletFactoryTestnetABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: walletFactoryTestnetABI,
    functionName: 'getChainId',
    ...config,
  } as UseContractReadConfig<
    typeof walletFactoryTestnetABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link walletFactoryTestnetABI}__ and `functionName` set to `"getDeterministicWalletAddress"`.
 */
export function useWalletFactoryTestnetGetDeterministicWalletAddress<
  TFunctionName extends 'getDeterministicWalletAddress',
  TSelectData = ReadContractResult<
    typeof walletFactoryTestnetABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof walletFactoryTestnetABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: walletFactoryTestnetABI,
    functionName: 'getDeterministicWalletAddress',
    ...config,
  } as UseContractReadConfig<
    typeof walletFactoryTestnetABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link walletFactoryTestnetABI}__ and `functionName` set to `"isWalletMaterialized"`.
 */
export function useWalletFactoryTestnetIsWalletMaterialized<
  TFunctionName extends 'isWalletMaterialized',
  TSelectData = ReadContractResult<
    typeof walletFactoryTestnetABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof walletFactoryTestnetABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: walletFactoryTestnetABI,
    functionName: 'isWalletMaterialized',
    ...config,
  } as UseContractReadConfig<
    typeof walletFactoryTestnetABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link walletFactoryTestnetABI}__ and `functionName` set to `"proxyCreationCode"`.
 */
export function useWalletFactoryTestnetProxyCreationCode<
  TFunctionName extends 'proxyCreationCode',
  TSelectData = ReadContractResult<
    typeof walletFactoryTestnetABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof walletFactoryTestnetABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: walletFactoryTestnetABI,
    functionName: 'proxyCreationCode',
    ...config,
  } as UseContractReadConfig<
    typeof walletFactoryTestnetABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link walletFactoryTestnetABI}__ and `functionName` set to `"testTokens"`.
 */
export function useWalletFactoryTestnetTestTokens<
  TFunctionName extends 'testTokens',
  TSelectData = ReadContractResult<
    typeof walletFactoryTestnetABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof walletFactoryTestnetABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: walletFactoryTestnetABI,
    functionName: 'testTokens',
    ...config,
  } as UseContractReadConfig<
    typeof walletFactoryTestnetABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link walletFactoryTestnetABI}__.
 */
export function useWalletFactoryTestnetWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof walletFactoryTestnetABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<
        typeof walletFactoryTestnetABI,
        TFunctionName,
        TMode
      > & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof walletFactoryTestnetABI, TFunctionName, TMode>(
    { abi: walletFactoryTestnetABI, ...config } as any,
  )
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link walletFactoryTestnetABI}__ and `functionName` set to `"createChainSpecificProxyWithNonce"`.
 */
export function useWalletFactoryTestnetCreateChainSpecificProxyWithNonce<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof walletFactoryTestnetABI,
          'createChainSpecificProxyWithNonce'
        >['request']['abi'],
        'createChainSpecificProxyWithNonce',
        TMode
      > & { functionName?: 'createChainSpecificProxyWithNonce' }
    : UseContractWriteConfig<
        typeof walletFactoryTestnetABI,
        'createChainSpecificProxyWithNonce',
        TMode
      > & {
        abi?: never
        functionName?: 'createChainSpecificProxyWithNonce'
      } = {} as any,
) {
  return useContractWrite<
    typeof walletFactoryTestnetABI,
    'createChainSpecificProxyWithNonce',
    TMode
  >({
    abi: walletFactoryTestnetABI,
    functionName: 'createChainSpecificProxyWithNonce',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link walletFactoryTestnetABI}__ and `functionName` set to `"createDeterministicWallet"`.
 */
export function useWalletFactoryTestnetCreateDeterministicWallet<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof walletFactoryTestnetABI,
          'createDeterministicWallet'
        >['request']['abi'],
        'createDeterministicWallet',
        TMode
      > & { functionName?: 'createDeterministicWallet' }
    : UseContractWriteConfig<
        typeof walletFactoryTestnetABI,
        'createDeterministicWallet',
        TMode
      > & {
        abi?: never
        functionName?: 'createDeterministicWallet'
      } = {} as any,
) {
  return useContractWrite<
    typeof walletFactoryTestnetABI,
    'createDeterministicWallet',
    TMode
  >({
    abi: walletFactoryTestnetABI,
    functionName: 'createDeterministicWallet',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link walletFactoryTestnetABI}__ and `functionName` set to `"createProxyWithCallback"`.
 */
export function useWalletFactoryTestnetCreateProxyWithCallback<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof walletFactoryTestnetABI,
          'createProxyWithCallback'
        >['request']['abi'],
        'createProxyWithCallback',
        TMode
      > & { functionName?: 'createProxyWithCallback' }
    : UseContractWriteConfig<
        typeof walletFactoryTestnetABI,
        'createProxyWithCallback',
        TMode
      > & {
        abi?: never
        functionName?: 'createProxyWithCallback'
      } = {} as any,
) {
  return useContractWrite<
    typeof walletFactoryTestnetABI,
    'createProxyWithCallback',
    TMode
  >({
    abi: walletFactoryTestnetABI,
    functionName: 'createProxyWithCallback',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link walletFactoryTestnetABI}__ and `functionName` set to `"createProxyWithNonce"`.
 */
export function useWalletFactoryTestnetCreateProxyWithNonce<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof walletFactoryTestnetABI,
          'createProxyWithNonce'
        >['request']['abi'],
        'createProxyWithNonce',
        TMode
      > & { functionName?: 'createProxyWithNonce' }
    : UseContractWriteConfig<
        typeof walletFactoryTestnetABI,
        'createProxyWithNonce',
        TMode
      > & {
        abi?: never
        functionName?: 'createProxyWithNonce'
      } = {} as any,
) {
  return useContractWrite<
    typeof walletFactoryTestnetABI,
    'createProxyWithNonce',
    TMode
  >({
    abi: walletFactoryTestnetABI,
    functionName: 'createProxyWithNonce',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link walletFactoryTestnetABI}__.
 */
export function usePrepareWalletFactoryTestnetWrite<
  TFunctionName extends string,
>(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof walletFactoryTestnetABI,
      TFunctionName
    >,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: walletFactoryTestnetABI,
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof walletFactoryTestnetABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link walletFactoryTestnetABI}__ and `functionName` set to `"createChainSpecificProxyWithNonce"`.
 */
export function usePrepareWalletFactoryTestnetCreateChainSpecificProxyWithNonce(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof walletFactoryTestnetABI,
      'createChainSpecificProxyWithNonce'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: walletFactoryTestnetABI,
    functionName: 'createChainSpecificProxyWithNonce',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof walletFactoryTestnetABI,
    'createChainSpecificProxyWithNonce'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link walletFactoryTestnetABI}__ and `functionName` set to `"createDeterministicWallet"`.
 */
export function usePrepareWalletFactoryTestnetCreateDeterministicWallet(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof walletFactoryTestnetABI,
      'createDeterministicWallet'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: walletFactoryTestnetABI,
    functionName: 'createDeterministicWallet',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof walletFactoryTestnetABI,
    'createDeterministicWallet'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link walletFactoryTestnetABI}__ and `functionName` set to `"createProxyWithCallback"`.
 */
export function usePrepareWalletFactoryTestnetCreateProxyWithCallback(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof walletFactoryTestnetABI,
      'createProxyWithCallback'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: walletFactoryTestnetABI,
    functionName: 'createProxyWithCallback',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof walletFactoryTestnetABI,
    'createProxyWithCallback'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link walletFactoryTestnetABI}__ and `functionName` set to `"createProxyWithNonce"`.
 */
export function usePrepareWalletFactoryTestnetCreateProxyWithNonce(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof walletFactoryTestnetABI,
      'createProxyWithNonce'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: walletFactoryTestnetABI,
    functionName: 'createProxyWithNonce',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof walletFactoryTestnetABI,
    'createProxyWithNonce'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link walletFactoryTestnetABI}__.
 */
export function useWalletFactoryTestnetEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof walletFactoryTestnetABI, TEventName>,
    'abi'
  > = {} as any,
) {
  return useContractEvent({
    abi: walletFactoryTestnetABI,
    ...config,
  } as UseContractEventConfig<typeof walletFactoryTestnetABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link walletFactoryTestnetABI}__ and `eventName` set to `"ProxyCreation"`.
 */
export function useWalletFactoryTestnetProxyCreationEvent(
  config: Omit<
    UseContractEventConfig<typeof walletFactoryTestnetABI, 'ProxyCreation'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: walletFactoryTestnetABI,
    eventName: 'ProxyCreation',
    ...config,
  } as UseContractEventConfig<typeof walletFactoryTestnetABI, 'ProxyCreation'>)
}
