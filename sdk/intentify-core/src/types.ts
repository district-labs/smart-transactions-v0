export enum NonceType {
  Standard = 0,
  Dimensional = 1,
  Time = 2,
}

export type EIP712Domain = {
  name: string;
  version: string;
  chainId: bigint;
  verifyingContract: `0x${string}`; // Ethereum addresses are usually represented as strings in TypeScript
};

export type DimensionalNonce = {
  queue: bigint; // uint128 can be represented as a bigint in TypeScript
  accumulator: bigint; // uint128 can be represented as a number in TypeScript
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
  intentBatchHash?: `0x${string}`; // Used for the intent batch hash in the database. This is not part of the EIP712 signature.
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

export interface Token {
  name: string;
  address: string;
  symbol: string;
  decimals: number;
  chainId: number;
  logoURI: string;
  tags?: string[];
  extensions?: {
    bridgeInfo?:
      | {
          [key: string]:
            | {
                tokenAddress: string;
              }
            | undefined;
        }
      | undefined;
  };
}

export interface TokenList {
  name: string;
  logoURI: string;
  keywords: string[];
  tags: {
    [key: string]: {
      name: string;
      description: string;
    };
  };
  timestamp: string;
  tokens: Token[];
  version: {
    major: number;
    minor: number;
    patch: number;
  };
}

export interface Vault {
  name: string
  address: string
  symbol: string
  decimals: number
  chainId: number
  logoURI: string
  tags?: string[]
  extensions?: {
    bridgeInfo?:
      | {
          [key: string]:
            | {
                tokenAddress: string
              }
            | undefined
        }
      | undefined
  }
  asset: Token
}

export interface VaultList {
  name: string
  logoURI: string
  keywords: string[]
  tags: {
    [key: string]: {
      name: string
      description: string
    }
  }
  timestamp: string
  vaults: Vault[]
  version: {
    major: number
    minor: number
    patch: number
  }
}