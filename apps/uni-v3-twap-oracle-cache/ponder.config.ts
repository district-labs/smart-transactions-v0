import type { Config } from "@ponder/core";

export const config: Config = {
  networks: [
    { name: "goerli", chainId: 5, rpcUrl: process.env.PONDER_RPC_URL_GOERLI },
  ],
  contracts: [
    {
      name: "UniswapV3TwapOracle",
      network: "goerli",
      address: "0xA754f61Ba3A8da22BD186a542a151Fcd637Cd85c",
      abi: "./abis/UniswapV3TwapOracle.json",
      startBlock: 9844774,
    },
    {
      name: "AxiomV1Query",
      network: "goerli",
      address: "0x4Fb202140c5319106F15706b1A69E441c9536306",
      abi: "./abis/AxiomV1Query.json",
      startBlock: 9844774,
    },
  ],
};
