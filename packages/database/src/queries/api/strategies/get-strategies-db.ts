import { and, eq } from "drizzle-orm";
import { db, intentBatch } from "../../..";


interface GetStrategiesDbParams {
  limit?: string;
  offset?: string;
  intentBatchRoot?: string;
  expandFields: string[];
}

export async function getStrategiesDb({
  expandFields,
  intentBatchRoot,
  limit,
  offset,
}: GetStrategiesDbParams) {

    const intentBatchFilters: any[] = []

    if(intentBatchRoot) {
      intentBatchFilters.push(eq(intentBatch.root, intentBatchRoot))
    }

  const strategiesData = await db.query.strategies.findMany({
    limit: Number(limit),
    offset: Number(offset),
    with: {
      manager: expandFields.includes("manager") ? true : undefined,
      intentBatches: expandFields.includes("intentBatches") ? {
        where: intentBatchFilters.length > 0 ? () => and(...intentBatchFilters) : undefined,
      } : undefined,
    },
  });

  return strategiesData;
}
