import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const database = {
	name: process.env.DB_NAME || "mecware_db",
	user: process.env.DB_USER || "mecener",
	password: process.env.DB_PASSWORD || "yiyoOlv",
	host: process.env.DB_HOST || "localhost",
	port: Number(process.env.DB_PORT) || 5433,
};

const sequelize = new Sequelize(database.name, database.user, database.password, {
	host: database.host,
	port: database.port,
	dialect: "postgres",
	logging: false,
});

export default sequelize;
