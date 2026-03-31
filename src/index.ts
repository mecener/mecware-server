import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { syncDatabase } from "./models";

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.SERVER_PORT;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const initDatabase = async () => {
	try {
		await syncDatabase(false);
		console.log("Database ready");
	} catch (error) {
		console.error("Database initialization failed:", error);
		process.exit(1);
	}
};

app.get("/health", (req, res) => {
	res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const start = async () => {
	try {
		initDatabase();

		app.listen(PORT, () => console.log("Server is starting on port:", PORT));
	} catch (error) {
		console.log(error);
	}
};

start();
