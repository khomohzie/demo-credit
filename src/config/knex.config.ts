import path from "path";

require("dotenv").config({ path: path.join(__dirname, "../../.env") });

import { Knex } from "knex";

const development = {
	client: "mysql2",
	connection: {
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
	},
	pool: { min: 0, max: 7 },
	debug: true,
	migrations: {
		directory: path.join(__dirname, "../db/migrations"),
	},
	seeds: {
		directory: path.join(__dirname, "../db/seeds"),
	},
} as Knex.Config;

const test = {
	client: "mysql2",
	connection: {
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME_TEST,
	},
	pool: { min: 0, max: 7 },
	migrations: {
		directory: path.join(__dirname, "../db/migrations"),
	},
	seeds: {
		directory: path.join(__dirname, "../db/seeds"),
	},
} as Knex.Config;

const production = {
	client: "mysql2",
	connection: {
		host: process.env.DB_HOST_PROD,
		port: process.env.DB_PORT_PROD,
		user: process.env.DB_USER_PROD,
		password: process.env.DB_PASSWORD_PROD,
		database: process.env.DB_NAME_PROD,
	},
	pool: { min: 0, max: 7 },
	migrations: {
		directory: path.join(__dirname, "../db/migrations"),
	},
	seeds: {
		directory: path.join(__dirname, "../db/seeds"),
	},
} as Knex.Config;

export { development, test, production };
