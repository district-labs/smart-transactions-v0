import type {
  SolidityAccountResponse,
  SolidityBlockResponse,
  SolidityStorageResponse,
} from "@axiom-crypto/core";
import { Request, Response } from "express";
import { z } from "zod";
import { getAxiom } from ".";
import CustomError from "../../../../utils/customError";

const reqSchema = z.object({
  chainId: z.number(),
  keccakQueryResponse: z.string(),
  queries: z.array(
    z.object({
      blockNumber: z.number(),
      address: z.string().optional(),
      slot: z.string().optional(),
    }),
  ),
});

export const getQueryResult = async (request: Request, response: Response) => {
  try {
    const requestParsed = reqSchema.parse(await request.body);

    const ax = getAxiom(requestParsed.chainId);

    const responseTree = await ax.query.getResponseTreeForKeccakQueryResponse(
      requestParsed.keccakQueryResponse,
    );

    const keccakBlockResponse = responseTree.blockTree.getHexRoot();
    const keccakAccountResponse = responseTree.accountTree.getHexRoot();
    const keccakStorageResponse = responseTree.storageTree.getHexRoot();

    const blockResponses: SolidityBlockResponse[] = [];
    const accountResponses: SolidityAccountResponse[] = [];
    const storageResponses: SolidityStorageResponse[] = [];

    requestParsed.queries.map(({ blockNumber, address, slot }) => {
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

    return response.status(200).send({ success: true, responseData });
  } catch (error) {
    console.error(error);
    return response
      .status(500)
      .send("An Error ocurred while sending the query");
  }
};
