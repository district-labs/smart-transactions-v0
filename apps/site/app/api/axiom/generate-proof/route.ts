import {
  createPublicClient,
  encodeFunctionData,
  http,
  type Address,
} from "viem"
import { goerli } from "viem/chains"

import { getRelayerByChainId } from "@/lib/openzeppelin-defender/relayer"

import { ax, chainId, UNI_V3_POOL_ADDR } from ".."
import { axiomV1QueryABI } from "../abis"

export async function GET() {
  try {
    const client = createPublicClient({
      chain: goerli,
      transport: http(),
    })
    const currentBlockNumber = await client.getBlockNumber()
    const blockNumber = Number(currentBlockNumber) - 1

    const qb = ax.newQueryBuilder()
    await qb.append({ blockNumber, address: UNI_V3_POOL_ADDR, slot: 8 })
    const { keccakQueryResponse, query } = await qb.build()

    const { relayer } = getRelayerByChainId(chainId)
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

    const tx = await client.waitForTransactionReceipt({
      hash: txReceipt.hash as `0x${string}`,
    })

    if (tx.status === "reverted") {
      return new Response("Error sending the query", { status: 500 })
    }

    return new Response(
      JSON.stringify({
        blockNumber,
        keccakQueryResponse,
        txHash: txReceipt.hash,
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
