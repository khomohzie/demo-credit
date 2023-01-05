import { Model } from "objection";
import { tableNames } from "src/db/table_names";
import { ITransaction } from "src/interfaces/transaction.interfaces";
import schema from "../schema/transaction.schema.json";

class Transaction extends Model implements ITransaction {
	id!: number;
	sender_id!: number;
	transaction_hash!: string;
	recipient_id!: number;
	recipient_account!: string;
	description!: string;
	category!: string;
	amount!: number;
	status!: string;
	created_at!: string;
	updated_at!: string;
	deleted_at?: string;

	static get tableName() {
		return tableNames.transaction;
	}

	static get jsonSchema() {
		return schema;
	}
}

export default Transaction;
