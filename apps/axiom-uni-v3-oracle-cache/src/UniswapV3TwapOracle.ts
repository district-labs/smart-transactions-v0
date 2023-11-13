import { ponder } from "@/generated";
import { goerliclient } from "./client";

ponder.on("UniswapV3TwapOracle:ObservationStored", async ({event,context}) => {
  const {UniswapV3Pool,BlockInfo } = context.entities

  const block = await goerliclient.getBlock({
    blockNumber: event.params.blockNumber
  })

  await UniswapV3Pool.upsert({
    id: event.params.pool,
  })

  await BlockInfo.create({
    id: Number(event.params.blockNumber),
    data: {
      blockNumber: Number(event.params.blockNumber),
      pool: event.params.pool,
      timestamp: Number(block.timestamp),
    }
  })


})