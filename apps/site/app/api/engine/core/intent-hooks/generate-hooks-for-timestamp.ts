import { ADDRESS_ZERO, Hook } from "@district-labs/intentify-utils"

export function generateHooksForTimestamp(chainId: number): Hook[] {
  // 1. Timestamp Intent == No Hook
  return [
    {
      target: ADDRESS_ZERO,
      data: "0x00",
    },
  ]
}
