import { ponder } from "@/generated";

ponder.on("IntentifySafeModule:IntentBatchExecuted",async ({context, event}) => {
    const { IntentBatch  } = context.entities;

    await IntentBatch.upsert({
      id: event.params.intentBatchId,
      create: {
        root: event.params.root,
        executor: event.params.executor,
        state: "EXECUTED",
      },
      update:{
        state: "EXECUTED",
        executor: event.params.executor,
      }
    })
})

ponder.on("IntentifySafeModule:IntentBatchCancelled",async ({context, event}) => {
  const { IntentBatch,  } = context.entities;

  await IntentBatch.upsert({
    id: event.params.intentBatchId,
    create: {
      root: event.params.root,
      state: "CANCELLED",
    },
    update:{
      state: "CANCELLED",
    }
  })
})