import { Router } from "express";
import scenarioContoller from "../controllers/scenario.contoller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const scenarioRouter = Router();

scenarioRouter.post("/create", authMiddleware, scenarioContoller.createScenario);
scenarioRouter.get("/my", authMiddleware, scenarioContoller.getMyScenario);
scenarioRouter.post("/addContribution", authMiddleware, scenarioContoller.addContribution);
scenarioRouter.post("/changeSelectedContribution", authMiddleware, scenarioContoller.changeSelectedContribution);

export default scenarioRouter;
