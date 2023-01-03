import { Model } from "objection";
import { tableNames } from "src/db/table_names";
import { IUser } from "src/interfaces/auth.interfaces";
import schema from "../schema/user.schema.json";

class User extends Model implements IUser {
	id!: number;
	firstname!: string;
	lastname!: string;
	email!: string;
	password!: string;
	bvn?: string;
	avatar!: string;
	phone_number?: string;
	role!: string;
	verified!: boolean;
	deleted_at!: Date;

	static get tableName() {
		return tableNames.user;
	}

	static get jsonSchema() {
		return schema;
	}
}

export default User;
