import { Model, Pojo } from "objection";
import { tableNames } from "src/db/table_names";
import { IUser } from "src/interfaces/auth.interfaces";
import schema from "../schema/user.schema.json";
import Wallet from "./wallet.model";

class User extends Model implements IUser {
	id!: number;
	firstname!: string;
	lastname!: string;
	email!: string;
	password!: string;
	avatar!: string;
	phone_number?: string;
	role!: string;
	verified!: boolean;
	deleted_at!: string;

	static get tableName() {
		return tableNames.user;
	}

	static get jsonSchema() {
		return schema;
	}

	// This object defines the relations to other models.
	static get relationMappings() {
		return {
			wallet: {
				relation: Model.HasManyRelation,
				// The related model. This can be either a Model subclass constructor or an
				// absolute file path to a module that exports one.
				modelClass: Wallet,
				join: {
					from: "user.id",
					to: "wallet.user_id",
				},
			},
		};
	}

	$formatJson(json: Pojo) {
		json = super.$formatJson(json);
		delete json.password;
		delete json.bvn;
		return json;
	}
}

export default User;
