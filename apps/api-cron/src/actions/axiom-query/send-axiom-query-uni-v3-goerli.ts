import { postAxiomQueryApi } from "@district-labs/intentify-api-actions";
import {
  UNIV3_POOL_TEST_DIS_USDC,
  UNIV3_POOL_TEST_RIZZ_USDC,
  UNIV3_POOL_TEST_WETH_USDC,
} from "@district-labs/intentify-deployments";
import { createPublicClient, http } from "viem";
import { goerli } from "viem/chains";
import { env } from "../../env";

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
      blockNumber: Number(blockNumber - BigInt(1)),
      address: poolAddress,
      slot: OBSERVATIONS_SLOT,
    }));

    postAxiomQueryApi(env.CORE_API_URL,{
      chainId: CHAIN_ID,
      queries: queries.map((query) => ({
        ...query,
        blockNumber: query.blockNumber.toString(),
      })),
    })

  } catch (error) {
    console.log(error);
    return error;
  }
}
