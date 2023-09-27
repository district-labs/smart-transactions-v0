import type { Config } from "@ponder/core";

export const IntentifyModuleAddressList = {
  5: '0x6d39bb7e7BF4eDE48E0CC62701E751D8deC07D2d',
  31337: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
} as const


const localConfig: Config = {
  networks: [
    { name: "mainnet", chainId: 1, rpcUrl: process.env.PONDER_RPC_URL_MAINNET },
    { name: "goerli", chainId: 5, rpcUrl: process.env.PONDER_RPC_URL_GOERLI },
    { name: "testnet", chainId: 31337, rpcUrl: process.env.PONDER_RPC_URL_TESTNET },
  ],
  contracts: [
    {
      name: "IntentifySafeModuleGoerli",
      network: "goerli",
      address: IntentifyModuleAddressList[5],
      abi: './abis/IntentifySafeModule.json',
      startBlock: 9764809,
    },
    {
      name: "IntentifySafeModuleLocal",
      network: "testnet",
      address: IntentifyModuleAddressList[31337],
      abi: './abis/IntentifySafeModule.json',
      startBlock: 0,
    },
  ],
};

 const prodConfig: Config = {
  networks: [
    { name: "mainnet", chainId: 1, rpcUrl: process.env.PONDER_RPC_URL_MAINNET },
    { name: "goerli", chainId: 5, rpcUrl: process.env.PONDER_RPC_URL_GOERLI },
  ],
  contracts: [
    {
      name: "IntentifySafeModuleGoerli",
      network: "goerli",
      address: IntentifyModuleAddressList[5],
      abi: './abis/IntentifySafeModule.json',
      startBlock: 9764809,
    },
  ],
};

export const config = process.env.npm_lifecycle_event === "start" ? prodConfig : localConfig;

