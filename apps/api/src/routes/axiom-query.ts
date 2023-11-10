import express from "express";
import * as axiomQueryController from "../controllers/axiom-query";

const axiomQueryRouter = express.Router();

axiomQueryRouter.get("/", axiomQueryController.getAxiomQuery);
axiomQueryRouter.post("/", axiomQueryController.postAxiomQuery);

export { axiomQueryRouter };
