import knex, { Knex } from "knex";
import { Model } from "objection";

import { development, production, test } from "./knex.config";

const environment =
	process.env.NODE_ENV == "development"
		? development
		: process.env.NODE_ENV == "production"
		? production
		: test;

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

// Drop tables in database for testing
export async function rollback(): Promise<void> {
	await knex(environment).migrate.rollback();
}

// Pre-save values in database for testing
export async function seed(): Promise<void> {
	await knex(environment).seed.run();
}
