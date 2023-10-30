import { Router } from "express";
import * as serviceEventsController from "../../controllers/services/events";
const router = Router();
router.post("/events/cancelled", serviceEventsController.eventIntentBatchCancelled);
router.post("/events/executed", serviceEventsController.eventIntentBatchExecuted);
export default router;
