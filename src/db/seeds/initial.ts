import { Knex } from "knex";
import { encrypt } from "@utils/auth.util";
import { orderedTableNames, tableNames } from "../table_names";

export async function seed(knex: Knex): Promise<void> {
	// Deletes ALL existing entries
	await orderedTableNames.reduce(async (promise, table_name) => {
		await promise;

		console.log("Clearing existing data:", table_name);
		return knex(table_name).del();
	}, Promise.resolve());

	const hashedPassword = await encrypt.password("hunterhexhunter");
	const hashedPin = await encrypt.password("1234");

	const user = {
		email: "komozy2000@gmail.com",
		firstname: "Daniel",
		lastname: "Komolafe",
		password: hashedPassword,
		role: "admin",
	};

	// Inserts seed entries
	await knex(tableNames.user).insert(user);

	await knex(tableNames.wallet).insert([
		{
			user_id: 1,
			wallet_tag: "danielkomolafe",
			account_number: "00299312568",
			pin: hashedPin,
		},
	]);
}
