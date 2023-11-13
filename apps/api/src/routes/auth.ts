import express from "express";
import * as authController from "../controllers/auth";

const authRouter = express.Router();

authRouter.get("/user", authController.getAuthUser);
authRouter.get("/nonce", authController.getAuthNonce);
authRouter.post("/session", authController.postAuthSession);
authRouter.delete("/session", authController.deleteAuthSession);

export { authRouter };
