import { type z } from "zod"

import { type newLimitOrderSchema } from "@/lib/validations/limit-order"

export type NewLimitOrder = z.infer<typeof newLimitOrderSchema>
