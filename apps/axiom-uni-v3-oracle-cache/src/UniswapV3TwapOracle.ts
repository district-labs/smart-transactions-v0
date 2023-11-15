import { ponder } from "@/generated";
import { goerliclient } from "./client";

ponder.on(
  "UniswapV3TwapOracle:ObservationStored",
  async ({ event, context }) => {
    const { UniswapV3Pool, BlockInfo } = context.entities;

    const block = await goerliclient.getBlock({
      blockNumber: event.params.blockNumber,
    });

    await UniswapV3Pool.upsert({
      id: event.params.pool,
    });

    await BlockInfo.upsert({
      id: `${Number(event.params.blockNumber)}-${event.params.pool}`,
      create: {
        blockNumber: Number(event.params.blockNumber),
        pool: event.params.pool,
        timestamp: Number(block.timestamp),
      },
      update: {
        blockNumber: Number(event.params.blockNumber),
        pool: event.params.pool,
        timestamp: Number(block.timestamp),
      },
    });
  },
);
