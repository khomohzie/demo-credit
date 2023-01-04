import { NextFunction, Request, Response } from "express";
import User from "../../../models/user.model";
import cloudinaryUpload from "@utils/cloudinary";
import CustomException from "@utils/handlers/error.handler";
import CustomResponse from "@utils/handlers/response.handler";
import filter from "@utils/filter.util";
import { IUser } from "../../../interfaces/auth.interfaces";
import * as formidable from "formidable";

/**
 * @route PUT /api/user/me
 * @desc Update my profile
 * @access Public
 */

const updateProfile = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const body = req.fields?.data as string;

		let data: IUser;

		if (body) {
			data = JSON.parse(body);
		} else {
			data = {} as IUser;
		}

		const avatarImage = req.files?.avatarImage as formidable.File;

		const user = await User.query()
			.findById(req.user.id)
			.where("deleted_at", null);

		if (!user)
			return next(
				new CustomException(400, "No user found!", {
					reason: "account not found",
					alias: "acc_not_found",
					code: "ACC_ERR_01",
				})
			);

		// Upload image to cloudinary
		const cloudinaryFolder = `${user.email}-${user.id}`;

		if (avatarImage) {
			await cloudinaryUpload(avatarImage.filepath, cloudinaryFolder)
				.then((downloadURL) => {
					data.avatar = downloadURL;
				})
				.catch((error) => {
					console.error(error);
				});
		}

		// If someone entered a new password/email/role illegally, revert to old password/email/role
		data.password = user.password;
		data.email = user.email;
		if (data && data.role) data.role = user.role;

		// Capitalize firstname and lastname
		if (data && data.firstname)
			data.firstname = filter.str(data.firstname, "F");
		if (data && data.lastname)
			data.lastname = filter.str(data.lastname, "F");

		await User.query().findById(req.user.id).patch(data);

		return new CustomResponse(res).success("Profile updated.", {}, 200, {
			status: "Success",
			path: "profile update",
		});
	} catch (error) {
		console.log(error);
		return next(error);
	}
};

/**
 * @route PUT /api/user/avatar
 * @desc Update my avatar
 * @access Public
 */

const changeAvatar = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const avatarImage = req.files?.avatarImage as formidable.File;

		const user = await User.query()
			.findById(req.user.id)
			.where("deleted_at", null);

		if (!user)
			return next(
				new CustomException(400, "No user found!", {
					reason: "account not found",
					alias: "acc_not_found",
					code: "ACC_ERR_01",
				})
			);

		// Upload image to cloudinary
		const cloudinaryFolder = `${user.email}-${user.id}`;

		if (avatarImage) {
			await cloudinaryUpload(avatarImage.filepath, cloudinaryFolder)
				.then(async (downloadURL) => {
					await User.query().findById(req.user.id).patch({
						avatar: downloadURL,
					});

					return new CustomResponse(res).success(
						"Avatar updated.",
						{},
						200,
						{
							status: "Success",
							path: "change avatar",
						}
					);
				})
				.catch((error) => {
					console.error(error);
					return next(
						new CustomException(error.status || 400, error)
					);
				});
		} else {
			return next(new CustomException(400, "No data/image sent."));
		}
	} catch (error) {
		console.log(error);
		return next(error);
	}
};

export { updateProfile, changeAvatar };
