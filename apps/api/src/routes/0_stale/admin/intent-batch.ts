import { Router } from "express";
import * as intentBatchUserController from "../../../controllers/0_stale/admin/intent-batch";
const router = Router();
router.get("/", intentBatchUserController.getIntentBatches);
router.get("/:id", intentBatchUserController.getIntentBatchById);
export default router;
