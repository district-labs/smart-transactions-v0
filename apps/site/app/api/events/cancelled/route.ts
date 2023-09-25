import { updateIntentBatchCancelled } from "@/db/writes/intent-batch"

export async function POST(req: Request) {
  const res = new Response()
  const { chainId, intentBatchId, transactionHash } = await req.json()

  console.log("Hello from Event Cancelled")
  updateIntentBatchCancelled(intentBatchId, {
    cancelledTxHash: transactionHash,
    cancelledAt: new Date(), // TODO: Use the timestamp from the event/transaction
  })
  console.log(chainId, intentBatchId, transactionHash)
  return res
}
