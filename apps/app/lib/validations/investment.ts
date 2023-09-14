import { z } from "zod"

export const getInvestmentsAmountsSchema = z.object({
  userId: z.number(),
  amounts: z.number().optional(),
})
