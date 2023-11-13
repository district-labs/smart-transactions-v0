import { eq } from "drizzle-orm";
import { db, strategies } from "../../..";

interface GetStrategyDbParams {
  strategyId: string;
  expandFields: string[];
}

export async function getStrategyDb({
  strategyId,
  expandFields,
}: GetStrategyDbParams) {
  const strategy = await db.query.strategies.findFirst({
    where: eq(strategies.id, strategyId),
    with: {
      manager: expandFields.includes("manager") ? true : undefined,
      intentBatches: expandFields.includes("intentBatches") ? true : undefined,
    },
  });

  return strategy;
}
