import { NextFunction, Request, Response } from "express";
import { ApiError } from "../exceptions/api.error.js";

export function errorMiddleware(error: Error | ApiError, req: Request, res: Response, next: NextFunction) {
	console.error(error);

	if (error instanceof ApiError) {
		return res.status(error.status).json({ message: error.message, errors: error.errors });
	}

	return res.status(500).json({ message: "Server error" });
}
