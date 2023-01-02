import { NextFunction, Request, Response } from "express";
import User from "../../../models/user.model";
import CustomException from "@utils/handlers/error.handler";
import CustomResponse from "@utils/handlers/response.handler";

/**
 * @route GET /api/user/all
 * @desc Get all profiles
 * @access Public
 */

const profiles = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const users = await User.query().select(
			"id",
			"email",
			"firstname",
			"lastname",
			"created_at",
			"updated_at"
		);

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

export { profiles };
