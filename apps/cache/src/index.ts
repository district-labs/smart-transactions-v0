import { ponder } from "@/generated";
import { dispatchIntentExecution } from "./dispatch-intent-execution";
import { dispatchIntentCancelled } from "./dispatch-intent-cancelled";

// ----------------------------
// Testnet
// ----------------------------
ponder.on("IntentifySafeModuleTestnet:IntentBatchExecuted",async ({context, event}) => {
    const { IntentBatch  } = context.entities;
    // Dispatch a message to the API to notify that the intent batch has been executed 
    await dispatchIntentExecution(5, event.params.intentBatchId, event.transaction.hash)
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
  // Dispatch a message to the API to notify that the intent batch has been cancelled
  await dispatchIntentCancelled(31337, event.params.intentBatchId, event.transaction.hash)
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