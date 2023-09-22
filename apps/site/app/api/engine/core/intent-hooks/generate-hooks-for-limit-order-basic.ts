import { Hook } from "@district-labs/intentify-utils";

export function generateHooksForLimitOrderBasic(chainId: number):Hook[] {
  // 1. Timestamp Intent == No Hook
  // 2. Token Release Intent == No Hook
  // 3. Limit Order Intent == Fill on Uniswap

  // TODO: Make magic happen with Uniswap V3 swaps
  return [
    {
      target: "0x",
      data: "0x",
    },
    {
      target: "0x",
      data: "0x",
    },
    {
      target: "0x",
      data: "0x",
    },
  ]
}