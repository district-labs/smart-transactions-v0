import { getRelayerByChainId } from "@/lib/openzeppelin-defender/relayer"
import { encodeFunctionData, type Address } from "viem"
import { UNI_V3_POOL_ADDR, ax, chainId } from ".."
import { axiomV1QueryABI } from "../abis"

export async function GET() {
  try {
    const qb = ax.newQueryBuilder()
    await qb.append({
      blockNumber: 9848630,
      address: UNI_V3_POOL_ADDR,
      slot: 8,
    })

    const { keccakQueryResponse, queryHash, query } = await qb.build()

    const {relayer } = getRelayerByChainId(chainId)
    const relayerAddress = (await relayer.getRelayer()).address as Address
    const axiomV1QueryAddress = ax.getAxiomQueryAddress() as Address

    const data = encodeFunctionData({
      abi: axiomV1QueryABI,
      functionName: "sendQuery",
      args: [
        keccakQueryResponse as `0x${string}`,
        relayerAddress,
        query as `0x${string}`,
      ],
    })

    const txReceipt = await relayer.sendTransaction({
      gasLimit: 500000,
      speed: "fast",
      to: axiomV1QueryAddress,
      // 0.01 ETH
      value: "10000000000000000",
      data,
    })

    return new Response(
      JSON.stringify({
        keccakQueryResponse,
        queryHash,
        txReceipt,
      }),
      { status: 200 }
    )
  } catch (e) {
    console.error(e)
    return new Response("An Error ocurred while sending the query", {
      status: 500,
    })
  }
}
