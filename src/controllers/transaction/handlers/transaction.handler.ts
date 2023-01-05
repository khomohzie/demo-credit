import { NextFunction, Request, Response } from "express";
import Transaction from "src/models/transaction.model";
import CustomException from "@utils/handlers/error.handler";
import CustomResponse from "@utils/handlers/response.handler";

/**
 * @route GET /api/transactions/me
 * @desc Get my transaction history
 * @access Public
 */

const retrieveMyTransactions = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const transactions = await Transaction.query()
			.where("sender_id", req.user.id)
			.andWhere("deleted_at", null);

		if (!transactions)
			return next(
				new CustomException(400, "Error retrieving transactions.")
			);

		if (transactions.length <= 0)
			return new CustomResponse(res).success(
				"No transaction data!",
				transactions,
				200,
				{
					path: "retrieve my transactions",
				}
			);

		return new CustomResponse(res).success(
			"Transactions retrieved successfully.",
			transactions,
			200,
			{
				path: "retrieve my transactions",
			}
		);
	} catch (error) {
		console.log(error);
		return next(error);
	}
};

/**
 * @route GET /api/transaction/me/:id
 * @desc Get transaction details (for users. They can only see details of theirs.)
 * @access Public
 */

const transactionDetails = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const transaction = await Transaction.query()
			.findById(req.params.id)
			.where("sender_id", req.user.id)
			.andWhere("deleted_at", null);

		if (!transaction)
			return next(new CustomException(400, "Error retrieving details."));

		return new CustomResponse(res).success(
			"Details retrieved successfully.",
			transaction,
			200,
			{
				path: "transaction details",
			}
		);
	} catch (error) {
		console.log(error);
		return next(error);
	}
};

/**
 * @route GET /api/transaction/:id
 * @desc Get transaction details (for admin. They can see details of all.)
 * @access Public
 */

const transactionDetailsAdmin = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const transaction = await Transaction.query()
			.findById(req.params.id)
			.where("deleted_at", null);

		if (!transaction)
			return next(new CustomException(400, "Error retrieving details."));

		return new CustomResponse(res).success(
			"Details retrieved successfully.",
			transaction,
			200,
			{
				path: "transaction details for admin",
			}
		);
	} catch (error) {
		console.log(error);
		return next(error);
	}
};

/**
 * @route GET /api/transactions
 * @desc Get transaction history for all users
 * @access Public
 */

const retrieveAllTransactions = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const transactions = await Transaction.query().where(
			"deleted_at",
			null
		);

		if (!transactions)
			return next(
				new CustomException(400, "Error retrieving transactions.")
			);

		if (transactions.length <= 0)
			return new CustomResponse(res).success(
				"No transaction data!",
				transactions,
				200,
				{
					path: "retrieve all transactions",
				}
			);

		return new CustomResponse(res).success(
			"Transactions retrieved successfully.",
			transactions,
			200,
			{
				path: "retrieve all transactions",
			}
		);
	} catch (error) {
		console.log(error);
		return next(error);
	}
};

export {
	retrieveMyTransactions,
	transactionDetails,
	transactionDetailsAdmin,
	retrieveAllTransactions,
};
