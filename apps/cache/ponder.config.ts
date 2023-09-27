import { IntentifyModuleAddressList, intentifySafeModuleABI } from "@district-labs/intentify-utils";
import type { Config } from "@ponder/core";

const ABI = intentifySafeModuleABI

export const config: Config = {
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
      abi: intentifySafeModuleABI,
      startBlock: 9764809,
    },
    {
      name: "IntentifySafeModuleTestnet",
      network: "testnet",
      address: IntentifyModuleAddressList[31337],
      abi: intentifySafeModuleABI,
      startBlock: 0,
    },
  ],
};
