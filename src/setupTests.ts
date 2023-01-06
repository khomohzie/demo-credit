import { migrate } from "@config/db";

export default async () => {
	await migrate();
};
