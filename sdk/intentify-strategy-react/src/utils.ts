import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertDateStringToEpoch(datetime: string) {
  const date = new Date(datetime)
  return Math.floor(date.getTime() / 1000)
}

export function decimalToBigInt(decimal: number, decimalPlaces: number) {
  // Multiply by 10^decimalPlaces and round to handle floating-point inaccuracies
  const integer = Math.round(decimal * Math.pow(10, decimalPlaces))

  // Convert to BigInt
  return BigInt(integer)
}

export function deepMerge(obj1: any, obj2: any) {
  // Create a new object to avoid modifying the original objects
  let result = Object.assign({}, obj1)

  for (let key in obj2) {
    // If key is an object in both obj1 and obj2, merge them
    if (isObject(obj1[key]) && isObject(obj2[key])) {
      result[key] = deepMerge(obj1[key], obj2[key])
    } else {
      // Otherwise, use the value from obj2
      result[key] = obj2[key]
    }
  }

  return result
}

function isObject(item: any) {
  return item && typeof item === "object" && !Array.isArray(item)
}
