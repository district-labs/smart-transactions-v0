import { z } from "zod"

const coinInputValidation = z.union([
  z.object({
    chainId: z.number(),
    type: z.enum(["native"]),
  }),
  z.object({
    chainId: z.number(),
    type: z.enum(["erc20"]),
    address: z.string(),
  }),
])

export const getTokenChartDataSchema = z.object({
  coins: z.union([coinInputValidation, z.array(coinInputValidation)]),
  searchWidth: z.string().optional(),
  timestamp: z
    .object({
      type: z.enum(["start", "end"]),
      value: z.number(),
    })
    .optional(),
  range: z.enum(["1d", "7d", "30d", "90d", "365d", "1095d"]),
})

export const getTokenCurrentPriceSchema = z.object({
  coins: z.union([coinInputValidation, z.array(coinInputValidation)]),
})
