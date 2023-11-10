import { Router } from "express";
import * as strategiesUserController from "../../../controllers/0_stale/user/profile";
const router = Router();
router.get("/", strategiesUserController.userProfileIsSignedIn);
router.get("/profile", strategiesUserController.userProfileGet);
router.post("/profile", strategiesUserController.userProfileUpdate);
router.post("/register", strategiesUserController.userProfileRegister);
router.post(
  "/email-preferences",
  strategiesUserController.userEmailPreferencesUpdate,
);
export default router;
