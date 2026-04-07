import { Op } from "sequelize";
import { ApiError } from "../exceptions/api.error.js";
import Scenario, { Contribution, DialogueLine } from "../models/scenario.model.js";
import User from "../models/user.model.js";

interface CreateScenarioDto {
	authorId: number;
	title: string;
	description?: string;
	content: { dialogues: DialogueLine[] };
}

class ScenarioService {
	async createScenario({ authorId, title, description, content }: CreateScenarioDto): Promise<Scenario> {
		if (!authorId) {
			throw ApiError.UnauthorizedError();
		}

		const scenario = await Scenario.create({
			authorId,
			title,
			description: description || "",
			content,
		});

		return scenario;
	}

	async getMyScenario(userId: number): Promise<{ my: Scenario[]; shared: Scenario[] }> {
		if (!userId) {
			throw ApiError.UnauthorizedError();
		}

		const myScenarios = await Scenario.findAll({ where: { authorId: userId } });
		const sharedScenarios = await Scenario.findAll({ where: { contributorIds: { [Op.contains]: [userId] } } });

		return { my: myScenarios, shared: sharedScenarios };
	}

	async addContribution(scenarioId: number, dialogueId: number, lineId: number, userId: number, contributionContent: string) {
		const scenario = await Scenario.findByPk(scenarioId);

		const dialogue = scenario?.content.dialogues.find((d) => d.id === dialogueId);

		const contentFragment = dialogue?.content[lineId];

		const user = await User.findByPk(userId);

		const newContribution: Contribution = {
			userId: userId,
			username: user?.username,
			content: contributionContent,
		};

		if (typeof contentFragment !== "string") {
			contentFragment?.contributions.push(newContribution);
			scenario?.changed("content", true);
			await scenario?.save();
		}

		const scenarios = await Scenario.findAll({ where: { authorId: userId } });

		return scenarios;
	}

	async changeSelectedContribution(
		scenarioId: number,
		dialogueId: number,
		lineId: number,
		userId: number,
		contributionId: number | "initial",
	) {
		const scenario = await Scenario.findByPk(scenarioId);

		const dialogue = scenario?.content.dialogues.find((d) => d.id === dialogueId);

		const contentFragment = dialogue?.content[lineId];

		if (contentFragment && typeof contentFragment !== "string") {
			contentFragment.selectedOption = contributionId;
			scenario?.changed("content", true);
			await scenario?.save();
		}

		const scenarios = await Scenario.findAll({ where: { authorId: userId } });

		return scenarios;
	}
}

export default new ScenarioService();
