import { Request, Response, NextFunction } from "express";
import { tableNames } from "src/db/table_names";
import User from "src/models/user.model";
import Wallet from "src/models/wallet.model";
import Account from "src/services/account.service";
import { encrypt } from "@utils/auth.util";
import filter from "@utils/filter.util";
import CustomException from "@utils/handlers/error.handler";
import CustomResponse from "@utils/handlers/response.handler";

const createWallet = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { pin, bvn }: { pin: string; bvn: string } = req.body;

		const walletExists = await User.relatedQuery(tableNames.wallet)
			.for(req.user.id)
			.where("deleted_at", null)
			.first();

		if (walletExists) {
			return next(new CustomException(400, "You already have a wallet!"));
		}

		// Hash pin before storing in db.
		const hashedPin = await encrypt.password(pin);

		// TODO: Verify BVN but never store it in database.
		// TODO: I would use Flutterwave's API but it costs #50.

		// Generate the wallet tag from the user's name
		const user = await new Account(req.user.id).findUser();

		// Change firstname and lastname to lowercase
		const fullname = filter.norm([user!.firstname, user!.lastname]);

		const wallet_tag = `${fullname[0]}${fullname[1]}`;

		// Generate unique 10 digits account number
		const account_number =
			Math.floor(Math.random() * 9000000000) + 1000000000;

		await Wallet.query()
			.insert({
				user_id: req.user.id,
				pin: hashedPin,
				wallet_tag,
				account_number: account_number.toString(),
			})
			.then((wallet) => {
				if (wallet && wallet.id) {
					return new CustomResponse(res).success(
						"Wallet created successfully",
						wallet,
						200,
						{
							status: "success",
							path: "wallet creation",
						}
					);
				}
			})
			.catch((error) => {
				return next(
					new CustomException(500, "Failed to create wallet", error)
				);
			});
	} catch (error) {
		console.log(error);
		return next(error);
	}
};

export default createWallet;
