import { Router } from "express";
import * as intentBatchUserController from "../controllers/auth";
const router = Router();
router.get("/nonce", intentBatchUserController.authSiweNonce);
router.post("/sign-in", intentBatchUserController.authSiweSignIn);
router.get("/sign-out", intentBatchUserController.authSiweSignOut);
export default router;
