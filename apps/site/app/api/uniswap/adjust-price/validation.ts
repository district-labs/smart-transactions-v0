import { z } from "zod"

export const Univ3AdjustPriceSchema = z.object({
  chainId: z.number(),
  token0: z.string(),
  token1: z.string(),
  targetPrice: z.number(),
  poolFee: z.number(),
})
