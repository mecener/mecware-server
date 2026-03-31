import { DataTypes, Model, Optional } from "sequelize";
import bcrypt from "bcryptjs";
import sequelize from "../config/database";

export interface UserAttributes {
	id: number;
	email: string;
	username: string;
	password: string;
	firstName?: string;
	lastName?: string;
	isActive: boolean;
	isActivated: boolean;
	activationLink: string;
	role: "user" | "admin" | "moderator";
	lastActivity?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, "id" | "isActive" | "role"> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
	public id!: number;
	public email!: string;
	public username!: string;
	public password!: string;
	public firstName!: string;
	public lastName!: string;
	public isActive!: boolean;
	public isActivated!: boolean;
	public activationLink!: string;
	public role!: "user" | "admin" | "moderator";
	public readonly lastActivity!: Date;

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
		isActive: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		role: {
			type: DataTypes.ENUM("user", "admin", "moderator"),
			defaultValue: "user",
		},
		isActivated: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		activationLink: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "users",
		hooks: {
			beforeCreate: async (user: User) => {
				if (user.password) {
					const salt = await bcrypt.genSalt(10);

					user.password = await bcrypt.hash(user.password, salt);
				}
			},
			beforeUpdate: async (user: User) => {
				if (user.changed("password")) {
					const salt = await bcrypt.genSalt(10);

					user.password = await bcrypt.hash(user.password, salt);
				}
			},
		},
	},
);

export default User;
