import { utils } from "ethers";
import { END_BLOCK, START_BLOCK, UNI_V3_POOL_ADDR, ax, axiomV1Query } from "..";


export async function GET(){
  try {
    const qb = ax.newQueryBuilder();
    await qb.append({blockNumber: START_BLOCK, address: UNI_V3_POOL_ADDR, slot: 8});
    await qb.append({blockNumber: END_BLOCK, address: UNI_V3_POOL_ADDR, slot: 8});

    const {keccakQueryResponse, queryHash, query} = await qb.build();

  const txResult = await axiomV1Query.sendQuery(
  keccakQueryResponse,
  "0x4596039A69602b115752006Ef8425f43d6E80a6f",
  query,
  {
     value: utils.parseEther("0.01"), // Goerli payment value
  });

  return new Response(JSON.stringify({success: true, keccakQueryResponse, queryHash, txResult}), { status: 200 })


  } catch (e) {
    console.error(e);
    return new Response("An Error ocurred while sending the query", { status: 500 });
  }
}