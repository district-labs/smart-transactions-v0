import express from "express";
import * as intentBatchesController from "../controllers/intent-batches";

const intentBatchesRouter = express.Router();

intentBatchesRouter.get("/", intentBatchesController.getIntentBatches);
intentBatchesRouter.get("/:id", intentBatchesController.getIntentBatch);

export { intentBatchesRouter };
