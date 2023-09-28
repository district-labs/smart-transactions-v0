import {
  char
} from "drizzle-orm/mysql-core"

export function charAddress (name: string) {
  return char(name, { length: 42 })
}

export function charHash (name: string) {
  return char(name, { length: 66 })
}