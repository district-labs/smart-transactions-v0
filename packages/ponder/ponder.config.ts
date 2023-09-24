import type { Config } from "@ponder/core";

export const config: Config = {
  networks: [
    { name: "goerli", chainId: 5, rpcUrl:process.env.PONDER_RPC_URL_5 },
  ],
  contracts: [
    {
      name: "IntentifySafeModule",
      network: "goerli",
      address: "0xF783Cc471Cd4ED273056F1DD571b4beafa6A5CDE",
      abi: "./abis/IntentifySafeModule.json",
      startBlock: 9684295,
    },
  ],
};
