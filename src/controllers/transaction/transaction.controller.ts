import { Request, Response, NextFunction } from "express";
import Wallet from "src/models/wallet.model";
import CustomException from "@utils/handlers/error.handler";
import CustomResponse from "@utils/handlers/response.handler";
import TransactionService from "src/services/transaction.service";
import Transaction from "src/models/transaction.model";
import { raw } from "objection";

/**
 * @route POST /api/transaction/verify
 * @desc Verify transactions
 * @access Public
 */

const verifyTransaction = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		if (!req.query.reference) {
			return next(new CustomException(400, "No reference id provided"));
		}

		const [status, data] = await new TransactionService({
			sender_id: req.user.id,
		}).verifyTransaction(req.query.reference as string);

		if (!status) {
			return next(
				new CustomException(
					400,
					"Failed to fund account! Please try again.",
					data
				)
			);
		}

		// We will use the result of this query to perform other operations.
		const transactionDetails = await Transaction.query()
			.findOne("transaction_hash", req.query.reference as string)
			.where("deleted_at", null)
			.first();

		if (!transactionDetails) throw new Error();

		if (data === 1) {
			// update query returns number of rows updated which I expect to be 1

			await Wallet.query()
				// .increment("balance", transactionDetails.amount)
				.where("account_number", transactionDetails.recipient_account)
				.andWhere("user_id", transactionDetails.recipient_id)
				.patch({
					balance: raw(`balance + ${transactionDetails.amount}`),
				})
				.then((result) => {
					if (result === 1) {
						return new CustomResponse(res).success(
							"Funded account successfully!",
							{},
							200
						);
					} else {
						return new CustomResponse(res).success(
							"Failed to update balance. Contact support.",
							{},
							200
						);
					}
				});
		} else {
			await Transaction.query()
				.findOne("transaction_hash", req.query.reference as string)
				.patch({
					status: "failed",
				});

			return next(
				new CustomException(
					400,
					"Transaction failed! Contact support for details.",
					data
				)
			);
		}
	} catch (error) {
		console.log(error);
		return next(error);
	}
};

export default verifyTransaction;
