import {
  db,
  updateIntentBatchCancelled,
} from "@district-labs/intentify-database";
import type { NextFunction, Request, Response } from "express";
import CustomError from "../../../../utils/customError";

export const eventIntentBatchCancelled = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { chainId, intentBatchId, transactionHash } = await request.body;

    if (!chainId || !intentBatchId || !transactionHash) {
      throw new CustomError("Missing Event Parameters", 400);
    }

    await updateIntentBatchCancelled(db, intentBatchId, {
      chainId: Number(chainId),
      cancelledTxHash: transactionHash,
      cancelledAt: new Date(), // TODO: Use the timestamp from the event/transaction
    });

    return response.status(200).send();
  } catch (error) {
    next(error);
  }
};
