import type { Config } from "@ponder/core";
import { IntentifySafeModule } from '@district-labs/intentify-deployments' 

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
      address: IntentifySafeModule[5],
      abi: './abis/IntentifySafeModule.json',
      startBlock: 9764809,
    },
    {
      name: "IntentifySafeModuleLocal",
      network: "testnet",
      address: IntentifySafeModule[31337],
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
      address: IntentifySafeModule[5],
      abi: './abis/IntentifySafeModule.json',
      startBlock: 9764809,
    },
  ],
};

export const config = process.env.npm_lifecycle_event === "start" ? prodConfig : localConfig;

