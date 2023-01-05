import { Model } from "objection";
import { tableNames } from "src/db/table_names";
import { IReference } from "src/interfaces/transaction.interfaces";
import Transaction from "./transaction.model";
import schema from "../schema/reference.schema.json";

class Reference extends Model implements IReference {
	id!: number;
	reference_id!: string;
	sender_id!: number;
	recipient_id!: number;
	recipient_account!: string;
	amount!: number;
	is_successful!: boolean;
	created_at!: string;
	updated_at!: string;
	deleted_at?: string;

	static get tableName() {
		return tableNames.reference;
	}

	static get jsonSchema() {
		return schema;
	}

	// This object defines the relations to other models.
	static get relationMappings() {
		return {
			transaction: {
				relation: Model.HasOneRelation,
				// The related model. This can be either a Model subclass constructor or an
				// absolute file path to a module that exports one.
				modelClass: Transaction,
				join: {
					from: "reference.reference_id",
					to: "transaction.transaction_hash",
				},
			},
		};
	}
}

export default Reference;
