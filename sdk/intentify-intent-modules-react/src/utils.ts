import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getValueFromPath(obj: any, pathArray: string[]) {
  return pathArray.reduce(
    (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
    obj
  )
}

export function setValueFromPath(obj: any, pathArray: string[], value: any) {
  let current = obj
  for (let i = 0; i < pathArray.length - 1; i++) {
    const key = pathArray[i]
    if (!current[key]) {
      current[key] = {}
    }
    current = current[key]
  }
  current[pathArray[pathArray.length - 1]] = value
}
