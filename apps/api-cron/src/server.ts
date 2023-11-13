import { jobSendAxiomQueryUniV3Goerli } from "./cron-jobs/axiom-query/send-axiom-query-uni-v3-goerli";
import { jobInvalidateIntents } from "./cron-jobs/intent-batches/invalidate-intent-batches";

jobInvalidateIntents.start();
jobSendAxiomQueryUniV3Goerli.start();
