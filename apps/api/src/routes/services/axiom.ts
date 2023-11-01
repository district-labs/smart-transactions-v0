import { Router } from "express";
import * as serviceAxiomController from "../../controllers/services/axiom";
const router = Router();
router.post("/axiom/send-query", serviceAxiomController.axiomSendQuery);
router.post("/axiom/get-query-result", serviceAxiomController.getQueryResult);
export default router;
