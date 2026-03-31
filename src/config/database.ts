import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const dbName = process.env.DB_NAME || "mecware_db";
const dbUser = process.env.DB_USER || "mecener";
const dbPass = process.env.DB_PASSWORD;

console.log(dbName, dbUser, dbPass, process.env.DB_HOST, process.env.DB_PORT);

const sequelize = new Sequelize(dbName, dbUser, dbPass, {
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	dialect: "postgres",
	logging: false,
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
});

export default sequelize;
