import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/signUp", userController.signUp);
authRouter.get("/activate/:link", userController.activateAccount);
authRouter.post("/signIn", userController.signIn);
authRouter.post("/signOut", userController.signOut);
authRouter.get("/refresh", userController.refresh);
authRouter.get("/users", authMiddleware, userController.getUsers);

export default authRouter;
