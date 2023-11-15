import { DbInserIntentBatch, DbInsertIntent, db, intentBatch, intents } from "../../..";

interface PostIntentBatchDbParams {
  intentBatch: DbInserIntentBatch;
  intents: DbInsertIntent[];
}

export async function postIntentBatchDb({
  intentBatch: intentBatchData,
  intents: intentsData
}: PostIntentBatchDbParams) {

  db.transaction(async (tx) => {
    await tx.insert(intentBatch).values(intentBatchData);
    await tx.insert(intents).values(intentsData);
  })
  
  return { ok: true };
}
