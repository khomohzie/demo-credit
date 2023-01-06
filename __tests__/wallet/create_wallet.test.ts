import redisClient from "@utils/redis.util";
import request from "supertest";

const agent = request.agent(`http://localhost:${process.env.PORT}`);

describe("Create a wallet", () => {
	it("Should create wallet for a user", async () => {
		await redisClient
			.connect()
			.then(() => {
				console.log("🛠\tRedis - Connection open for testing");
			})
			.catch((err: any) => {
				console.log(err);
			});

		const accessToken = await redisClient.get("test_user_access_token");

		const response = await agent
			.post("/api/wallet/me")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				pin: "1234",
			})
			.expect(200);

		expect(response.body.message).toBe("Wallet created successfully");
		expect(response.body.meta.status).toBe("success");
		expect(response.body.data).toMatchObject({
			user_id: 3,
			wallet_tag: "dhritiramad",
			id: 3,
		});

		await redisClient.disconnect();
	});

	it("Should throw an error because wallet already exists", async () => {
		await redisClient
			.connect()
			.then(() => {
				console.log("🛠\tRedis - Connection open for testing");
			})
			.catch((err: any) => {
				console.log(err);
			});

		const accessToken = await redisClient.get("test_user_access_token");

		const response = await agent
			.post("/api/wallet/me")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				pin: "1234",
			})
			.expect(400);

		expect(response.body.message).toBe("You already have a wallet!");

		await redisClient.disconnect();
	});
});
