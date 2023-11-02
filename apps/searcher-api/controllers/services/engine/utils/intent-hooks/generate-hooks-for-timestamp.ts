import { ADDRESS_ZERO, type Hook } from "@district-labs/intentify-core"

export function generateHooksForTimestamp(chainId: number): Hook[] {
  // 1. Timestamp Intent == No Hook
  return [
    {
      target: ADDRESS_ZERO,
      data: "0x00",
    },
  ]
}
