import sequelize from "../config/database";
import User from "./user.model";
import Token from "./token.model";

export { sequelize, User, Token };

export const syncDatabase = async (force: boolean = false) => {
	try {
		await sequelize.authenticate();
		console.log("Database connection established successfully.");

		await sequelize.sync({ force, alter: !force });
		console.log("Database synchronized successfully.");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
		throw error;
	}
};
