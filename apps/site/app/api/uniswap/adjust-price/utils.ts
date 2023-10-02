export const priceToSqrtPriceX96 = (price: number) => {
  const priceX96 = BigInt(price) * BigInt(2 ** 96)
  return sqrtBigInt(priceX96)
}

export const sqrtPriceX96ToPrice = (sqrtPriceX96: string) => {
  const sqrtPrice = BigInt(sqrtPriceX96) / BigInt(2 ** 96)
  return sqrtPrice ** BigInt(2)
}

function sqrtBigInt(n: bigint): bigint {
  if (n < BigInt(0)) {
    throw new Error("Cannot compute the square root of a negative number")
  }

  if (n < BigInt(2)) {
    return n
  }

  let x0: bigint = n
  let x1: bigint = (x0 + n / x0) >> BigInt(1) // Right shift by 1 to divide by 2

  while (x0 > x1) {
    x0 = x1
    x1 = (x0 + n / x0) >> BigInt(1)
  }

  return x0
}
