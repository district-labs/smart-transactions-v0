import { IntentifyModuleAddressList, intentifySafeModuleABI } from "@district-labs/intentify-utils/index";
import type { Config } from "@ponder/core";

export const config: Config = {
  networks: [
    { name: "mainnet", chainId: 1, rpcUrl: process.env.PONDER_RPC_URL_MAINNET },
    { name: "goerli", chainId: 5, rpcUrl: process.env.PONDER_RPC_URL_GOERLI },
    { name: "testnet", chainId: 31337, rpcUrl: process.env.PONDER_RPC_URL_TESTNET },
  ],
  contracts: [
    {
      name: "IntentifySafeModule",
      network: "mainnet",
      address: IntentifyModuleAddressList[1],
      abi: intentifySafeModuleABI,
      startBlock: 1234567,
    },
    {
      name: "IntentifySafeModule",
      network: "goerli",
      address: IntentifyModuleAddressList[5],
      abi: intentifySafeModuleABI,
      startBlock: 1234567,
    },
    {
      name: "IntentifySafeModule",
      network: "testnet",
      address: IntentifyModuleAddressList[31337],
      abi: intentifySafeModuleABI,
      startBlock: 1234567,
    },
  ],
};
