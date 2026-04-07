import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import router from "./router/index.js";
import { syncDatabase } from "./models/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(
	cors({
		origin: [
			"https://mecener.online",
			"https://www.mecener.online",
			"http://mecener.online",
			"http://www.mecener.online",
			"http://localhost:5173",
			"http://localhost:3000",
		],
		credentials: true,
	}),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.get("/health", (req, res) => {
	res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(errorMiddleware);

const initDatabase = async () => {
	try {
		await syncDatabase(false);
		console.log("Database ready.");
	} catch (error) {
		console.error("Database initialization failed:", error);
		process.exit(1);
	}
};

const bootstrap = async () => {
	try {
		initDatabase();

		app.listen(PORT, () => console.log("Server started on port:", PORT));
	} catch (error) {
		console.log(error);
	}
};

bootstrap();
