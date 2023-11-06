import type { DbIntentBatchWithRelations } from "@district-labs/intentify-database";
import type { IntentValidation } from "@district-labs/intentify-intent-batch";
import type { IntentBatch } from "@district-labs/intentify-core";
export type IntentBatchValidationStruct = {
  original: DbIntentBatchWithRelations;
  raw: IntentBatch;
  invalidations: Array<IntentValidation | undefined>;
};
