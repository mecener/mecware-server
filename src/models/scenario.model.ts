import { DataTypes, Model } from "sequelize";
import { RequiredSome } from "../types.js";
import User from "./user.model.js";
import sequelize from "../config/database.js";

export interface Contribution {
	userId?: number;
	username?: string;
	ai?: boolean;
	content: string;
}

export interface ContentSegment {
	initial: string;
	contributions: Contribution[];
	selectedOption: "initial" | number;
}

export type ContentItem = string | ContentSegment;

export interface DialogueLine {
	id: number;
	character: string;
	content: ContentItem[];
	timestamp: string;
}

export interface ScenarioContent {
	dialogues: DialogueLine[];
}

export interface ScenarioAttributes {
	id: number;
	authorId: number;
	title: string;
	description?: string;
	content: ScenarioContent;
	contributorIds?: number[];
	createdAt?: Date;
	updatedAt?: Date;
}

export interface ScenarioCreationAttributes extends RequiredSome<ScenarioAttributes, "authorId" | "title" | "content"> {}

class Scenario extends Model<ScenarioAttributes, ScenarioCreationAttributes> implements ScenarioAttributes {
	public id!: number;
	public authorId!: number;
	public title!: string;
	public description!: string;
	public content!: ScenarioContent;
	public contributorIds!: number[];
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Scenario.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		authorId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: "id",
			},
			onDelete: "CASCADE",
		},
		title: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		content: {
			type: DataTypes.JSONB,
			allowNull: false,
			defaultValue: { dialogues: [] },
			validate: {
				isValidContent(value: ScenarioContent) {
					if (!value || typeof value !== "object") {
						throw new Error("Content must be an object");
					}
					if (!Array.isArray(value.dialogues)) {
						throw new Error("Content must have dialogues array");
					}
				},
			},
		},
		contributorIds: {
			type: DataTypes.ARRAY(DataTypes.INTEGER),
			defaultValue: [],
		},
	},
	{
		sequelize,
		tableName: "scenarios",
		timestamps: true,
		indexes: [
			{
				fields: ["authorId"],
			},
			{ fields: ["contributorIds"], using: "gin" },
		],
	},
);

User.hasMany(Scenario, { foreignKey: "authorId", as: "scenarios" });
Scenario.belongsTo(User, { foreignKey: "authorId", as: "author" });

export default Scenario;
