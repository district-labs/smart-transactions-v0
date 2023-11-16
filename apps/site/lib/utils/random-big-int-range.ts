export function randomBigIntInRange(min: bigint, max: bigint): bigint {
  // Generate a random floating-point number between 0 and 1
  const randomFloat = Math.random()

  // Scale and shift the number to the desired range (min to max)
  // Note: Since BigInt can't handle fractions, we first do the calculation in Number
  // and then convert to BigInt
  const range = Number(max - min)
  const scaled = Math.floor(randomFloat * range) + Number(min)

  // Convert the result to BigInt
  return BigInt(scaled)
}
