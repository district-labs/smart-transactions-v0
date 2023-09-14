import { strategies } from "@/db/schema"
import { z } from "zod"

export const strategySchema = z.object({
  name: z.string().min(3, {
    message: "Strategy name must be at least 3 characters.",
  }),
  description: z.string().optional(),
  category: z.enum(strategies.category.enumValues, {
    required_error: "Must be a valid category",
  }),
  assets: z.number(),
  performanceFee: z.number(),
  platformFee: z.number(),
})

export const filterStrategiesSchema = z.object({
  query: z.string(),
})

export const getStrategySchema = z.object({
  id: z.number(),
  managerId: z.number(),
})

export const getStrategyAssetsSchema = z.object({
  id: z.number(),
})

export const getStrategiesSchema = z.object({
  limit: z.number().default(10),
  offset: z.number().default(0),
  categories: z
    .string()
    .regex(/^\d+.\d+$/)
    .optional()
    .nullable(),
  sort: z
    .string()
    .regex(/^\w+.(asc|desc)$/)
    .optional()
    .nullable(),
  assets_range: z
    .string()
    .regex(/^\d+-\d+$/)
    .optional()
    .nullable(),
  manager_ids: z
    .string()
    .regex(/^\d+.\d+$/)
    .optional()
    .nullable(),
})
