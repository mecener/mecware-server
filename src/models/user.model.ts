import { DataTypes, Model, Optional } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../config/database.js";
import { RequiredSome } from "../types.js";

export interface UserAttributes {
	id: number;
	email: string;
	username: string;
	password: string;
	firstName?: string;
	lastName?: string;
	online: boolean;
	isActivated: boolean;
	activationLink: string;
	role: "user" | "admin" | "moderator";
	lastActivity?: Date;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface UserCreationAttributes extends RequiredSome<UserAttributes, "email" | "username" | "password"> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
	public id!: number;
	public email!: string;
	public username!: string;
	public password!: string;
	public firstName!: string;
	public lastName!: string;
	public online!: boolean;
	public isActivated!: boolean;
	public activationLink!: string;
	public role!: "user" | "admin" | "moderator";
	public lastActivity!: Date;

	public async comparePassword(candidatePassword: string): Promise<boolean> {
		return bcrypt.compare(candidatePassword, this.password);
	}
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		email: {
			type: DataTypes.STRING(100),
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
			},
		},
		username: {
			type: DataTypes.STRING(50),
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		firstName: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		lastName: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		online: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		isActivated: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		activationLink: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		role: {
			type: DataTypes.ENUM("user", "admin", "moderator"),
			defaultValue: "user",
		},
	},
	{
		sequelize,
		tableName: "users",
	},
);

export default User;
