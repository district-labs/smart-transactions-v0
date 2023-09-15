import { z } from "zod"

export const getCoinMarketChartSchema = z.object({
  coinId: z.string(),
  currency: z.string().optional(),
  days: z.string(),
})