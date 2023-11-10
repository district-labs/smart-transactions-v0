import {
  IntentBatchFactory,
  blockNumberRange,
  timestampRange,
} from "@district-labs/intentify-intent-batch";
import {
  goerliPublicClient,
  localPublicClient,
  mainnetPublicClient,
} from "../../../blockchain-clients";

export const intentBatchFactoryForValidation = new IntentBatchFactory(
  [timestampRange, blockNumberRange],
  {
    1: mainnetPublicClient,
    5: goerliPublicClient,
    31337: localPublicClient,
  },
);
