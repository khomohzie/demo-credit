import { Knex } from "knex";

const addDefaultColumns = (table: Knex.CreateTableBuilder) => {
	table.timestamps(false, true);
	table.datetime("deleted_at");
};

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("user", (table) => {
		table.increments().primary().notNullable();
		table.string("email", 254).notNullable().unique();
		table.string("firstname", 50).notNullable();
		table.string("lastname", 50).notNullable();
		table.string("password", 127).notNullable();
		table.string("bvn", 11);
		table.string("avatar", 2000);
		table.enu("role", ["admin", "user"]).notNullable().defaultTo("user");
		addDefaultColumns(table);
	});

	await knex.schema.createTable("wallet", (table) => {
		table.increments().primary().notNullable();
		table.integer("user_id").unsigned().unique();
		table.string("wallet_tag").notNullable().unique();
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

	await knex.schema.createTable("transaction", (table) => {
		table.increments().primary().notNullable();
		table.integer("sender_id").unsigned();
		table.string("transaction_hash").notNullable().unique();
		table.integer("recipient_id").unsigned().notNullable();
		table.string("recipient_account").notNullable();
		table.string("description", 255);
		table
			.enu("category", ["deposit", "withdrawal", "transfer"])
			.notNullable();
		table.enu("status", ["pending", "successful", "failed"]).notNullable();
		addDefaultColumns(table);

		// Foreign key constraints
		table.foreign("sender_id").references("user.id");
		table.foreign("recipient_id").references("user.id");
		table
			.foreign("recipient_account")
			.references("account_number")
			.inTable("wallet");
	});
}

export async function down(knex: Knex): Promise<void> {
	await Promise.all(
		["user", "wallet", "transaction"].map((tableName) =>
			knex.schema.dropTable(tableName)
		)
	);
}
