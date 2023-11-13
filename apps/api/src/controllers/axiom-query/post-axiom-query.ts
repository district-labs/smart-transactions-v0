import type { NextFunction, Request, Response } from "express";
import { encodeFunctionData, type Address } from "viem";
import { z } from "zod";
import { axiomV1QueryABI, getAxiom, getRelayerByChainId } from "../utils";

const queriesSchema = z.array(
  z.object({
    blockNumber: z.number(),
    address: z.string().optional(),
    slot: z.string().optional(),
  }),
);

export const postAxiomQuerySchema = z.object({
  chainId: z.number(),
  queries: queriesSchema.min(1),
});

export async function postAxiomQuery(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { chainId, queries } = postAxiomQuerySchema.parse(request.body);

    const ax = getAxiom(chainId);
    const qb = ax.newQueryBuilder();

    for (const query of queries) {
      await qb.append(query);
    }

    const { keccakQueryResponse, queryHash, query } = await qb.build();

    const { relayer } = getRelayerByChainId(chainId);
    const relayerAddress = (await relayer.getRelayer()).address as Address;
    const axiomV1QueryAddress = ax.getAxiomQueryAddress() as Address;

    const data = encodeFunctionData({
      abi: axiomV1QueryABI,
      functionName: "sendQuery",
      args: [
        keccakQueryResponse as `0x${string}`,
        relayerAddress,
        query as `0x${string}`,
      ],
    });

    const txReceipt = await relayer.sendTransaction({
      gasLimit: 500000,
      speed: "fast",
      to: axiomV1QueryAddress,
      // 0.01 ETH
      value: "10000000000000000",
      data,
    });

    return response
      .status(200)
      .send({ success: true, keccakQueryResponse, queryHash, txReceipt });
  } catch (error) {
    next(error);
  }
}
