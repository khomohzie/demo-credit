import { Request, Response, NextFunction } from "express";
import Wallet from "src/models/wallet.model";
import CustomException from "@utils/handlers/error.handler";
import CustomResponse from "@utils/handlers/response.handler";
import Transaction from "src/models/transaction.model";
import { raw } from "objection";
import { compare } from "@utils/auth.util";
import Reference from "src/models/reference.model";
import { v4 as uuidv4 } from "uuid";

/**
 * @route PUT /api/transaction/transfer
 * @desc Transfer funds to another account
 * @access Public
 */

const transferFunds = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { pin, amount, recipient_account, description } = req.body;

		const senderWallet = await Wallet.query()
			.where("user_id", req.user.id)
			.andWhere("deleted_at", null)
			.first();

		if (!senderWallet) {
			return next(
				new CustomException(400, "You have no wallet with us.")
			);
		}

		// Users will enter their pin to make transfers
		const verifyPin = await compare.password(pin, senderWallet.pin);

		if (!verifyPin) {
			return next(new CustomException(401, "Wrong pin!"));
		}

		const recipientWallet = await Wallet.query()
			.where("account_number", recipient_account)
			.andWhere("deleted_at", null)
			.first();

		if (!recipientWallet) {
			return next(new CustomException(400, "Invalid account details!"));
		}

		// Declare a variable to store reference_id later.
		let reference_id: string;

		if (senderWallet.debt === 0 && senderWallet.balance > amount) {
			await Reference.query()
				.insert({
					amount: amount,
					is_successful: true,
					recipient_account: recipient_account,
					recipient_id: recipientWallet.user_id,
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
								recipient_account: recipient_account,
								recipient_id: recipientWallet.user_id,
								transaction_hash: reference.reference_id,
								sender_id: req.user.id,
								description: description,
								category: "transfer",
							})
							.then(async (transaction) => {
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
											await Wallet.query()
												.where(
													"account_number",
													transaction.recipient_account
												)
												.andWhere(
													"user_id",
													transaction.recipient_id
												)
												.patch({
													balance: raw(
														`balance + ${transaction.amount}`
													),
												});

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
												"Transfer successful!",
												{},
												200
											);
										} else {
											return new CustomResponse(
												res
											).success(
												"Transfer failed!",
												{},
												200
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
				new CustomException(
					400,
					"You do not have that much money in your wallet."
				)
			);
		}
	} catch (error) {
		console.log(error);
		return next(error);
	}
};

export default transferFunds;
