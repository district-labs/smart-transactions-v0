import type { DbIntentBatchWithRelations } from "@district-labs/intentify-database"
import { NextFunction, Request, Response } from "express"

import { getPublicClientByChainId, INTENTIFY_API_URL } from "../../constants"
import CustomError from "../../utils/customError"
import { getRelayerAddress, getRelayerByChainId } from "../../utils/relayer"
import { executeIntentBatchExecution } from "./utils/execute-intent-batch-execution"
import { generateIntentBatchExecution } from "./utils/generate-intent-batch-execution"
import { simulateIntentBatchExecution } from "./utils/simulate-intent-batch-execution"

/**
 * Execute a single intent batch by ID.
 */
export const executeIntentBatchSingle = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const intentBatchId = request.params.id
    if (!intentBatchId) {
      throw new CustomError("Invalid IntentBatch ID", 400)
    }

    const res = await fetch(
      `${INTENTIFY_API_URL}/intent-batch/${intentBatchId}`
    )

    if (!res.ok) {
      return response.status(res.status).json({ data: res.statusText })
    }

    const intentBatch: { data: DbIntentBatchWithRelations } = await res.json()

    if (Object.keys(intentBatch).length === 0) {
      return response
        .status(404)
        .json({ data: `IntentBatch with ID ${intentBatchId} not found` })
    }

    const { chainId } = intentBatch.data

    const relayer = getRelayerByChainId(chainId).relayer
    const searcherAddress = await getRelayerAddress(relayer)

    const publicClient = getPublicClientByChainId(chainId)

    const intentBatchExecution = await generateIntentBatchExecution({
      intentBatch: intentBatch.data,
      publicClient,
    })

    delete intentBatchExecution.batch.intentBatchHash

    // Run a simulation of the intent batch execution
    // Reverts if the intent batch execution is invalid
    await simulateIntentBatchExecution({
      intentBatchExecution,
      chainId,
      publicClient,
      searcherAddress,
    })

    const txReceipt = await executeIntentBatchExecution({
      chainId,
      intentBatchExecution,
      publicClient,
      relayer,
    })

    return response.status(200).json({ txReceipt: JSON.stringify(txReceipt) })
  } catch (error: any) {
    return response.status(500).json({ error: error?.message })
  }
}
