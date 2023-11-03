import {
  IntentBatchFactory,
  intentModulesDefault,
  erc20Transfer
} from "@district-labs/intentify-intent-batch"
export const intentBatchFactory = new IntentBatchFactory([...intentModulesDefault])
