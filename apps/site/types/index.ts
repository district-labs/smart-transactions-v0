import { type Strategy } from "@/db/schema"
import type { Address } from "viem"

import { type Icons } from "@/components/icons"

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
  label?: string
  description?: string
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[]
}

export type MainNavItem = NavItemWithOptionalChildren

export interface DataTableSearchableColumn<TData> {
  id: keyof TData
  title: string
}

export interface DataTableFilterableColumn<TData>
  extends DataTableSearchableColumn<TData> {
  options: Option[]
}

export interface Category {
  title: Strategy["category"]
  icon: React.ComponentType<{ className?: string }>
}

export interface Option {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

/**
 * Period representation of DefiLlama API
 * "w" = "week"
 * "d" = "day"
 * "h" = "hour"
 * "m" = "minute"
 * @example "1w" | "1d" | "1h" | "1m"
 */
export type Period = `${number}${"w" | "d" | "h" | "m"}`

export type CoinsInput =
  | {
      chainId: number
      type: "native"
    }
  | {
      chainId: number
      type: "erc20"
      address: string
    }

export type PriceResponse = {
  price: number
  symbol: string
  timestamp: number
  decimals?: number
  confidence: number
}

export interface Token {
  name: string
  address: Address
  symbol: string
  decimals: number
  chainId: number
  logoURI: string
  tags?: string[]
  extensions?: {
    bridgeInfo?:
      | {
          [key: string]:
            | {
                tokenAddress: string
              }
            | undefined
        }
      | undefined
  }
}

export interface TokenList {
  name: string
  logoURI: string
  keywords: string[]
  tags: {
    [key: string]: {
      name: string
      description: string
    }
  }
  timestamp: string
  tokens: Token[]
  version: {
    major: number
    minor: number
    patch: number
  }
}
