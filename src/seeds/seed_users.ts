import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
	// Deletes ALL existing entries
	await knex("users").del();

	// Inserts seed entries
	await knex("users").insert([
		{
			firstname: "Daniel",
			lastname: "Komolafe",
			email: "komozy2000@gmail.com",
			role_id: 1,
		},
	]);
}
