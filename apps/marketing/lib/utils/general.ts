import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"

import { toast } from "@/components/ui/use-toast"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isMacOs() {
  if (typeof window === "undefined") return false

  return window.navigator.userAgent.includes("Mac")
}

export function catchError(err: unknown) {
  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message
    })
    return toast({ description: errors.join("\n") })
  } else if (err instanceof Error) {
    return toast({ description: err.message })
  } else {
    return toast({
      description: "Something went wrong, please try again later.",
    })
  }
}
