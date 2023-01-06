import { disconnect, rollback } from "@config/db";

export default async () => {
	await rollback();
	await disconnect();
};
