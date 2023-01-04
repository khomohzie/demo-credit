import { Model, Pojo } from "objection";
import { tableNames } from "src/db/table_names";
import { IWallet } from "src/interfaces/wallet.interfaces";

class Wallet extends Model implements IWallet {
	id!: number;
	user_id!: number;
	wallet_tag!: string;
	account_number!: string;
	pin!: string;
	balance!: number;
	debt!: number;
	fin_status!: "broke" | "rich";
	can_transact!: boolean;
	created_at!: string;
	updated_at!: string;
	deleted_at?: string;

	static get tableName() {
		return tableNames.wallet;
	}

	// static get jsonSchema() {
	//     return schema;
	// }

	$formatJson(json: Pojo) {
		json = super.$formatJson(json);
		delete json.pin;
		delete json.deleted_at;
		delete json.updated_at;
		return json;
	}
}

export default Wallet;