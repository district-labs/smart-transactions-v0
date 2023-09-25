import { updateIntentBatchExecuted } from "@/db/writes/intent-batch"

export async function POST(req: Request) {
  const res = new Response()
  const { chainId, intentBatchId, transactionHash } = await req.json()

  console.log(chainId, intentBatchId, transactionHash)
  updateIntentBatchExecuted(intentBatchId, {
    executedTxHash: transactionHash,
    executedAt: new Date(), // TODO: Use the timestamp from the event/transaction
  })
  console.log("Hello from Event Executed")

  return res
}
