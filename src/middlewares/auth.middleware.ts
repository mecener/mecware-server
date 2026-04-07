import { NextFunction, Request, Response } from "express";
import { ApiError } from "../exceptions/api.error.js";
import tokenService from "../services/token.service.js";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
	try {
		let token = null;
		let userData = null;

		const authorizationHeader = req.headers.authorization;

		if (authorizationHeader) {
			token = authorizationHeader.split(" ")[1];
			userData = tokenService.validateAccessToken(token);
		}

		if (!token && req.cookies) {
			token = req.cookies.refreshToken;
			userData = tokenService.validateRefreshToken(token);
		}

		if (!token) {
			return next(ApiError.UnauthorizedError());
		}

		if (!userData) {
			return next(ApiError.UnauthorizedError());
		}

		res.locals.user = userData;
		next();
	} catch (error) {
		return next(ApiError.UnauthorizedError());
	}
}
