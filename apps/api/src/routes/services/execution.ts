import { Router } from "express";
import * as serviceExecutionController from "../../controllers/services/execution";
const router = Router();
router.post("/execution/bundle", serviceExecutionController.executionIntentBatchExecutionBundleDispatch);
router.post("/execution/single", serviceExecutionController.executionIntentBatchExecutionDispatch);
export default router;
