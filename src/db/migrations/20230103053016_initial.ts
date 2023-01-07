import { Knex } from "knex";
// import moment from "moment";
import { tableNames } from "../table_names";

/**
 * //* Some MySQL servers do not support the function `table.timestamps(false, true);` because it adds
 * //* 'CURRRENT_TIMESTAMP' as the default value of the created_at and updated_at fields.
 * //* In case the above happens, uncomment the commented lines that use momentjs to add the default values
 * //* of the created_at and updated_at fields instead. Also remove `table.timestamps(false, true);`
 */

const addDefaultColumns = (table: Knex.CreateTableBuilder) => {
	table.timestamps(false, true);
	table.datetime("deleted_at");
};

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable(tableNames.user, (table) => {
		table.increments().primary().notNullable();
		table.string("email", 254).notNullable().unique();
		table.string("firstname", 50).notNullable();
		table.string("lastname", 50).notNullable();
		table.string("password", 127).notNullable();
		table
			.string("avatar", 2000)
			.defaultTo(
				"https://res.cloudinary.com/ajo-app/image/upload/v1655981383/iltgrwotpu116olvku7o.png"
			);
		table.string("phone_number", 12);
		table.enu("role", ["admin", "user"]).notNullable().defaultTo("user");
		table.boolean("verified").notNullable().defaultTo(false);
		// table
		// 	.datetime("created_at")
		// 	.notNullable()
		// 	.defaultTo(moment().format("YYYY-MM-DD HH:mm:ss"));
		// table
		// 	.datetime("updated_at")
		// 	.notNullable()
		// 	.defaultTo(moment().format("YYYY-MM-DD HH:mm:ss"));
		addDefaultColumns(table);
	});

	await knex.schema.createTable(tableNames.wallet, (table) => {
		table.increments().primary().notNullable();
		table.integer("user_id").unsigned().unique();
		table.string("wallet_tag").notNullable();
		table.string("account_number").notNullable().unique();
		table.string("pin").notNullable();
		table.integer("balance").unsigned().notNullable().defaultTo(0);
		table.integer("debt").notNullable().defaultTo(0);
		// table
		// 	.datetime("created_at")
		// 	.notNullable()
		// 	.defaultTo(moment().format("YYYY-MM-DD HH:mm:ss"));
		// table
		// 	.datetime("updated_at")
		// 	.notNullable()
		// 	.defaultTo(moment().format("YYYY-MM-DD HH:mm:ss"));
		addDefaultColumns(table);

		// Foreign key constraints
		table.foreign("user_id").references("user.id");
	});

	// "transaction" table used to be here, not anymore.
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable(tableNames.wallet);
	await knex.schema.dropTable(tableNames.user);
}
