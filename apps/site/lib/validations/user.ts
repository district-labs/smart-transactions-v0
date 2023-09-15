import { z } from "zod"

export const userSchema = z.object({
  firstName: z.string().min(1, {
    message: "Must contain at least 1 character.",
  }),
  lastName: z.string().min(1, {
    message: "Must contain at least 1 character.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  about: z.string().optional(),
})

export const getUserSchema = z.object({
  id: z.number(),
  address: z.string(),
})
