import { NextFunction, Request, Response } from "express";
import User from "../../../models/user.model";
import CustomException from "@utils/handlers/error.handler";
import CustomResponse from "@utils/handlers/response.handler";

/**
 * @route GET /api/user/me
 * @desc Get my profile
 * @access Public
 */

const userProfile = async (req: Request, res: Response, next: NextFunction) => {
	try {
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

		return new CustomResponse(res).success(
			"Profile retrieved successfully.",
			user,
			200,
			{
				path: "user's profile",
			}
		);
	} catch (error) {
		console.log(error);
		return next(error);
	}
};

/**
 * @route GET /api/user/data/:id
 * @desc Get a user's profile by admin
 * @access Public
 */

//* Admin can retrieve a user's profile using this controller.
const aUserData = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await User.query()
			.findById(req.params.id)
			.where("deleted_at", null);

		if (!user)
			return next(
				new CustomException(400, "No user data!", {
					reason: "account not found",
					alias: "acc_not_found",
					code: "ACC_ERR_01",
				})
			);

		return new CustomResponse(res).success(
			"Profile retrieved successfully.",
			user,
			200,
			{
				path: "a user's data by admin",
			}
		);
	} catch (error) {
		console.log(error);
		return next(error);
	}
};

/**
 * @route GET /api/user/all
 * @desc Get all profiles
 * @access Public
 */

const profiles = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const users = await User.query().where("deleted_at", null);

		if (!users)
			return next(
				new CustomException(400, "Error retrieving users.", {
					reason: "account not found",
					alias: "acc_not_found",
					code: "ACC_ERR_01",
				})
			);

		if (users.length <= 0)
			return new CustomResponse(res).success(
				"No user data!",
				users,
				200,
				{
					path: "profiles",
				}
			);

		return new CustomResponse(res).success(
			"Profiles retrieved successfully.",
			users,
			200,
			{
				path: "profiles",
			}
		);
	} catch (error) {
		console.log(error);
		return next(error);
	}
};

export { userProfile, aUserData, profiles };
