import express from "express";
import * as usersController from "../controllers/users";

const usersRouter = express.Router();

usersRouter.get("/", usersController.getUsers);
usersRouter.get("/:address", usersController.getUser);
usersRouter.post("/", usersController.postUser);
usersRouter.put("/", usersController.putUser);
usersRouter.delete("/:address", usersController.deleteUser);

export { usersRouter };
