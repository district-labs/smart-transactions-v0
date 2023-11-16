import express from "express";
import * as strategiesController from "../controllers/strategies";

const strategiesRouter = express.Router();

strategiesRouter.get("/", strategiesController.getStrategies);
strategiesRouter.get("/:id", strategiesController.getStrategy);

export { strategiesRouter };
