import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import mailService from "./mail.service.js";
import tokenService from "./token.service.js";
import { UserDto } from "../dtos/user.dto.js";
import { ApiError } from "../exceptions/api.error.js";

class UserService {
	async signUp(email: string, username: string, password: string) {
		const emailCandidate = await User.findOne({ where: { email } });
		const usernameCandidate = await User.findOne({ where: { username } });

		if (emailCandidate) {
			throw ApiError.BadRequest("Email already exists.");
		}

		if (usernameCandidate) {
			throw ApiError.BadRequest("Username already exists.");
		}

		const hashPassword = await bcrypt.hash(password, 3);
		const activationLink = uuidv4();
		await mailService.sendActivationMail(email, `https://api.mecener.online/auth/activate/${activationLink}`);

		const user = await User.create({ email, username, password: hashPassword, activationLink });
		const userDto = new UserDto(user);

		const tokens = tokenService.generateTokens({ ...userDto });

		await tokenService.saveToken(userDto.id, tokens.refreshToken);

		return {
			...tokens,
			user: userDto,
		};
	}

	async activateAccount(activationLink: string) {
		const user = await User.findOne({ where: { activationLink } });

		if (!user) {
			throw ApiError.BadRequest("Incorrect activation link");
		}

		user.isActivated = true;

		await user.save();
	}

	async signIn(login: string, password: string) {
		const user = (await User.findOne({ where: { username: login } })) || (await User.findOne({ where: { email: login } }));

		if (!user) {
			throw ApiError.BadRequest("A user with that username or email address was not found.");
		}

		const isPasswordEquals = await bcrypt.compare(password, user.password);

		if (!isPasswordEquals) {
			throw ApiError.BadRequest("Password is incorrect.");
		}

		const userDto = new UserDto(user);

		const tokens = tokenService.generateTokens({ ...userDto });
		await tokenService.saveToken(userDto.id, tokens.refreshToken);

		return {
			...tokens,
			user: userDto,
		};
	}

	async signOut(refreshToken: string) {
		const token = await tokenService.removeToken(refreshToken);

		return token;
	}

	async refresh(refreshToken: string) {
		if (!refreshToken) {
			throw ApiError.UnauthorizedError();
		}

		const userData = tokenService.validateRefreshToken(refreshToken) as { id: number; username: string };
		const tokenFromDb = await tokenService.findToken(refreshToken);

		if (!userData || !tokenFromDb) {
			throw ApiError.UnauthorizedError();
		}

		const user = await User.findOne({ where: { id: userData.id } });

		if (!user) {
			throw ApiError.BadRequest("Unknown user");
		}

		const userDto = new UserDto(user);

		const tokens = tokenService.generateTokens({ ...userDto });
		await tokenService.saveToken(userDto.id, tokens.refreshToken);

		return {
			...tokens,
			user: userDto,
		};
	}

	async getAllUsers() {
		const users = await User.findAll();

		return users;
	}
}

export default new UserService();
