import { Router } from "express";
import * as intentBatchInfraController from "../../controllers/infra/intent-batch";
const router = Router();
router.get("/invalidate", intentBatchInfraController.invalidateIntentBatches);
export default router;
