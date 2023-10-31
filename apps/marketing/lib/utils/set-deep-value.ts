/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
type NestedObject = {
  [key: string]: any
}

export function setDeepValue(
  obj: NestedObject,
  dotNotationPath: string,
  value: any
): any {
  const path = dotNotationPath.split(".")

  if (!path.length) {
    return value
  }

  const [currentKey, ...remainingPath] = path

  return {
    ...obj,
    [currentKey]: setDeepValue(
      obj[currentKey] || {},
      remainingPath.join("."),
      value
    ),
  }
}
