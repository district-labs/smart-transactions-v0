import {
  getEIP712DomainPacketHash,
  getIntentBatchTypedDataHash,
} from "@district-labs/intentify-core";
import { IntentifySafeModule } from "@district-labs/intentify-deployments";
import { NextFunction, Request, Response } from "express";
import { getIronSession } from "iron-session";
import { SUPPORTED_CHAINS } from "../../constants";
import { intentBatchFactory } from "../../intent-batch-factory";
import { ironOptions } from "../../iron-session";
import {
  createIntentBatchInDB,
  getIntentBatchFromDB,
  getIntentBatchesFromDB,
} from "../../models/intent-batch";
import CustomError from "../../utils/customError";

/**
 * Handle request to retrieve all users.
 * Filters can be optionally applied to narrow down the result set.
 */
export const getIntentBatches = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const filters = request.query;

    if (!filters.root) {
      return response.status(400).json({ error: "Missing root parameter" });
    }

    const intentBatches = await getIntentBatchesFromDB(filters);

    return response.status(200).json({ data: intentBatches });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle request to retrieve a user by their ID.
 */
export const getIntentBatchById = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const intentBatchId = request.params.id;
    if (!intentBatchId) {
      throw new CustomError("Invalid IntentBatch ID", 400);
    }

    const intentBatch = await getIntentBatchFromDB(intentBatchId);

    return response.status(200).json({ data: intentBatch });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle request to create a new user.
 */
export const createIntentBatch = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const session = await getIronSession(request, response, ironOptions);
    // Destructure and validate required fields from the request body
    const { intentBatch, signature, chainId, strategyId } = request.body;

    // Validate the signature
    // TODO: Crytpgraphically verify the signature
    if (!signature || signature.length !== 132) {
      throw new CustomError("Invalid signature", 400);
    }

    // Validate the chainId
    if (!chainId || !SUPPORTED_CHAINS.includes(chainId)) {
      throw new CustomError("Invalid chainId", 400);
    }

    // Decode the intent batch
    const decodedIntentBatch =
      intentBatchFactory.decodeIntentBatch(intentBatch);

    const domainSeparator = getEIP712DomainPacketHash({
      name: "Intentify Safe Module",
      version: "0",
      chainId: chainId, 
      verifyingContract: IntentifySafeModule[chainId],
    });

    const intentBatchHash = getIntentBatchTypedDataHash(
      domainSeparator,
      intentBatch,
    );

    // Insert the new IntentBatch into the database
    const newIntentBatch = await createIntentBatchInDB({
      chainId,
      intentBatchHash: intentBatchHash as string,
      nonce: intentBatch.nonce,
      root: intentBatch.root,
      userId: session.address,
      intentBatchNew: intentBatch,
      signature,
      intentsDecoded: decodedIntentBatch,
      strategyId,
    });

    return response.status(201).json({ data: newIntentBatch, intentBatchHash });
  } catch (error) {
    next(error);
  }
};
