import { Router } from "express";
import * as intentBatchInfraController from "../../../controllers/0_stale/infra/intent-batch";
const router = Router();
router.get(
  "/intents/invalidate",
  intentBatchInfraController.invalidateIntentBatches,
);
export default router;
