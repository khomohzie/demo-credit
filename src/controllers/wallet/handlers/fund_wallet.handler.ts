import { Request, Response, NextFunction } from "express";
import Wallet from "src/models/wallet.model";
import CustomException from "@utils/handlers/error.handler";
import CustomResponse from "@utils/handlers/response.handler";
import TransactionService from "src/services/transaction.service";
import Paystack from "paystack-api";
import User from "src/models/user.model";
import { tableNames } from "src/db/table_names";
import Reference from "src/models/reference.model";
import Transaction from "src/models/transaction.model";

const paystack = Paystack(process.env.PAYSTACK_SECRET);

/**
 * @route POST /api/wallet/fund
 * @desc Add money to user's wallet
 * @access Public
 */

const fundWallet = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { category, description, amount } = req.body;

		// Just because Paystack requires the user's name and email address.
		const user = await User.query().findOne("id", req.user.id);

		const wallet = (await User.relatedQuery(tableNames.wallet)
			.for(req.user.id)
			.where("deleted_at", null)
			.first()) as Wallet;

		if (!wallet) {
			return next(new CustomException(400, "Invalid account details"));
		}

		const [status, data] = await new TransactionService({
			sender_id: req.user.id,
			recipient_id: wallet.user_id,
			recipient_account: wallet.account_number,
			amount,
		}).addTransaction();

		if (!status) {
			return next(
				new CustomException(500, "Unable to initialize payment", data)
			);
		}

		const reference = data as Reference;

		paystack.transaction
			.initialize({
				reference: reference.reference_id,
				amount: reference.amount * 100, // Because paystack calculates in kobo
				email: user!.email,
				name: `${user!.firstname}${user!.lastname}`,
				callback_url: `${process.env.CLIENT_URL}/verify-transaction.html`,
			})
			.then(async (response) => {
				if (response.status) {
					await Transaction.query().insert({
						sender_id: req.user.id,
						recipient_id: wallet.user_id,
						recipient_account: wallet.account_number,
						status: "pending",
						transaction_hash: response.data.reference,
						category,
						description,
						amount,
					});

					return new CustomResponse(res).success(
						"Paystack payment initialization successful",
						{
							paystackUrl: response.data.authorization_url,
							reference: response.data.reference,
						},
						201
					);
				}

				return next(
					new CustomException(
						400,
						"Paystack payment initialization unsuccessful"
					)
				);
			})
			.catch((err) => {
				return next(
					new CustomException(503, "PayStack payment error", err)
				);
			});
	} catch (error) {
		console.log(error);
		return next(error);
	}
};

const verifyFunding = async (
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

		return new CustomResponse(res).success(
			"Funded account successfully!",
			data,
			200
		);
	} catch (error) {
		console.log(error);
		return next(error);
	}
};

export { fundWallet, verifyFunding };
