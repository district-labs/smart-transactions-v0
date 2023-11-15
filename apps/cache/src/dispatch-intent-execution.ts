import { executeIntentBatchApi } from "@district-labs/intentify-api-actions";
import { Transaction } from "@ponder/core";

export async function dispatchIntentExecution(
  chainId: number,
  intentBatchId: `0x${string}`,
  receipt: Transaction,
) {
  const CORE_API_URL = process.env.CORE_API_URL;

  if (!CORE_API_URL) {
    throw new Error("CORE_API_URL is not defined");
  }

  try {
    if(!receipt.blockHash || !receipt.blockNumber || !receipt.to || !receipt.hash) throw new Error("Missing receipt data")
    await executeIntentBatchApi(CORE_API_URL,{
        chainId,
        intentBatchHash: intentBatchId,
        blockHash: receipt.blockHash,
        blockNumber: Number(receipt.blockNumber),
        to: receipt.to,
        transactionHash: receipt.hash,   
    });
  } catch (error) {
    console.log(error);
  }
}
