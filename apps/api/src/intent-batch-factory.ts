import {
  IntentBatchFactory,
  intentModulesDefault,
} from "@district-labs/intentify-intent-batch";
import {
  goerliPublicClient,
  localPublicClient,
  mainnetPublicClient,
} from "./blockchain-clients";

export const intentBatchFactory = new IntentBatchFactory(intentModulesDefault, {
  1: mainnetPublicClient,
  5: goerliPublicClient,
  31337: localPublicClient,
});
