// convert the list to an object with name as keys and value as values
export function intentArgsToObj(
  args: {
    name: string
    type: string
    value: string | number
  }[]
) {
  const obj: Record<string, string | number> = {}

  for (const item of args) {
    obj[item.name] = item.value
  }

  return obj
}
