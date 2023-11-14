import { CronJob } from "cron";
import "dotenv/config";
import { invalidateIntentBatches } from "../../actions/intent-batches/invalidate-intent-batches";

/**
 * Cron job to invalidate intents every 5 minutes
 */
export const jobInvalidateIntents = new CronJob(
  "0 */5 * * * *", // cronTime
  async function () {
    console.log("Invalidating intents");
    await invalidateIntentBatches();
  }, // onTick
  null, // onComplete
  true, // start
  "America/Los_Angeles", // timeZone
);
