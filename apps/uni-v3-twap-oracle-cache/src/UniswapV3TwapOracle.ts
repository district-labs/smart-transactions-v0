import { ponder } from "@/generated";

ponder.on("UniswapV3TwapOracle:ObservationStored", async ({event,context}) => {
  const {UniswapV3Pool} = context.entities

  await UniswapV3Pool.upsert({
    id: event.params.pool,
    create: {
      blocks: [
        Number(event.params.blockNumber)
      ]
    },
    update: ({current}) => ({
     blocks:  [...current.blocks, Number(event.params.blockNumber)]
    })
  })
})