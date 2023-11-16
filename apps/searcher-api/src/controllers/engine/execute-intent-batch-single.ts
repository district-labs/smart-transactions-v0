import { getIntentBatchApi } from "@district-labs/intentify-api-actions"
import { Request, Response } from "express"

import { env } from "../../env"
import CustomError from "../../utils/customError"
import { simulateExecuteIntentBatch } from "./utils/simulate-execute-intent-batch"

/**
 * Execute a single intent batch by ID.
 */
export const executeIntentBatchSingle = async (
  request: Request,
  response: Response
) => {
  try {
    const intentBatchId = request.params.id
    if (!intentBatchId) {
      throw new CustomError("Invalid IntentBatch ID", 400)
    }

    const intentBatch = await getIntentBatchApi(env.INTENTIFY_API_URL, {
      intentBatchHash: intentBatchId,
      expand: {
        executedTxs: true,
        intents: true,
        strategy: true,
        user: true,
      },
    })

    if (!intentBatch) {
      throw new CustomError("IntentBatch not found", 404)
    }

    const txReceipt = await simulateExecuteIntentBatch(intentBatch)

    return response.status(201).json({ txReceipt: JSON.stringify(txReceipt) })
  } catch (error: any) {
    console.error(error)
    return response.status(500).json({ error: error?.message })
  }
}
