import { z } from "zod";

export function getExpandFieldsSchema(expandFields: string[]) {
  return z
    .union([
      z.string().refine((value) => expandFields.includes(value)),
      z
        .array(z.string())
        .refine((value) =>
          value.every((value) => expandFields.includes(value)),
        ),
    ])
    .optional();
}

export function getExpandFields(expand: string | string[] | undefined) {
  const expandFields: string[] = [];

  if (typeof expand === "string") {
    expandFields.push(expand);
  }

  if (Array.isArray(expand)) {
    expandFields.push(...expand);
  }

  return expandFields;
}
