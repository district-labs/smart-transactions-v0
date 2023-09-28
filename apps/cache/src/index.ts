import { ponder } from "@/generated";
import { dispatchIntentCancelled } from "./dispatch-intent-cancelled";
import { dispatchIntentExecution } from "./dispatch-intent-execution";

// ----------------------------
// Local
// ----------------------------
if(process.env.npm_lifecycle_event === "dev"){
ponder.on("IntentifySafeModuleLocal:IntentBatchExecuted",async ({context, event}) => {
    const { IntentBatch  } = context.entities;
    // Dispatch a message to the API to notify that the intent batch has been executed 
    console.log(event.params.intentBatchId)
    await dispatchIntentExecution(31337, event.params.intentBatchId, event.transaction.hash)
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

ponder.on("IntentifySafeModuleLocal:IntentBatchCancelled",async ({context, event}) => {
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
}


// ----------------------------
// Goerli
// ----------------------------

ponder.on("IntentifySafeModuleGoerli:IntentBatchExecuted",async ({context, event}) => {
    const { IntentBatch  } = context.entities;
    await dispatchIntentExecution(5, event.params.intentBatchId, event.transaction.hash)
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
  await dispatchIntentCancelled(5, event.params.intentBatchId, event.transaction.hash)
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