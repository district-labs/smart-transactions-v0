import { Request, Response, NextFunction } from "express";
import { updateIntentBatchExecuted } from '../../../database/writes/intent-batch'
import CustomError from "../../../utils/customError";

export const eventIntentBatchExecuted = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { chainId, intentBatchId, transactionHash } = await request.body

    if(!chainId || !intentBatchId || !transactionHash) {
      throw new CustomError("Missing Event Parameters", 400);
    }

    await updateIntentBatchExecuted(intentBatchId, {
      chainId: Number(chainId),
      executedTxHash: transactionHash,
      executedAt: new Date(), // TODO: Use the timestamp from the event/transaction
    })

    return response.status(200).send()
  } catch (error) {
    next(error);
  }
};