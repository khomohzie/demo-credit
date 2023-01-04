import { NextFunction, Request, Response } from "express";
import Wallet from "../../../models/wallet.model";
import CustomException from "@utils/handlers/error.handler";
import CustomResponse from "@utils/handlers/response.handler";
import User from "src/models/user.model";

/**
 * @route GET /api/wallet/me
 * @desc Get my wallet information
 * @access Public
 */

const retrieveMyWallet = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const wallet = await User.relatedQuery("wallet")
			.for(req.user.id)
			.where("deleted_at", null)
			.first();

		if (!wallet) {
			return next(
				new CustomException(400, "Wallet does not exist", {
					reason: "id not associated with any wallet",
					alias: "wall_not_found",
					code: "ACC_ERR_05",
				})
			);
		}

		return new CustomResponse(res).success(
			"Wallet information retrieved!",
			wallet,
			200,
			{
				status: "success",
				path: "retrieve my wallet",
			}
		);
	} catch (error) {
		console.log(error);
		return next(error);
	}
};

export { retrieveMyWallet };
