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

	const admin = {
		email: "komozy2000@gmail.com",
		firstname: "Daniel",
		lastname: "Komolafe",
		password: hashedPassword,
		role: "admin",
		verified: true,
	};

	const user = {
		firstname: "Brokie",
		lastname: "Broke",
		email: "brokie@lol.com",
		password: hashedPassword,
		role: "user",
		verified: true,
	};

	// Inserts seed entries
	await knex(tableNames.user).insert(admin);

	await knex(tableNames.user).insert(user);

	await knex(tableNames.wallet).insert([
		{
			user_id: 1,
			balance: 100000,
			wallet_tag: "danielkomolafe",
			account_number: "00299312568",
			pin: hashedPin,
		},
	]);

	await knex(tableNames.wallet).insert([
		{
			user_id: 2,
			wallet_tag: "brokiebroke",
			account_number: "824949212",
			pin: hashedPin,
		},
	]);
}
