import { type IntentBatch } from "@district-labs/intentify-core"

type TransformToLeverageLong = {
  chainId: number
  supplyAsset: string
  borrowAsset: string
  interestRateMode: string
  minHealthFactor: string
  fee: string
  status: "open" | "closed" | "canceled"
}

export function transformToLeverageLong(
  intentBatch: any
): TransformToLeverageLong {
  const { intents } = intentBatch

  return {
    chainId: Number(intentBatch.chainId),
    supplyAsset: intents[0]?.intentArgs[0]?.value,
    borrowAsset: intents[0]?.intentArgs[1]?.value,
    interestRateMode: String(intents[0]?.intentArgs[2]?.value),
    minHealthFactor: String(intents[0]?.intentArgs[3]?.value),
    fee: String(intents[0]?.intentArgs[4]?.value),
    status: getStatus(intentBatch.executedAt, intentBatch?.cancelledAt),
  }
}

function getStatus(
  executedAt: Date | null,
  cancelledAt: Date | null
): "open" | "closed" | "canceled" {
  if (executedAt) {
    return "closed"
  } else if (cancelledAt) {
    return "canceled"
  } else {
    return "open"
  }
}
