import type { DbIntentBatchWithRelations } from "@district-labs/intentify-database"
import { Request, Response } from "express"

import { INTENTIFY_API_URL } from "../../constants"
import { simulateExecuteIntentBatch } from "./utils/simulate-execute-intent-batch"

/**
 * Fetches all valid intent batches from the database and executes them asynchronously.
 */
export const executeIntentBatches = async (
  request: Request,
  response: Response
) => {
  try {
    // TODO: Replace with api-actions SDK
    const res = await fetch(
      `${INTENTIFY_API_URL}/admin/intent-batch?intentBatchesValidity=valid`
    )

    if (!res.ok) {
      return response.status(res.status).json({ data: res.statusText })
    }

    const intentBatchResponse: { data: DbIntentBatchWithRelations[] } =
      await res.json()

    const validIntentBatches = intentBatchResponse.data

    if (validIntentBatches.length === 0) {
      return response
        .status(200)
        .json({ message: "No valid intent batches to execute" })
    }


    const executionResult = await Promise.all(
      validIntentBatches.map((intentBatchDb) =>
        simulateExecuteIntentBatch(intentBatchDb)
      )
    )

    const successfulExecutions = executionResult
      .filter((result) => result.success)
      .map(({ success, txReceipt }) => ({
        success,
        // Ensure that the txReceipt is serializable
        txReceipt: JSON.parse(
          JSON.stringify(txReceipt, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
          )
        ),
      }))
    const failedExecutions = executionResult.filter((result) => !result.success)

    return response.status(201).json({
      successfulExecutions,
      failedExecutions,
    })
  } catch (error: any) {
    console.error(error)
    return response.status(500).json({ error: error?.message })
  }
}
