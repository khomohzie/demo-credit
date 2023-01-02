import knex, { Knex } from "knex";
import { Model } from "objection";

import { development } from "./knex.config";

// Create connection
export async function connect(): Promise<void> {
	const db: Knex<any, unknown[]> = knex(development);

	Model.knex(db);

	// Check that the connection works
	db.raw("SELECT VERSION()")
		.then(() => {
			console.log(`connection to knex was successful!`);
		})
		.catch((err: any) => {
			console.log(err);
		});
}

export async function disconnect(): Promise<void> {
	await knex(development)
		.destroy()
		.then(() => {
			console.log("Disconnected from knex");
		});
}
