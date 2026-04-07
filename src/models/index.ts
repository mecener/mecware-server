import sequelize from "../config/database.js";
import User from "./user.model.js";
import Token from "./token.model.js";
import Scenario from "./scenario.model.js";

export { sequelize, User, Token, Scenario };

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
