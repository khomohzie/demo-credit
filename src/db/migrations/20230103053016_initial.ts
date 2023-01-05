import { Knex } from "knex";
import { orderedTableNames, tableNames } from "../table_names";

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
		table
			.enu("fin_status", ["broke", "rich"])
			.notNullable()
			.defaultTo("broke");
		table.boolean("can_transact").notNullable().defaultTo(false);
		addDefaultColumns(table);

		// Foreign key constraints
		table.foreign("user_id").references("user.id");
	});

	// "transaction" table used to be here, not anymore.
}

export async function down(knex: Knex): Promise<void> {
	await Promise.all(
		orderedTableNames.map((tableName) => knex.schema.dropTable(tableName))
	);
}
