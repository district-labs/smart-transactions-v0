//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UniswapV3TwapOracle
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const uniswapV3TwapOracleABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      {
        name: '_axiomV1QueryAddress',
        internalType: 'address',
        type: 'address',
      },
    ],
  },
  { type: 'error', inputs: [], name: 'InvalidObservationOrder' },
  { type: 'error', inputs: [], name: 'InvalidProof' },
  { type: 'error', inputs: [], name: 'InvalidSlot' },
  { type: 'error', inputs: [], name: 'NoStorageResponses' },
  {
    type: 'error',
    inputs: [
      { name: 'pool', internalType: 'address', type: 'address' },
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ObservationNotStored',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'pool', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'blockNumber',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ObservationStored',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'axiomV1Query',
    outputs: [
      { name: '', internalType: 'contract IAxiomV1Query', type: 'address' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'poolAddress', internalType: 'address', type: 'address' },
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getObservation',
    outputs: [
      {
        name: 'observation',
        internalType: 'struct Oracle.Observation',
        type: 'tuple',
        components: [
          { name: 'blockTimestamp', internalType: 'uint32', type: 'uint32' },
          { name: 'tickCumulative', internalType: 'int56', type: 'int56' },
          {
            name: 'secondsPerLiquidityCumulativeX128',
            internalType: 'uint160',
            type: 'uint160',
          },
          { name: 'initialized', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'poolAddress', internalType: 'address', type: 'address' },
      { name: 'startBlockNumber', internalType: 'uint256', type: 'uint256' },
      { name: 'endBlockNumber', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getTwaLiquidity',
    outputs: [
      { name: 'twaLiquidity', internalType: 'uint160', type: 'uint160' },
      {
        name: 'startObservation',
        internalType: 'struct Oracle.Observation',
        type: 'tuple',
        components: [
          { name: 'blockTimestamp', internalType: 'uint32', type: 'uint32' },
          { name: 'tickCumulative', internalType: 'int56', type: 'int56' },
          {
            name: 'secondsPerLiquidityCumulativeX128',
            internalType: 'uint160',
            type: 'uint160',
          },
          { name: 'initialized', internalType: 'bool', type: 'bool' },
        ],
      },
      {
        name: 'endObservation',
        internalType: 'struct Oracle.Observation',
        type: 'tuple',
        components: [
          { name: 'blockTimestamp', internalType: 'uint32', type: 'uint32' },
          { name: 'tickCumulative', internalType: 'int56', type: 'int56' },
          {
            name: 'secondsPerLiquidityCumulativeX128',
            internalType: 'uint160',
            type: 'uint160',
          },
          { name: 'initialized', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'poolAddress', internalType: 'address', type: 'address' },
      { name: 'startBlockNumber', internalType: 'uint256', type: 'uint256' },
      { name: 'endBlockNumber', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getTwaTick',
    outputs: [
      { name: 'twaTick', internalType: 'int24', type: 'int24' },
      {
        name: 'startObservation',
        internalType: 'struct Oracle.Observation',
        type: 'tuple',
        components: [
          { name: 'blockTimestamp', internalType: 'uint32', type: 'uint32' },
          { name: 'tickCumulative', internalType: 'int56', type: 'int56' },
          {
            name: 'secondsPerLiquidityCumulativeX128',
            internalType: 'uint160',
            type: 'uint160',
          },
          { name: 'initialized', internalType: 'bool', type: 'bool' },
        ],
      },
      {
        name: 'endObservation',
        internalType: 'struct Oracle.Observation',
        type: 'tuple',
        components: [
          { name: 'blockTimestamp', internalType: 'uint32', type: 'uint32' },
          { name: 'tickCumulative', internalType: 'int56', type: 'int56' },
          {
            name: 'secondsPerLiquidityCumulativeX128',
            internalType: 'uint160',
            type: 'uint160',
          },
          { name: 'initialized', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'observationHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'observations',
    outputs: [
      { name: 'blockTimestamp', internalType: 'uint32', type: 'uint32' },
      { name: 'tickCumulative', internalType: 'int56', type: 'int56' },
      {
        name: 'secondsPerLiquidityCumulativeX128',
        internalType: 'uint160',
        type: 'uint160',
      },
      { name: 'initialized', internalType: 'bool', type: 'bool' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'axiomResponse',
        internalType: 'struct AxiomResponseStruct',
        type: 'tuple',
        components: [
          {
            name: 'keccakBlockResponse',
            internalType: 'bytes32',
            type: 'bytes32',
          },
          {
            name: 'keccakAccountResponse',
            internalType: 'bytes32',
            type: 'bytes32',
          },
          {
            name: 'keccakStorageResponse',
            internalType: 'bytes32',
            type: 'bytes32',
          },
          {
            name: 'blockResponses',
            internalType: 'struct IAxiomV1Query.BlockResponse[]',
            type: 'tuple[]',
            components: [
              { name: 'blockNumber', internalType: 'uint32', type: 'uint32' },
              { name: 'blockHash', internalType: 'bytes32', type: 'bytes32' },
              { name: 'leafIdx', internalType: 'uint32', type: 'uint32' },
              { name: 'proof', internalType: 'bytes32[6]', type: 'bytes32[6]' },
            ],
          },
          {
            name: 'accountResponses',
            internalType: 'struct IAxiomV1Query.AccountResponse[]',
            type: 'tuple[]',
            components: [
              { name: 'blockNumber', internalType: 'uint32', type: 'uint32' },
              { name: 'addr', internalType: 'address', type: 'address' },
              { name: 'nonce', internalType: 'uint64', type: 'uint64' },
              { name: 'balance', internalType: 'uint96', type: 'uint96' },
              { name: 'storageRoot', internalType: 'bytes32', type: 'bytes32' },
              { name: 'codeHash', internalType: 'bytes32', type: 'bytes32' },
              { name: 'leafIdx', internalType: 'uint32', type: 'uint32' },
              { name: 'proof', internalType: 'bytes32[6]', type: 'bytes32[6]' },
            ],
          },
          {
            name: 'storageResponses',
            internalType: 'struct IAxiomV1Query.StorageResponse[]',
            type: 'tuple[]',
            components: [
              { name: 'blockNumber', internalType: 'uint32', type: 'uint32' },
              { name: 'addr', internalType: 'address', type: 'address' },
              { name: 'slot', internalType: 'uint256', type: 'uint256' },
              { name: 'value', internalType: 'uint256', type: 'uint256' },
              { name: 'leafIdx', internalType: 'uint32', type: 'uint32' },
              { name: 'proof', internalType: 'bytes32[6]', type: 'bytes32[6]' },
            ],
          },
        ],
      },
    ],
    name: 'storeObservations',
    outputs: [],
  },
] as const