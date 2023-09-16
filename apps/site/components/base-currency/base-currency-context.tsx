"use client"

import { createContext, useState, type ReactNode } from "react"

export const supportedCurrencies = [
  {
    name: "US Dollar",
    symbol: "$",
    symbolBefore: true,
    code: "USD",
  },
  {
    name: "Ether",
    symbol: "ETH",
    symbolBefore: false,
    code: "ETH",
  },
  {
    name: "Bitcoin",
    symbol: "BTC",
    symbolBefore: false,
    code: "BTC",
  },
] as const

type SupportedBaseCurrency = (typeof supportedCurrencies)[number]["code"]

export const BaseCurrencyContext = createContext<{
  baseCurrency: SupportedBaseCurrency
  setBaseCurrency: (currency: SupportedBaseCurrency) => void
}>({
  baseCurrency: "USD" as const,
  setBaseCurrency: () => null,
})

export const BaseCurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [baseCurrency, setBaseCurrency] = useState<SupportedBaseCurrency>(
    supportedCurrencies[0].code
  )

  return (
    <BaseCurrencyContext.Provider
      value={{
        baseCurrency,
        setBaseCurrency,
      }}
    >
      {children}
    </BaseCurrencyContext.Provider>
  )
}
