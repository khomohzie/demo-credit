import redisClient from "./redis.util";
import redisConfig from "../config/redis.config";
import { signJwt, verifyJwt } from "./jwt.utils";
import bcrypt from "bcrypt";
import { IUser } from "../interfaces/auth.interfaces";

const { constants, prefix } = redisConfig;

type TGenerate = {
	accessToken: string;
	refreshToken: string;
};

type TVerify = {
	id: string;
	email?: string;
	expiresIn?: any;
	name?: string;
	message?: string;
	expiredAt?: any;
};

//  Generate tokens
export const generate = async (user: IUser): Promise<TGenerate> => {
	const accessToken = signJwt(
		{
			id: user.id,
			email: user.email,
			role: user.role,
		},
		process.env.JWT_ACCESS_PRIVATE_SECRET,
		{
			expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES_IN_DAY}d`,
		}
	);

	const refreshToken = signJwt(
		{
			id: user.id,
			email: user.email,
			role: user.role,
		},
		process.env.JWT_REFRESH_PRIVATE_SECRET,
		{
			expiresIn: `${process.env.REFRESH_TOKEN_EXPIRES_IN_DAY}d`,
		}
	);

	// Create a Session
	await redisClient.set(user.id.toString(), JSON.stringify(user), {
		EX: 60 * 60 * 24 * 7,
	});

	// Return access and refresh token
	return { accessToken, refreshToken };
};

//  Read tokens
export const decode = {
	accessToken: async (token: string) => {
		try {
			return verifyJwt<TVerify>(
				token,
				process.env.JWT_ACCESS_PUBLIC_SECRET
			);
		} catch (err: any) {
			throw new Error(err);
		}
	},

	refreshToken: async (token: string): Promise<string | null> => {
		try {
			const decoded = verifyJwt<TVerify>(
				token,
				process.env.JWT_REFRESH_PUBLIC_SECRET
			);

			const userId = await redisClient.get(decoded!.id);

			return userId;
		} catch (err: any) {
			throw new Error(err);
		}
	},

	resetToken: async (token: string): Promise<string | null> => {
		try {
			const email = await redisClient.get(prefix.resetToken(token));

			return email;
		} catch (err: any) {
			throw new Error(err);
		}
	},

	// "Verify Email" token
	verifyToken: async (token: string): Promise<string | null> => {
		try {
			const email = await redisClient.get(prefix.verifyToken(token));

			return email;
		} catch (err: any) {
			throw new Error(err);
		}
	},
};

//  Validate tokens
export const validate = {
	accessToken: async (token: string): Promise<boolean> => {
		const accessTokens = await redisClient.lRange(
			constants.ACCESS_TOKENS,
			0,
			-1
		);
		if (accessTokens.includes(token)) {
			return false;
		}
		return true;
	},

	refreshToken: async (token: string): Promise<boolean> => {
		const refreshToken = await redisClient.get(prefix.refreshToken(token));
		if (refreshToken) {
			return true;
		}
		return false;
	},
};

//  Encrypt data
export const encrypt = {
	pin: async (pin: string): Promise<string> => {
		try {
			return await bcrypt.hash(pin, 10);
		} catch (err: any) {
			throw new Error(err);
		}
	},

	password: async (password: string): Promise<string> => {
		try {
			return new Promise((resolve, reject) => {
				bcrypt.genSalt(12, (err, salt) => {
					if (err) {
						reject(err);
					}

					bcrypt.hash(password, salt, (err, hash) => {
						if (err) {
							reject(err);
						}

						resolve(hash);
					});
				});
			});
		} catch (err: any) {
			throw new Error(err);
		}
	},
};

// Compare
export const compare = {
	password: async (
		password: string,
		hashedPassword: string
	): Promise<boolean> => {
		try {
			return await bcrypt.compare(password, hashedPassword);
		} catch (err: any) {
			throw new Error(err);
		}
	},
};

const authUtil = {
	generate,
	validate,
	decode,
	encrypt,
	compare,
};

export default authUtil;
