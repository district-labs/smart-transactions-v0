import { CronJob } from "cron";
import "dotenv/config";
import { sendAxiomQueryUniV3Goerli } from "../../actions/axiom-query/send-axiom-query-uni-v3-goerli";

/**
 * Cron job to Send Axiom queries every 5 minutes
 */
export const jobSendAxiomQueryUniV3Goerli = new CronJob(
  "0 */5 * * * *", // cronTime
  async function () {
    console.log("Sending Axiom queries");
    await sendAxiomQueryUniV3Goerli();
  }, // onTick
  null, // onComplete
  true, // start
  "America/Los_Angeles", // timeZone
);
