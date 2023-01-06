import knex, { Knex } from "knex";
import { Model } from "objection";

import { development, test } from "./knex.config";

const environment = process.env.NODE_ENV == "test" ? test : development;

// Create connection
export async function connect(): Promise<void> {
	const db: Knex<any, unknown[]> = knex(environment);

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
	await knex(environment)
		.destroy()
		.then(() => {
			console.log("Disconnected from knex");
		});
}

// Create tables in database for testing
export async function migrate(): Promise<void> {
	await knex(environment).migrate.latest();
}

// Create tables in database for testing
export async function rollback(): Promise<void> {
	await knex(environment).migrate.rollback();
}
