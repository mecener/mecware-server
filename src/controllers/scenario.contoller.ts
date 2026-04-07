import { NextFunction, Request, Response } from "express";
import { ApiError } from "../exceptions/api.error.js";
import scenarioService from "../services/scenario.service.js";

class ScenarioController {
	async createScenario(req: Request, res: Response, next: NextFunction) {
		try {
			const { userId, title, content, description } = req.body;

			const scenario = await scenarioService.createScenario({
				authorId: userId,
				title,
				description,
				content,
			});

			res.status(201).json({
				success: true,
				data: scenario,
				message: "Scenario successfully created.",
			});
		} catch (error: any) {
			next(error);
		}
	}

	async getMyScenario(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = res.locals.user.id;

			const data = await scenarioService.getMyScenario(userId);

			res.status(201).json({
				success: true,
				data,
				message: `Successfully getted scenarios by ${userId} user`,
			});
		} catch (error: any) {
			next(error);
		}
	}

	async addContribution(req: Request, res: Response, next: NextFunction) {
		try {
			const { scenarioId, dialogueId, lineId, userId, contributionContent } = req.body;

			const data = await scenarioService.addContribution(scenarioId, dialogueId, lineId, userId, contributionContent);

			res.status(201).json({
				success: true,
				data,
				message: `Successfully created contribution`,
			});
		} catch (error: any) {
			next(error);
		}
	}

	async changeSelectedContribution(req: Request, res: Response, next: NextFunction) {
		try {
			const { scenarioId, dialogueId, lineId, userId, contributionId } = req.body;

			const data = await scenarioService.changeSelectedContribution(scenarioId, dialogueId, lineId, userId, contributionId);

			res.status(201).json({
				success: true,
				data,
				message: `Successfully created contribution`,
			});
		} catch (error: any) {
			next(error);
		}
	}
}

export default new ScenarioController();
