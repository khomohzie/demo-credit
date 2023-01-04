import { NextFunction, Request, Response } from "express";
import Wallet from "../../../models/wallet.model";
import CustomException from "@utils/handlers/error.handler";
import CustomResponse from "@utils/handlers/response.handler";
import User from "src/models/user.model";
import { compare, encrypt } from "@utils/auth.util";

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

/**
 * @route PUT /api/wallet/me
 * @desc Change my wallet pin
 * @access Public
 */

const changeWalletPin = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { currentPin, newPin }: { currentPin: string; newPin: string } =
			req.body;

		const wallet = (await User.relatedQuery("wallet")
			.for(req.user.id)
			.where("deleted_at", null)
			.first()) as Wallet;

		if (!wallet) {
			return next(
				new CustomException(400, "Wallet does not exist", {
					reason: "id not associated with any wallet",
					alias: "wall_not_found",
					code: "ACC_ERR_05",
				})
			);
		}

		// Verify the old pin.
		const verifyPin = await compare.password(currentPin, wallet.pin);

		if (!verifyPin) {
			return next(new CustomException(401, "Invalid current pin!"));
		}

		const hashedPin = await encrypt.password(newPin);

		await Wallet.query()
			.findOne("user_id", req.user.id)
			.patch({
				pin: hashedPin,
			})
			.then((result) => {
				if (result === 1) {
					return new CustomResponse(res).success(
						"Wallet pin updated!",
						{},
						200,
						{
							status: "success",
							path: "change my wallet pin",
						}
					);
				} else {
					throw new Error("Failed to change pin");
				}
			})
			.catch((err) => {
				return next(
					new CustomException(400, "Failed to change pin", err)
				);
			});
	} catch (error) {
		console.log(error);
		return next(error);
	}
};

export { retrieveMyWallet, changeWalletPin };
