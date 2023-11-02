export const axiomV1QueryABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "BlockHashNotValidatedInCache",
    type: "error",
  },
  {
    inputs: [],
    name: "BlockHashWitnessNotRecent",
    type: "error",
  },
  {
    inputs: [],
    name: "BlockMerkleRootDoesNotMatchProof",
    type: "error",
  },
  {
    inputs: [],
    name: "CannotFulfillIfNotActive",
    type: "error",
  },
  {
    inputs: [],
    name: "CannotRefundBeforeDeadline",
    type: "error",
  },
  {
    inputs: [],
    name: "CannotRefundIfNotActive",
    type: "error",
  },
  {
    inputs: [],
    name: "ClaimedMMRDoesNotMatchRecent",
    type: "error",
  },
  {
    inputs: [],
    name: "ContractIsFrozen",
    type: "error",
  },
  {
    inputs: [],
    name: "HistoricalMMRKeccakDoesNotMatchProof",
    type: "error",
  },
  {
    inputs: [],
    name: "KeccakQueryResponseDoesNotMatchProof",
    type: "error",
  },
  {
    inputs: [],
    name: "MMREndBlockNotRecent",
    type: "error",
  },
  {
    inputs: [],
    name: "MMRProofVerificationFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "NotProverRole",
    type: "error",
  },
  {
    inputs: [],
    name: "PriceNotPaid",
    type: "error",
  },
  {
    inputs: [],
    name: "PriceTooHigh",
    type: "error",
  },
  {
    inputs: [],
    name: "ProofVerificationFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "QueryNotInactive",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousAdmin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "AdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "beacon",
        type: "address",
      },
    ],
    name: "BeaconUpgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "FreezeAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "keccakBlockResponse",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "keccakAccountResponse",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "keccakStorageResponse",
        type: "bytes32",
      },
    ],
    name: "KeccakResultEvent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "poseidonBlockResponse",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "poseidonAccountResponse",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "poseidonStorageResponse",
        type: "bytes32",
      },
    ],
    name: "PoseidonResultEvent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "keccakQueryResponse",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "payment",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "prover",
        type: "address",
      },
    ],
    name: "QueryFulfilled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "keccakQueryResponse",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "payment",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "deadlineBlockNumber",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "refundee",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "ipfsHash",
        type: "bytes32",
      },
    ],
    name: "QueryInitiatedOffchain",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "keccakQueryResponse",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "payment",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "deadlineBlockNumber",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "refundee",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "queryHash",
        type: "bytes32",
      },
    ],
    name: "QueryInitiatedOnchain",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "keccakQueryResponse",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "payment",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "deadlineBlockNumber",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "refundee",
        type: "address",
      },
    ],
    name: "QueryRefunded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "UnfreezeAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newAddress",
        type: "address",
      },
    ],
    name: "UpdateAxiomAddress",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newAddress",
        type: "address",
      },
    ],
    name: "UpdateMMRVerifierAddress",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "maxQueryPrice",
        type: "uint256",
      },
    ],
    name: "UpdateMaxQueryPrice",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "minQueryPrice",
        type: "uint256",
      },
    ],
    name: "UpdateMinQueryPrice",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint32",
        name: "queryDeadlineInterval",
        type: "uint32",
      },
    ],
    name: "UpdateQueryDeadlineInterval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "GUARDIAN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PROVER_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "TIMELOCK_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "keccakBlockResponse",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "keccakAccountResponse",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "keccakStorageResponse",
        type: "bytes32",
      },
      {
        components: [
          {
            internalType: "uint32",
            name: "blockNumber",
            type: "uint32",
          },
          {
            internalType: "bytes32",
            name: "blockHash",
            type: "bytes32",
          },
          {
            internalType: "uint32",
            name: "leafIdx",
            type: "uint32",
          },
          {
            internalType: "bytes32[6]",
            name: "proof",
            type: "bytes32[6]",
          },
        ],
        internalType: "struct IAxiomV1Query.BlockResponse[]",
        name: "blockResponses",
        type: "tuple[]",
      },
      {
        components: [
          {
            internalType: "uint32",
            name: "blockNumber",
            type: "uint32",
          },
          {
            internalType: "address",
            name: "addr",
            type: "address",
          },
          {
            internalType: "uint64",
            name: "nonce",
            type: "uint64",
          },
          {
            internalType: "uint96",
            name: "balance",
            type: "uint96",
          },
          {
            internalType: "bytes32",
            name: "storageRoot",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "codeHash",
            type: "bytes32",
          },
          {
            internalType: "uint32",
            name: "leafIdx",
            type: "uint32",
          },
          {
            internalType: "bytes32[6]",
            name: "proof",
            type: "bytes32[6]",
          },
        ],
        internalType: "struct IAxiomV1Query.AccountResponse[]",
        name: "accountResponses",
        type: "tuple[]",
      },
      {
        components: [
          {
            internalType: "uint32",
            name: "blockNumber",
            type: "uint32",
          },
          {
            internalType: "address",
            name: "addr",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "slot",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "uint32",
            name: "leafIdx",
            type: "uint32",
          },
          {
            internalType: "bytes32[6]",
            name: "proof",
            type: "bytes32[6]",
          },
        ],
        internalType: "struct IAxiomV1Query.StorageResponse[]",
        name: "storageResponses",
        type: "tuple[]",
      },
    ],
    name: "areResponsesValid",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "axiomAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "keccakQueryResponse",
        type: "bytes32",
      },
    ],
    name: "collectRefund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "freezeAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "frozen",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "keccakQueryResponse",
        type: "bytes32",
      },
      {
        internalType: "address payable",
        name: "payee",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "mmrIdx",
        type: "uint32",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "prevHash",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "root",
            type: "bytes32",
          },
          {
            internalType: "uint32",
            name: "numFinal",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "startBlockNumber",
            type: "uint32",
          },
          {
            internalType: "bytes32[10]",
            name: "recentMMRPeaks",
            type: "bytes32[10]",
          },
          {
            internalType: "bytes32[10]",
            name: "mmrComplementOrPeaks",
            type: "bytes32[10]",
          },
        ],
        internalType: "struct IAxiomV1Query.RecentMMRWitness",
        name: "mmrWitness",
        type: "tuple",
      },
      {
        internalType: "bytes",
        name: "proof",
        type: "bytes",
      },
    ],
    name: "fulfillQueryVsMMR",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_axiomAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_mmrVerifierAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_minQueryPrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_maxQueryPrice",
        type: "uint256",
      },
      {
        internalType: "uint32",
        name: "_queryDeadlineInterval",
        type: "uint32",
      },
      {
        internalType: "address",
        name: "timelock",
        type: "address",
      },
      {
        internalType: "address",
        name: "guardian",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "keccakBlockResponse",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "keccakAccountResponse",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "keccakStorageResponse",
        type: "bytes32",
      },
    ],
    name: "isKeccakResultValid",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "poseidonBlockResponse",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "poseidonAccountResponse",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "poseidonStorageResponse",
        type: "bytes32",
      },
    ],
    name: "isPoseidonResultValid",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxQueryPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "minQueryPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mmrVerifierAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proxiableUUID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "queries",
    outputs: [
      {
        internalType: "uint256",
        name: "payment",
        type: "uint256",
      },
      {
        internalType: "enum IAxiomV1Query.AxiomQueryState",
        name: "state",
        type: "uint8",
      },
      {
        internalType: "uint32",
        name: "deadlineBlockNumber",
        type: "uint32",
      },
      {
        internalType: "address payable",
        name: "refundee",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "queryDeadlineInterval",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "keccakQueryResponse",
        type: "bytes32",
      },
      {
        internalType: "address payable",
        name: "refundee",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "ipfsHash",
        type: "bytes32",
      },
    ],
    name: "sendOffchainQuery",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "keccakQueryResponse",
        type: "bytes32",
      },
      {
        internalType: "address payable",
        name: "refundee",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "query",
        type: "bytes",
      },
    ],
    name: "sendQuery",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "unfreezeAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_axiomAddress",
        type: "address",
      },
    ],
    name: "updateAxiomAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_mmrVerifierAddress",
        type: "address",
      },
    ],
    name: "updateMMRVerifierAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_maxQueryPrice",
        type: "uint256",
      },
    ],
    name: "updateMaxQueryPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_minQueryPrice",
        type: "uint256",
      },
    ],
    name: "updateMinQueryPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "_queryDeadlineInterval",
        type: "uint32",
      },
    ],
    name: "updateQueryDeadlineInterval",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
    ],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "verifiedKeccakResults",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "verifiedPoseidonResults",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "mmrIdx",
        type: "uint32",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "prevHash",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "root",
            type: "bytes32",
          },
          {
            internalType: "uint32",
            name: "numFinal",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "startBlockNumber",
            type: "uint32",
          },
          {
            internalType: "bytes32[10]",
            name: "recentMMRPeaks",
            type: "bytes32[10]",
          },
          {
            internalType: "bytes32[10]",
            name: "mmrComplementOrPeaks",
            type: "bytes32[10]",
          },
        ],
        internalType: "struct IAxiomV1Query.RecentMMRWitness",
        name: "mmrWitness",
        type: "tuple",
      },
      {
        internalType: "bytes",
        name: "proof",
        type: "bytes",
      },
    ],
    name: "verifyResultVsMMR",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
