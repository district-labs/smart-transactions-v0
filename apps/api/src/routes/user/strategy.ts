import { Router } from "express";
import * as strategiesUserController from "../../controllers/user/strategies";
const router = Router();
router.get("/", strategiesUserController.getStrategies);
router.get("/active", strategiesUserController.getStrategiesActive);
export default router;
