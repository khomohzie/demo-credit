import { Knex } from "knex";
import { tableNames } from "../table_names";

const addDefaultColumns = (table: Knex.CreateTableBuilder) => {
	table.timestamps(false, true);
	table.datetime("deleted_at");
};

export async function up(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists(tableNames.transaction);

	await knex.schema.createTable(tableNames.reference, (table) => {
		table.increments().primary().notNullable();
		table.string("reference_id").notNullable().unique();
		table.integer("sender_id").unsigned().notNullable();
		table.integer("recipient_id").unsigned().notNullable();
		table.string("recipient_account").notNullable();
		table.integer("amount").unsigned().notNullable();
		table.boolean("is_successful").notNullable().defaultTo(false);
		addDefaultColumns(table);

		// Foreign key constraints
		table.foreign("sender_id").references("user.id");
		table.foreign("recipient_id").references("user.id");
		table
			.foreign("recipient_account")
			.references("account_number")
			.inTable("wallet");
	});

	await knex.schema.createTableIfNotExists(
		tableNames.transaction,
		(table) => {
			table.increments().primary().notNullable();
			table.integer("sender_id").unsigned().notNullable();
			table.string("transaction_hash").notNullable().unique();
			table.integer("recipient_id").unsigned();
			table.string("recipient_account").notNullable();
			table.string("description", 255);
			table.integer("amount").unsigned().notNullable();
			table
				.enu("category", ["deposit", "withdrawal", "transfer"])
				.notNullable();
			table
				.enu("status", ["pending", "successful", "failed"])
				.notNullable();
			addDefaultColumns(table);

			// Foreign key constraints
			table.foreign("sender_id").references("user.id");
			table.foreign("recipient_id").references("user.id");
			table
				.foreign("transaction_hash")
				.references("reference.reference_id");
			table
				.foreign("recipient_account")
				.references("account_number")
				.inTable("wallet");
		}
	);
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable(tableNames.transaction);
	await knex.schema.dropTable(tableNames.reference);
}
