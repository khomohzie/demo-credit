import redisClient from "@utils/redis.util";
import request from "supertest";

const agent = request.agent(`http://localhost:${process.env.PORT}`);

describe("Fund a user's wallet", () => {
	it("Should fund/add money to a user's wallet", async () => {
		await redisClient
			.connect()
			.then(() => {
				console.log("🛠\tRedis - Connection open for testing");
			})
			.catch((err: any) => {
				console.log(err);
			});

		const accessToken = await redisClient.get("test_admin_access_token");

		const response = await agent
			.post("/api/wallet/fund")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				description: "credit",
				amount: 10000,
			})
			.expect(201);

		// Save the reference id in redis so we can use it for the "verify transaction" test
		await redisClient.set(
			"transaction_reference_id",
			response.body.data.reference,
			{
				EX: 60,
			}
		);

		expect(response.body.message).toBe(
			"Paystack payment initialization successful"
		);

		await redisClient.disconnect();
	});

	it("Should not fund an unverified user's wallet", async () => {
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
			.post("/api/wallet/fund")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				description: "credit",
				amount: 10000,
			})
			.expect(403);

		expect(response.body.message).toBe(
			"Verify your email to use this service."
		);

		await redisClient.disconnect();
	});
});
