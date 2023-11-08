import type { DbIntentBatchWithRelations } from "@district-labs/intentify-database"
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

    // TODO: Replace with api-actions SDK
    const res = await fetch(
      `${env.INTENTIFY_API_URL}/intent-batch/${intentBatchId}`
    )

    if (!res.ok) {
      return response.status(res.status).json({ data: res.statusText })
    }

    const intentBatchResponse: { data: DbIntentBatchWithRelations } =
      await res.json()

    const { data: intentBatchDb } = intentBatchResponse

    const txReceipt = await simulateExecuteIntentBatch(intentBatchDb)

    return response.status(201).json({ txReceipt: JSON.stringify(txReceipt) })
  } catch (error: any) {
    console.error(error)
    return response.status(500).json({ error: error?.message })
  }
}
