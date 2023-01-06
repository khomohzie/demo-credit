import { migrate, seed } from "@config/db";

export default async () => {
	await migrate();
	await seed();
};
