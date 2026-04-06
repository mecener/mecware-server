import { Router } from "express";
import userController from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/signUp", userController.signUp);
router.get("/activate/:link", userController.activateAccount);
router.post("/signIn", userController.signIn);
router.post("/signOut", userController.signOut);
router.get("/refresh", userController.refresh);
router.get("/users", authMiddleware, userController.getUsers);

export default router;
