import express from "express";
import * as emailPreferencesController from "../controllers/email-preferences";

const emailPreferencesRouter = express.Router();

emailPreferencesRouter.put("/", emailPreferencesController.putEmailPreferences);

export { emailPreferencesRouter };
