import { NextFunction, Request, Response } from "express";
import userService from "../services/user.service.js";
import dotenv from "dotenv";
import { parseTimeToMs } from "../utils/time.util.js";
import tokenService from "../services/token.service.js";
import { ApiError } from "../exceptions/api.error.js";

dotenv.config();

const JWT_REFRESH_TIME = process.env.JWT_REFRESH_TIME || "14d";

class UserController {
	async signUp(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, username, password } = req.body;

			const userData = await userService.signUp(email, username, password);

			res.cookie("refreshToken", userData.refreshToken, {
				maxAge: parseTimeToMs(JWT_REFRESH_TIME),
				httpOnly: true,
				secure: true,
			});

			return res.json(userData);
		} catch (error: any) {
			next(error);
		}
	}
	async activateAccount(req: Request, res: Response, next: NextFunction) {
		try {
			const activationLink = req.params.link;

			await userService.activateAccount(typeof activationLink === "string" ? activationLink : activationLink[0]);

			return res.redirect("https://mecener.online/mecware/project-manager");
		} catch (error: any) {
			next(error);
		}
	}
	async signIn(req: Request, res: Response, next: NextFunction) {
		try {
			const { login, password } = req.body;

			const userData = await userService.signIn(login, password);

			res.cookie("refreshToken", userData.refreshToken, {
				maxAge: parseTimeToMs(JWT_REFRESH_TIME),
				httpOnly: true,
				secure: true,
			});

			return res.json(userData);
		} catch (error: any) {
			next(error);
		}
	}
	async checkUser(req: Request, res: Response, next: NextFunction) {
		try {
			const { token } = req.body;

			const userData = tokenService.validateAccessToken(token);

			if (userData) {
				res.status(200).json({ status: "ok" });
			}

			res.json(ApiError.UnauthorizedError());
		} catch (error: any) {
			next(error);
		}
	}
	async signOut(req: Request, res: Response, next: NextFunction) {
		try {
			const { refreshToken } = req.cookies;

			const token = await userService.signOut(refreshToken);

			res.clearCookie("refreshToken");

			return res.json(token);
		} catch (error: any) {
			next(error);
		}
	}
	async refresh(req: Request, res: Response, next: NextFunction) {
		try {
			const { refreshToken } = req.cookies;

			const userData = await userService.refresh(refreshToken);

			res.cookie("refreshToken", userData.refreshToken, {
				maxAge: parseTimeToMs(JWT_REFRESH_TIME),
				httpOnly: true,
				secure: true,
			});

			return res.json(userData);
		} catch (error: any) {
			next(error);
		}
	}
	async getUsers(req: Request, res: Response, next: NextFunction) {
		try {
			const users = await userService.getAllUsers();

			return res.json(users);
		} catch (error: any) {
			next(error);
		}
	}
}

export default new UserController();
