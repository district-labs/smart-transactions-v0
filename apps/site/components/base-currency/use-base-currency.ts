import { useContext } from "react"

import { BaseCurrencyContext } from "./base-currency-context"

export function useBaseCurrency() {
  const context = useContext(BaseCurrencyContext)

  if (!context) {
    throw new Error(
      "useBaseCurrency must be used within a BaseCurrencyProvider"
    )
  }
  return context
}
