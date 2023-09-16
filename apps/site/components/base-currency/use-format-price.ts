"use client"

import { useBaseCurrency } from "./use-base-currency"
import { useBtcPrice, useEthPrice } from "./use-base-currency-price"

export function formatPrice(value: number) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: ethPrice } = useEthPrice()
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: btcPrice } = useBtcPrice()
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { baseCurrency } = useBaseCurrency()

  if (baseCurrency === "ETH") {
    const ethValue = ethPrice ? value / ethPrice : 0
    // decimals = 18
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: baseCurrency,
      minimumSignificantDigits: 2,
      maximumSignificantDigits: 2,
    }).format(ethValue)
  }

  if (baseCurrency === "BTC") {
    const btcValue = btcPrice ? value / btcPrice : 0
    // decimals = 18
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: baseCurrency,
      minimumSignificantDigits: 2,
      maximumSignificantDigits: 2,
    }).format(btcValue)
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    currency: "USD",
  }).format(value)
}
