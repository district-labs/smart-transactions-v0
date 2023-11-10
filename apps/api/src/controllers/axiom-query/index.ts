import type {
  SolidityAccountResponse,
  SolidityBlockResponse,
  SolidityStorageResponse,
} from "@axiom-crypto/core";
import type { NextFunction, Request, Response } from "express";
import { encodeFunctionData, type Address } from "viem";
import { z } from "zod";
import CustomError from "../../utils/customError";
import { axiomV1QueryABI, getAxiom, getRelayerByChainId } from "../utils";

const queriesSchema = z.array(
  z.object({
    blockNumber: z.number(),
    address: z.string().optional(),
    slot: z.string().optional(),
  }),
);

const getAxiomQuerySchema = z.object({
  chainId: z.number(),
  keccakQueryResponse: z.string(),
  queries: queriesSchema.min(1),
});
export async function getAxiomQuery(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { chainId, keccakQueryResponse, queries } = getAxiomQuerySchema.parse(
      request.body,
    );

    const ax = getAxiom(chainId);
    const responseTree =
      await ax.query.getResponseTreeForKeccakQueryResponse(keccakQueryResponse);

    const keccakBlockResponse = responseTree.blockTree.getHexRoot();
    const keccakAccountResponse = responseTree.accountTree.getHexRoot();
    const keccakStorageResponse = responseTree.storageTree.getHexRoot();

    const blockResponses: SolidityBlockResponse[] = [];
    const accountResponses: SolidityAccountResponse[] = [];
    const storageResponses: SolidityStorageResponse[] = [];

    queries.forEach(({ blockNumber, address, slot }) => {
      const validationWitness = ax.query.getValidationWitness(
        responseTree,
        blockNumber,
        address,
        slot,
      );

      if (!validationWitness) {
        throw new CustomError("Validation Witness not found", 400);
      }
      validationWitness.blockResponse
        ? blockResponses.push(validationWitness.blockResponse)
        : null;
      validationWitness.accountResponse
        ? accountResponses.push(validationWitness.accountResponse)
        : null;
      validationWitness.storageResponse
        ? storageResponses.push(validationWitness.storageResponse)
        : null;

      return validationWitness.blockResponse;
    });

    const responseData = {
      keccakBlockResponse,
      keccakAccountResponse,
      keccakStorageResponse,
      blockResponses,
      accountResponses,
      storageResponses,
    };

    return response.status(200).send({ data: responseData });
  } catch (error) {
    next(error);
  }
}

const postAxiomQuerySchema = z.object({
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
