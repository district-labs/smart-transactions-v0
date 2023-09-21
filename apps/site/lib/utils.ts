import { type CoinsInput } from "@/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"

import { toast } from "@/components/ui/use-toast"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(
  price: number | string,
  options: {
    currency?: "USD" | "EUR"
    notation?: Intl.NumberFormatOptions["notation"]
  } = {}
) {
  const { currency = "USD", notation = "compact" } = options

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation,
  }).format(Number(price))
}

export function formatNumber(
  number: number | string,
  options: {
    decimals?: number
    style?: Intl.NumberFormatOptions["style"]
    notation?: Intl.NumberFormatOptions["notation"]
  } = {}
) {
  const { decimals = 0, style = "decimal", notation = "standard" } = options

  return new Intl.NumberFormat("en-US", {
    style,
    notation,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number(number))
}

export function formatDate(date: number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date * 1000))
}

export function isMacOs() {
  if (typeof window === "undefined") return false

  return window.navigator.userAgent.includes("Mac")
}

export function toTitleCase(str: string | undefined) {
  if (!str) return ""
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  )
}

export function toSentenceCase(str: string) {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str
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

export const chainIdToName: Record<number, string> = {
  1: "ethereum",
  10: "optimism",
  137: "matic-network",
  42161: "arbitrum",
}

export const nameToChainId: Record<string, number> = {
  ethereum: 1,
  optimism: 10,
  "matic-network": 137,
  arbitrum: 42161,
}

export function formatCoinsInput(coinsInputList: CoinsInput[]) {
  return coinsInputList
    .map((coinsInput) => {
      if (coinsInput.type === "native") {
        return `coingecko:${chainIdToName[coinsInput.chainId]}`
      }
      return `${chainIdToName[coinsInput.chainId]}:${coinsInput.address}`
    })
    .join(",")
}

/**
 * Calculates the period for the chart
 */
export const calculatePeriod = (
  timeInterval: `${number}m` | `${number}h` | `${number}d` | `${number}y`,
  span: number
) => {
  if (!timeInterval) {
    return "0m" as const
  }

  // span = Number of data points
  let intervalMinutes: number
  if (timeInterval.includes("y")) {
    intervalMinutes = Number(timeInterval?.replace("y", "")) * 365 * 24 * 60
  } else if (timeInterval.includes("d")) {
    intervalMinutes = Number(timeInterval?.replace("d", "")) * 24 * 60
  } else if (timeInterval.includes("h")) {
    intervalMinutes = Number(timeInterval?.replace("h", "")) * 60
  } else if (timeInterval.includes("m")) {
    intervalMinutes = Number(timeInterval?.replace("m", ""))
  } else {
    intervalMinutes = Number(timeInterval)
  }

  // Number of days in the time interval
  const periodMinutes = Math.floor(intervalMinutes / (span - 1))

  return `${periodMinutes}m` as const
}

export function trimAddress(address: string, start = 4, end = 4) {
  return `${address.slice(0, start + 2)}...${address.slice(-end)}`
}
