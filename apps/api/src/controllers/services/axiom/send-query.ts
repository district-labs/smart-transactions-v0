import { Request, Response } from "express";
import { encodeFunctionData, type Address } from "viem";
import { z } from "zod";
import { getRelayerByChainId } from "../execution/utils/relayer";

import { getAxiom } from ".";
import { axiomV1QueryABI } from "./abis";

const reqSchema = z.object({
  chainId: z.number(),
  queries: z
    .array(
      z.object({
        blockNumber: z.number(),
        address: z.string().optional(),
        slot: z.string().optional(),
      })
    )
    .min(1),
})

export const axiomSendQuery = async (
  request: Request,
  response: Response,
) => {
  try {
    const requestParsed = reqSchema.parse(await request.body)
    const ax = getAxiom(requestParsed.chainId)
      const qb = ax.newQueryBuilder()

          for (const query of requestParsed.queries) {
      await qb.append(query)
    }

    const { keccakQueryResponse, queryHash, query } = await qb.build()

        const { relayer } = getRelayerByChainId(requestParsed.chainId)
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

    return response.status(200).send({ success: true,  keccakQueryResponse,
        queryHash,
        txReceipt });
  } catch (error) {
    console.error(error)
    return response.status(500).send("An Error ocurred while sending the query")
  }
};