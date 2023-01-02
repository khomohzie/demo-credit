import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return await knex.schema.createTable("roles", (table) => {
		table.integer("id").primary().unsigned();
		table.string("role_name", 45).notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return await knex.schema.dropTable("roles");
}
