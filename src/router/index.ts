import { Router } from "express";
import authRouter from "./auth.router.js";
import scenarioRouter from "./scenario.router.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/scenario", scenarioRouter);

export default router;
