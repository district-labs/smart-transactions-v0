export async function POST(req: Request) {
  const res = new Response()
  const { chainId, intentBatchId, transactionHash } = await req.json()

  console.log("Hello from Event Cancelled")
  console.log(chainId, intentBatchId, transactionHash)
  return res
}
