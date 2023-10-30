import { Router } from "express";
import * as intentBatchUserController from "../../controllers/admin/intent-batch";
const router = Router();
router.get("/", intentBatchUserController.getIntentBatches);
router.get("/:id", intentBatchUserController.getIntentBatchById);
export default router;
