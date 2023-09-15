import { z } from "zod"

export const getTokenChartDatSchema = z.object({
  chain: z.string(),
  tokenContract: z.string(),
  start: z.number().int(),
})
