import jwt, { SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";

import { Token } from "../models/index.js";

dotenv.config();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "secret";
const JWT_ACCESS_TIME = process.env.JWT_ACCESS_TIME || "15m";
const JWT_REFRESH_TIME = process.env.JWT_REFRESH_TIME || "14d";

class TokenService {
	generateTokens(payload: Object) {
		const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_TIME } as SignOptions);
		const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_TIME } as SignOptions);

		return { accessToken, refreshToken };
	}

	validateAccessToken(token: string) {
		try {
			const userData = jwt.verify(token, JWT_ACCESS_SECRET);

			return userData;
		} catch (error: any) {
			return null;
		}
	}

	validateRefreshToken(token: string) {
		try {
			const userData = jwt.verify(token, JWT_REFRESH_SECRET);

			return userData;
		} catch (error: any) {
			return null;
		}
	}

	async saveToken(userId: number, refreshToken: string) {
		const tokenData = await Token.findOne({ where: { userId } });

		if (tokenData) {
			tokenData.refreshToken = refreshToken;

			return tokenData.save();
		}

		const token = await Token.create({ userId, refreshToken });

		return token;
	}

	async removeToken(refreshToken: string) {
		const tokenData = await Token.destroy({ where: { refreshToken } });

		return tokenData;
	}

	async findToken(refreshToken: string) {
		const tokenData = await Token.findOne({ where: { refreshToken } });

		return tokenData;
	}
}

export default new TokenService();
