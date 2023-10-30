export function bigIntToDecimal(bigIntValue: bigint, decimalPlaces: number) {
  const stringValue = bigIntValue.toString()

  // Insert decimal point
  const integerPart = stringValue.slice(0, -decimalPlaces) || "0"
  const decimalPart = stringValue.slice(-decimalPlaces)

  // Combine integer and decimal parts
  const decimalValue = integerPart + "." + decimalPart

  return decimalValue
}
