import { compare, encrypt } from "@utils/auth.util";
import CustomException from "@utils/handlers/error.handler";
import CustomResponse from "@utils/handlers/response.handler";
import { NextFunction, Request, Response } from "express";
import moment from "moment";
import { tableNames } from "src/db/table_names";
import User from "../../../models/user.model";

/**
 * @route DELETE /api/user/me/delete
 * @desc Delete my profile
 * @access Public
 */

//* Adopting soft delete throughout application.

const deleteAccount = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		await User.query()
			.findById(req.user.id)
			.patch({
				deleted_at: moment().format("YYYY-MM-DD HH:mm:ss"),
			});

		await User.relatedQuery(tableNames.wallet)
			.for(req.user.id)
			.findOne("deleted_at", null)
			.patch({
				deleted_at: moment().format("YYYY-MM-DD HH:mm:ss"),
			});

		return new CustomResponse(res).success(
			"Account deleted successfully.",
			{},
			200,
			{
				path: "delete my account",
			}
		);
	} catch (error) {
		console.log(error);
		return next(error);
	}
};

/**
 * @route PUT /api/user/me/password
 * @desc Change my password
 * @access Public
 */

const changePassword = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { oldPassword, password } = req.body;

		const user = await User.query()
			.findById(req.user.id)
			.where("deleted_at", null);

		if (!user)
			return next(
				new CustomException(400, "No user data!", {
					reason: "account not found",
					alias: "acc_not_found",
					code: "ACC_ERR_01",
				})
			);

		// authenticate the entered password
		const verifyPassword = await compare.password(
			oldPassword,
			user.password
		);

		if (!verifyPassword) {
			return next(new CustomException(400, "Password is incorrect!"));
		}

		const hashedPassword = await encrypt.password(password);

		await User.query().findById(req.user.id).patch({
			password: hashedPassword,
		});

		return new CustomResponse(res).success("Password updated!", {}, 200, {
			path: "change password",
		});
	} catch (error) {
		console.log(error);
		return next(error);
	}
};

/**
 * @route DELETE /api/user/all/delete
 * @desc Delete all profiles
 * @access Public
 */

const deleteAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await User.query()
			.where("deleted_at", null)
			.patch({
				deleted_at: moment().format("YYYY-MM-DD HH:mm:ss"),
			});

		return new CustomResponse(res).success(
			"All accounts deleted successfully.",
			{},
			200,
			{
				path: "Delete all accounts",
			}
		);
	} catch (error) {
		console.log(error);
		return next(error);
	}
};

export { deleteAccount, changePassword, deleteAll };
