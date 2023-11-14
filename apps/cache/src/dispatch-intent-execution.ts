import { executeIntentBatchApi } from "@district-labs/intentify-api-actions";
import { Transaction } from "@ponder/core";

export async function dispatchIntentExecution(
  chainId: number,
  intentBatchId: `0x${string}`,
  receipt: Transaction,
) {
  try {
    await executeIntentBatchApi({
      transactionParams: {
        chainId,
        intentBatchId,
        blockHash: receipt.blockHash,
        blockNumber: Number(receipt.blockNumber),
        to: receipt.to,
        transactionHash: receipt.hash,
      },
    });
  } catch (error) {
    console.log(error);
  }
}
