import type {
  SolidityAccountResponse,
  SolidityBlockResponse,
  SolidityStorageResponse,
} from "@axiom-crypto/core";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import CustomError from "../../utils/customError";
import { getAxiom } from "../utils";

const queriesSchema = z.array(
  z.object({
    blockNumber: z.number(),
    address: z.string().optional(),
    slot: z.string().optional(),
  }),
);

export const getAxiomQuerySchema = z.object({
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
