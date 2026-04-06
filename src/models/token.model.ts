import { DataTypes, Model, Optional } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../config/database.js";
import User from "../models/user.model.js";
import { RequiredSome } from "../types.js";

export interface TokenAttributes {
	id: number;
	userId: number;
	refreshToken: string;
	accessToken?: string;
	expiresAt?: Date;
	userAgent?: string;
	ipAddress?: string;
	isRevoked: boolean;
	revokedAt?: Date;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface UserCreationAttributes extends RequiredSome<TokenAttributes, "userId" | "refreshToken"> {}

class Token extends Model<TokenAttributes, UserCreationAttributes> implements TokenAttributes {
	public id!: number;
	public userId!: number;
	public refreshToken!: string;
	public accessToken!: string;
	public expiresAt!: Date;
	public userAgent!: string;
	public ipAddress!: string;
	public isRevoked!: boolean;
	public revokedAt!: Date;
	public createdAt!: Date;
	public updatedAt!: Date;
}

Token.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: "id",
			},
			onDelete: "CASCADE",
		},
		refreshToken: {
			type: DataTypes.STRING(500),
			allowNull: false,
			unique: true,
		},
		accessToken: {
			type: DataTypes.STRING(500),
			allowNull: true,
		},
		expiresAt: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		userAgent: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		ipAddress: {
			type: DataTypes.STRING(45),
			allowNull: true,
		},
		isRevoked: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		revokedAt: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		sequelize,
		tableName: "tokens",
		timestamps: true,
		indexes: [
			{
				fields: ["userId"],
			},
			{
				fields: ["refreshToken"],
				unique: true,
			},
			{
				fields: ["expiresAt"],
			},
			{
				fields: ["isRevoked"],
			},
		],
	},
);

User.hasMany(Token, { foreignKey: "userId", as: "tokens" });
Token.belongsTo(User, { foreignKey: "userId", as: "user" });

export default Token;
