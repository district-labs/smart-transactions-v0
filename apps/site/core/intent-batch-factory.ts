import {
  erc20Transfer,
  IntentBatchFactory,
  intentModulesDefault,
} from "@district-labs/intentify-intent-batch"

export const intentBatchFactory = new IntentBatchFactory([
  ...intentModulesDefault,
])
