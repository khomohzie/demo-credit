import Paystack from "paystack-api";
import Account from "./account.service";
import { v4 as uuidv4 } from "uuid";
import Transaction from "src/models/transaction.model";
import Reference from "../models/reference.model";
import {
	IReference,
	ITransactionService,
} from "src/interfaces/transaction.interfaces";

const paystack = Paystack(process.env.PAYSTACK_SECRET);

class TransactionService extends Account {
	private sender_id!: number;
	private recipient_id!: number;
	private recipient_account!: string;
	private amount!: number;

	constructor({
		sender_id,
		recipient_id,
		recipient_account,
		amount,
	}: ITransactionService) {
		super(sender_id!);

		this.sender_id = sender_id!;
		this.recipient_id = recipient_id!;
		this.recipient_account = recipient_account!;
		this.amount = amount!;
	}

	async addTransaction() {
		const user = await this.findUser();
		if (!user) return [false, "User does not exist"];

		const [status, reference] = await this.createReference();

		if (!status) return [false, reference];

		return [true, reference];
	}

	async verifyTransaction(reference: IReference["reference_id"]) {
		const verifyRef = await paystack.transaction.verify({ reference });

		if (!verifyRef) {
			return [false, "PayStack payment error"];
		}

		if (verifyRef.status == false) {
			return [false, "PayStack payment error"];
		}

		if (verifyRef.data.status == "success") {
			const refExist = await this.getReference(verifyRef.data.reference);

			if (refExist) {
				if (!refExist.is_successful) {
					const editedRef = await this.editReferenceSuccess(
						verifyRef.data.reference
					);

					if (editedRef === 1) {
						// update query returns the number of rows updated.
						let sender = await this.findUser();

						if (!sender?.id)
							return [false, "Unable to find sender id"];

						const updated = await Transaction.query()
							.findOne(
								"transaction_hash",
								verifyRef.data.reference
							)
							.patch({
								status: "successful",
							});

						return [true, updated];
					}

					return [
						true,
						"Transaction successful but reference wasn't updated successfully",
					];
				}

				return [
					false,
					"Transaction has already been carried out in the past",
				];
			}

			return [false, "Reference data could not be retrieved"];
		}

		return [false, "Transaction unsuccessful"];
	}

	private async createReference(): Promise<Array<boolean | Reference>> {
		return await Reference.query()
			.insert({
				reference_id: uuidv4(),
				sender_id: this.sender_id,
				recipient_id: this.recipient_id,
				recipient_account: this.recipient_account,
				amount: this.amount,
			})
			.then((reference) => {
				return [true, reference];
			})
			.catch((error) => {
				return [false, error];
			});
	}

	private async getReference(reference_id: IReference["reference_id"]) {
		return await Reference.query().findOne("reference_id", reference_id);
	}

	private async editReferenceSuccess(
		reference_id: IReference["reference_id"]
	) {
		return await Reference.query()
			.findOne("reference_id", reference_id)
			.patch({ is_successful: true });
	}
}

export default TransactionService;
