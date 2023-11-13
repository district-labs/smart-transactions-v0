import { db } from "../../..";

interface GetStrategiesDbParams {
  limit: string | undefined;
  offset: string | undefined;
  expandFields: string[];
}

export async function getStrategiesDb({
  expandFields,
  limit,
  offset,
}: GetStrategiesDbParams) {
  const strategies = await db.query.strategies.findMany({
    limit: Number(limit),
    offset: Number(offset),
    with: {
      manager: expandFields.includes("manager") ? true : undefined,
      intentBatches: expandFields.includes("intentBatches") ? true : undefined,
    },
  });

  return strategies;
}
