import { Router } from "express";
import * as serviceEngineController from "../../controllers/services/engine";
const router = Router();
router.get("/engine", serviceEngineController.engineCalculateAndDispatch);
export default router;
