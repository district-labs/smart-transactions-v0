import {
  UNIV3_POOL_TEST_DIS_USDC,
  UNIV3_POOL_TEST_RIZZ_USDC,
  UNIV3_POOL_TEST_WETH_USDC,
} from "@district-labs/intentify-deployments";
import { createPublicClient, http } from "viem";
import { goerli } from "viem/chains";

// Goerli
const CHAIN_ID = 5;

const UNI_V3_POOLS = [
  UNIV3_POOL_TEST_WETH_USDC[CHAIN_ID],
  UNIV3_POOL_TEST_RIZZ_USDC[CHAIN_ID],
  UNIV3_POOL_TEST_DIS_USDC[CHAIN_ID],
];

// UniV3 Pool Observations storage slot
const OBSERVATIONS_SLOT = "8";

export async function sendAxiomQueryUniV3Goerli() {
  try {
    const goerliPublicClient = createPublicClient({
      chain: goerli,
      transport: http(),
    });

    const blockNumber = await goerliPublicClient.getBlockNumber();

    const queries = UNI_V3_POOLS.map((poolAddress) => ({
      blockNumber: (blockNumber - BigInt(1)).toString(),
      address: poolAddress,
      slot: OBSERVATIONS_SLOT,
    }));

    const response = await fetch(
      `http:localhost:3002/service/axiom/send-query`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chainId: CHAIN_ID,
          queries,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Error sending axiom query");
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}
