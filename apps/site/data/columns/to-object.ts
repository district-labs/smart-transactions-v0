/* eslint-disable @typescript-eslint/no-unsafe-return */
export function toObject(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  )
}
