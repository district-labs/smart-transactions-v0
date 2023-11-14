import { UniswapV3TwapOracle } from "@district-labs/intentify-deployments";
import type { Config } from "@ponder/core";
import { http } from "viem";

const GOERLI_CHAIN_ID = 5;

export const config: Config = {
  networks: [
    {
      name: "goerli",
      chainId: GOERLI_CHAIN_ID,
      transport: http(process.env.PONDER_RPC_URL_GOERLI),
    },
  ],
  contracts: [
    {
      name: "UniswapV3TwapOracle",
      network: "goerli",
      address: UniswapV3TwapOracle[GOERLI_CHAIN_ID],
      abi: "./abis/UniswapV3TwapOracle.json",
      startBlock: 10038857,
    },
    {
      name: "AxiomV1Query",
      network: "goerli",
      address: "0x4Fb202140c5319106F15706b1A69E441c9536306",
      abi: "./abis/AxiomV1Query.json",
      startBlock: 10038857,
    },
  ],
};
