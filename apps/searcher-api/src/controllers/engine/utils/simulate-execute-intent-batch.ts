import type { DbIntentBatchWithRelations } from "@district-labs/intentify-database"

import { getPublicClientByChainId } from "../../../constants"
import { getRelayerAddress, getRelayerByChainId } from "../../../utils/relayer"
import { executeIntentBatch } from "./execute-intent-batch"
import { generateIntentBatchExecution } from "./generate-intent-batch-execution"
import { simulateIntentBatch } from "./simulate-intent-batch"

/**
 * Simulates and executes an intent batch
 * @param intentBatchDb The intent batch object with relations from the database
 * @returns The transaction receipt
 */
export async function simulateExecuteIntentBatch(
  intentBatchDb: DbIntentBatchWithRelations
) {
  const { chainId, intentBatchHash } = intentBatchDb
  try {
    const relayer = getRelayerByChainId(chainId).relayer
    const searcherAddress = await getRelayerAddress(relayer)
    const publicClient = getPublicClientByChainId(chainId)

    const intentBatchExecution = await generateIntentBatchExecution({
      intentBatch: intentBatchDb,
      publicClient,
    })

    // Run a simulation of the intent batch execution
    // Reverts if the intent batch execution is invalid
    await simulateIntentBatch({
      intentBatchExecution,
      chainId,
      publicClient,
      searcherAddress,
    })

    // Execute the intent batch
    const { success, txReceipt, message } = await executeIntentBatch({
      chainId,
      intentBatchExecution,
      publicClient,
      relayer,
    })

    if (!success) {
      return { success, intentBatchHash, message } as const
    }

    return { success, intentBatchHash, txReceipt } as const
  } catch (error: any) {
    console.error(error)
    return {
      success: false,
      intentBatchHash,
      message: String(error?.message),
    } as const
  }
}
