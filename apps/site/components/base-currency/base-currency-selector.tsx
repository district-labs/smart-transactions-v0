"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supportedCurrencies } from "@/components/base-currency/base-currency-context"

import { useBaseCurrency } from "./use-base-currency"

export function BaseCurrencySelector() {
  const { baseCurrency, setBaseCurrency } = useBaseCurrency()

  return (
    <Select defaultValue={baseCurrency} onValueChange={setBaseCurrency}>
      <SelectTrigger className="w-20">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="w-20">
        {supportedCurrencies.map((currency) => (
          <SelectItem key={currency.code} value={currency.code}>
            {currency.code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
