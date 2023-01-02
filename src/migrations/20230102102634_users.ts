import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return await knex.schema.createTable("users", (table) => {
		table.increments("id").primary();
		table.string("firstname");
		table.string("lastname");
		table.string("email");
		table.integer("role_id").unsigned();
	});
}

export async function down(knex: Knex): Promise<void> {
	return await knex.schema.dropTable("users");
}
