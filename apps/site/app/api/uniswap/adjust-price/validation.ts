import { z } from "zod"

export const Univ3AdjustPriceSchema = z.object({
  chainId: z.number(),
  token0: z.string(),
  token1: z.string(),
  randomTargetPrice: z.boolean().optional(),
  targetPrice: z.number().optional(),
  poolFee: z.number(),
})
