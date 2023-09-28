import { ADDRESS_ZERO, Hook } from "@district-labs/intentify-utils"

export function generateHooksForLimitOrderBasic(chainId: number): Hook[] {
  // 1. Timestamp Intent == No Hook
  // 2. Token Release Intent == No Hook
  // 3. Limit Order Intent == Fill on Uniswap

  // TODO: Make magic happen with Uniswap V3 swaps
  return [
    {
      target: ADDRESS_ZERO,
      data: "0x00",
    },
    {
      target: ADDRESS_ZERO,
      data: "0x00",
    },
    {
      target: ADDRESS_ZERO,
      data: "0x00",
    },
  ]
}
