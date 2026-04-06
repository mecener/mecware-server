import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import router from "./router/index";
import { syncDatabase } from "./models";
import { errorMiddleware } from "./middlewares/error.middleware";
import tokenService from "./services/token.service";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

app.use("/auth", router);

app.get("/health", (req, res) => {
	res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const bootstrap = async () => {
	try {
		initDatabase();

		app.listen(PORT, () => console.log("Server started on port:", PORT));
	} catch (error) {
		console.log(error);
	}
};

bootstrap();
