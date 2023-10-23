import { Router } from "express";
import * as intentBatchController from "../controllers/intent-batch";

const router = Router();

// Define user routes
router.get("/", intentBatchController.getIntentBatches);
router.get("/:id", intentBatchController.getIntentBatchById);
router.post("/", intentBatchController.createIntentBatch);

export default router;
