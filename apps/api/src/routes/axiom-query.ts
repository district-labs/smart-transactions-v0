import express from "express";
import * as axiomQueryController from "../controllers/axiom-query";

const axiomQueryRouter = express.Router();

axiomQueryRouter.post("/get-query", axiomQueryController.getAxiomQuery);
axiomQueryRouter.post("/send-query", axiomQueryController.postAxiomQuery);

export { axiomQueryRouter };
