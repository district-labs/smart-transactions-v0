import {
  type DeFiLlamaCoinsInput,
  type GetTokenChartDataResponse,
} from "@/types"

import { CHAIN_ID_TO_NAME } from "../constants"

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

export function formatCoinsInput(coinsInputList: DeFiLlamaCoinsInput[]) {
  return coinsInputList
    .map((coinsInput) => {
      if (coinsInput.type === "native") {
        return `coingecko:${CHAIN_ID_TO_NAME[coinsInput.chainId]}`
      }
      return `${CHAIN_ID_TO_NAME[coinsInput.chainId]}:${coinsInput.address}`
    })
    .join(",")
}

export function formatChartData(
  data: GetTokenChartDataResponse,
  outToken: string,
  inToken?: string
) {
  const chartData: { time: string; price: number }[] = []

  const tokenOut = data.coins[outToken].prices
  const tokenIn = inToken
    ? data.coins[inToken].prices
    : new Array(tokenOut.length).fill({ price: 1 })

  for (let i = 0; i < tokenOut.length; i++) {
    const relativePrice = tokenOut[i].price / tokenIn[i].price
    const timestamp = formatDate(tokenOut[i].timestamp)

    chartData.push({ time: timestamp, price: relativePrice })
  }
  return chartData
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

export function trimAddress(address: string, start = 4, end = 4) {
  return `${address.slice(0, start + 2)}...${address.slice(-end)}`
}
