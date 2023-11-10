import { Router } from "express";
import * as intentBatchUserController from "../../../controllers/0_stale/user/intent-batch";

const router = Router();

// Define user routes
router.get("/", intentBatchUserController.getIntentBatches);
router.get("/:id", intentBatchUserController.getIntentBatchById);
router.post("/", intentBatchUserController.createIntentBatch);

export default router;
