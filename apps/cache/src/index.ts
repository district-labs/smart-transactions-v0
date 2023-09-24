import { ponder } from "@/generated";


// ----------------------------
// Testnet
// ----------------------------

ponder.on("IntentifySafeModuleTestnet:IntentBatchExecuted",async ({context, event}) => {
    const { IntentBatch  } = context.entities;

    await IntentBatch.upsert({
      id: event.params.intentBatchId,
      create: {
        chainId: 31337,
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

ponder.on("IntentifySafeModuleTestnet:IntentBatchCancelled",async ({context, event}) => {
  const { IntentBatch } = context.entities;

  await IntentBatch.upsert({
    id: event.params.intentBatchId,
    create: {
        chainId: 31337,
        root: event.params.root,
        state: "CANCELLED",
    },
    update:{
      state: "CANCELLED",
    }
  })
})

// ----------------------------
// Goerli
// ----------------------------

ponder.on("IntentifySafeModuleGoerli:IntentBatchExecuted",async ({context, event}) => {
    const { IntentBatch  } = context.entities;

    await IntentBatch.upsert({
      id: event.params.intentBatchId,
      create: {
        chainId: 5,
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

ponder.on("IntentifySafeModuleGoerli:IntentBatchCancelled",async ({context, event}) => {
  const { IntentBatch } = context.entities;

  await IntentBatch.upsert({
    id: event.params.intentBatchId,
    create: {
        chainId: 5,
        root: event.params.root,
        state: "CANCELLED",
    },
    update:{
      state: "CANCELLED",
    }
  })
})