import { getIntentBatchesApi } from "@district-labs/intentify-api-actions"
import { Request, Response } from "express"
import { simulateExecuteIntentBatch } from "./utils/simulate-execute-intent-batch"

/**
 * Fetches all valid intent batches from the database and executes them asynchronously.
 */
export const executeIntentBatches = async (
  request: Request,
  response: Response
) => {
  try {

    // TODO: Add filter for valid intent batches only
    const intentBatches = await getIntentBatchesApi({expand: {
      executedTxs: true,
      intents: true,
      strategy: true,
      user: true,
    }})

    if (intentBatches.length === 0) {
      return response
        .status(200)
        .json({ message: "No valid intent batches to execute" })
    }

    const executionResult = await Promise.all(
      intentBatches.map((intentBatchDb) =>
        simulateExecuteIntentBatch(intentBatchDb)
      )
    )

    const successfulExecutions = executionResult
      .filter((result) => result.success)
      .map(({ success, txReceipt, intentBatchHash }) => ({
        success,
        intentBatchHash,
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
