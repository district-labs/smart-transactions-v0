import type {
  SolidityAccountResponse,
  SolidityBlockResponse,
  SolidityStorageResponse,
} from "@axiom-crypto/core";

import { getAxiomQueries } from "@district-labs/intentify-database";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import CustomError from "../../utils/customError";
import { getAxiom } from "../utils";

export const getAxiomQuerySchema = z.object({
  chainId: z.number(),
  keccakQueryResponse: z.string(),
});

export type GetAxiomQueryApiParams = z.infer<typeof getAxiomQuerySchema>;

export async function getAxiomQuery(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const requestParsed = getAxiomQuerySchema.parse(await request.body);
    const queries = await getAxiomQueries({
      keccakQueryResponse: requestParsed.keccakQueryResponse,
    });

    const ax = getAxiom(requestParsed.chainId);

    const responseTree = await ax.query.getResponseTreeForKeccakQueryResponse(
      requestParsed.keccakQueryResponse,
    );

    const keccakBlockResponse = responseTree.blockTree.getHexRoot() as string;
    const keccakAccountResponse =
      responseTree.accountTree.getHexRoot() as string;
    const keccakStorageResponse =
      responseTree.storageTree.getHexRoot() as string;

    const blockResponses: SolidityBlockResponse[] = [];
    const accountResponses: SolidityAccountResponse[] = [];
    const storageResponses: SolidityStorageResponse[] = [];

    queries.forEach(({ blockNumber, address, slot }) => {
      const validationWitness = ax.query.getValidationWitness(
        responseTree,
        blockNumber,
        address || undefined,
        slot || undefined,
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
