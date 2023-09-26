import JSBI from "jsbi"

function countDecimals(x: number) {
  if (Math.floor(x) === x) {
    return 0
  }
  return x.toString().split(".")[1].length || 0
}

export function fromReadableAmount(amount: number, decimals: number): JSBI {
  const extraDigits = Math.pow(10, countDecimals(amount))
  const adjustedAmount = amount * extraDigits
  // eslint-disable-next-line
  return JSBI.divide(
    // eslint-disable-next-line
    JSBI.multiply(
      // eslint-disable-next-line
      JSBI.BigInt(adjustedAmount),
      // eslint-disable-next-line
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))
    ),
    // eslint-disable-next-line
    JSBI.BigInt(extraDigits)
  )
}
