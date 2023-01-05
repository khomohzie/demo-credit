import { Request, Response, NextFunction } from "express";
import Wallet from "src/models/wallet.model";
import CustomException from "@utils/handlers/error.handler";
import CustomResponse from "@utils/handlers/response.handler";
import Reference from "src/models/reference.model";
import Transaction from "src/models/transaction.model";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { raw } from "objection";

/**
 * @route POST /api/wallet/withdraw
 * @desc Withdraw money from user's wallet
 * @access Public
 */

const withdrawFromWallet = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { account_name, account_number, bank_code, description, amount } =
			req.body;

		const wallet = await Wallet.query()
			.findOne("user_id", req.user.id)
			.where("deleted_at", null);

		if (!wallet) {
			return next(
				new CustomException(400, "Wallet does not exist", {
					reason: "id not associated with any wallet",
					alias: "wall_not_found",
					code: "ACC_ERR_05",
				})
			);
		}

		// Declare a variable to store reference_id later.
		let reference_id: string;

		if (wallet.debt === 0 && wallet.balance >= amount) {
			await Reference.query()
				.insert({
					amount: amount,
					is_successful: true,
					recipient_account: wallet.account_number,
					recipient_id: wallet.user_id,
					reference_id: uuidv4(),
					sender_id: req.user.id,
				})
				.then(async (reference) => {
					if (reference) {
						reference_id = reference.reference_id;

						await Transaction.query()
							.insert({
								amount: amount,
								status: "pending",
								recipient_account: wallet.account_number,
								recipient_id: req.user.id,
								transaction_hash: reference.reference_id,
								sender_id: req.user.id,
								description: description,
								category: "withdrawal",
							})
							.then(async (transaction) => {
								//* The commented code comes in at this point but will not work in test mode.

								await Wallet.query()
									.where("user_id", transaction.sender_id)
									.andWhere("deleted_at", null)
									.patch({
										balance: raw(
											`balance - ${transaction.amount}`
										),
									})
									.then(async (result) => {
										if (result === 1) {
											await Transaction.query()
												.where(
													"transaction_hash",
													reference_id
												)
												.patch({
													status: "successful",
												});

											return new CustomResponse(
												res
											).success(
												"Withdrawal successful!",
												{},
												200
											);
										} else {
											return next(
												new CustomException(
													400,
													"Withdrawal failed! Please try again."
												)
											);
										}
									});
							});
					} else {
						return next(
							new CustomException(
								400,
								"Transaction not initiated! Please try again."
							)
						);
					}
				});
		} else {
			return next(
				new CustomException(400, "You do not have that much money")
			);
		}

		//* List of bank codes
		// const bankCodes = await axios.get("https://api.paystack.co/bank", {
		// 	headers: {
		// 		"content-type": "application/json",
		// 		Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
		// 	},
		// });

		// await axios
		// 	.post(
		// 		"https://api.paystack.co/transferrecipient",
		// 		{
		// 			type: "nuban",
		// 			name: account_name,
		// 			account_number: account_number,
		// 			bank_code: bank_code,
		// 			currency: "NGN",
		// 			description: description,
		// 		},
		// 		{
		// 			headers: {
		// 				"content-type": "application/json",
		// 				Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
		// 			},
		// 		}
		// 	)
		// 	.then(async (recipient) => {
		// 		// Initialize the transfer request
		// 		await axios
		// 			.post(
		// 				"https://api.paystack.co/transfer",
		// 				{
		// 					source: "balance",
		// 					reason: description,
		// 					amount: amount,
		// 					recipient: recipient.data.data.recipient_code,
		// 					reference: reference_id,
		// 				},
		// 				{
		// 					headers: {
		// 						"content-type": "application/json",
		// 						Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
		// 					},
		// 				}
		// 			)
		// 			.then(async (tranResult) => {
		// 				if (tranResult.data.event === "transfer.success") {
		// 					await Wallet.query()
		// 						.where("user_id", req.user.id)
		// 						.patch({
		// 							balance: raw(`balance - ${amount}`),
		// 						})
		// 						.then((result) => {
		// 							if (result === 1) {
		// 								return new CustomResponse(res).success(
		// 									"Withdrawal successful!",
		// 									{},
		// 									200
		// 								);
		// 							} else {
		// 								return new CustomResponse(res).success(
		// 									"Failed to update balance. Contact support.",
		// 									{},
		// 									200
		// 								);
		// 							}
		// 						});
		// 				} else {
		// 					return next(
		// 						new CustomException(
		// 							503,
		// 							"Withdrawal failed. Contact support."
		// 						)
		// 					);
		// 				}
		// 			})
		// 			.catch((err) => {
		// 				return next(
		// 					new CustomException(
		// 						503,
		// 						"Transaction failed. Please try again",
		// 						err
		// 					)
		// 				);
		// 			});
		// 	})
		// 	.catch((err) => {
		// 		return next(new CustomException(503, "Invalid account", err));
		// 	});
	} catch (error) {
		console.log(error);
		return next(error);
	}
};

export default withdrawFromWallet;
