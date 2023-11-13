import { DbInserIntentBatch, db, intentBatch } from "../../..";

export async function postIntentBatchDb(intentBatchData: DbInserIntentBatch) {
  
  const insertedIntentBatch = await db
    .insert(intentBatch)
    .values(intentBatchData);
  return insertedIntentBatch;
}
