import { db, eq } from "@district-labs/intentify-database";

export const getStrategiesActiveFromDB = async (
  root: string,
): Promise<
  {
    id: string;
    name: string;
    alias: string;
    description: string;
    managerId: string;
    manager: {
      address: string;
      firstName: string;
      lastName: string;
    };
    countTotal: number;
    countPending: number;
    countCancelled: number;
    countExecuted: number;
  }[]
> => {
  const strategies = await db.query.strategies.findMany({
    with: {
      manager: {
        columns: {
          address: true,
          firstName: true,
          lastName: true,
        },
      },
      intentBatches: {
        where: (intentBatch: any) => eq(intentBatch.root, root),
        columns: {
          intentBatchHash: true,
          executedAt: true,
          cancelledAt: true,
        },
      },
    },
  });


  return strategies
    .filter((strategy: any) => {
      return strategy.intentBatches.length > 0;
    })
    .map((strategy: any) => {
      return {
        id: strategy.id,
        name: strategy.name,
        alias: strategy.alias,
        description: strategy.description,
        managerId: strategy.managerId,
        manager: strategy.manager,
        countTotal: strategy.intentBatches.length,
        countPending: strategy.intentBatches.filter(
          (intentBatch: any) =>
            !intentBatch.executedAt && !intentBatch.cancelledAt,
        ).length,
        countCancelled: strategy.intentBatches.filter(
          (intentBatch: any) => intentBatch.cancelledAt,
        ).length,
        countExecuted: strategy.intentBatches.filter(
          (intentBatch: any) => intentBatch.executedAt,
        ).length,
      };
    });
};
