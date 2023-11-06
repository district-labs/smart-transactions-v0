export function setIntentBatchManagerNonce(
  intentBatchManager: any,
  intentBatch: any,
  nonceData: {
    standard: string
    dimensional: string
  }
) {
  if (intentBatch.nonce.type === "standard") {
    intentBatchManager.nonce("standard", [nonceData.standard])
  }

  if (intentBatch.nonce.type === "dimensional") {
    intentBatchManager.nonce("dimensional", [
      intentBatch?.nonce?.args[0],
      nonceData.dimensional,
    ])
  }
  if (intentBatch.nonce.type === "time") {
    intentBatchManager.nonce("time", [
      intentBatch?.nonce?.args[0],
      intentBatch?.nonce?.args[1],
      intentBatch?.nonce?.args[2],
    ])
  }
}
