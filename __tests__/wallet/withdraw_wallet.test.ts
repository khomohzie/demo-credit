import redisClient from "@utils/redis.util";
import request from "supertest";

const agent = request.agent(`http://localhost:${process.env.PORT}`);

describe("Withdraw from wallet", () => {
	it("Should withdraw funds from wallet successfully", async () => {
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
			.post("/api/wallet/withdraw")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				pin: "1234",
				description: "debit",
				amount: 10000,
			})
			.expect(200);

		expect(response.body.message).toBe("Withdrawal successful!");

		await redisClient.disconnect();
	});

	it("Should fail to withdraw funds when user inputs the wrong pin", async () => {
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
			.post("/api/wallet/withdraw")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				pin: "0000",
				description: "Use am chop life",
				amount: 10000,
			})
			.expect(401);

		expect(response.body.message).toBe("Wrong pin!");

		await redisClient.disconnect();
	});

	it("Should fail to withdraw due to insufficient balance", async () => {
		// First, login the user
		const loginResponse = await agent
			.post("/api/auth/login")
			.send({
				email: "brokie@lol.com",
				password: "hunterhexhunter",
			})
			.expect(200);

		const response = await agent
			.post("/api/wallet/withdraw")
			.set(
				"Authorization",
				`Bearer ${loginResponse.body.data.accessToken}`
			)
			.send({
				pin: "1234",
				description: "Use am chop life",
				amount: 20000, // A value <= 10000 will cause this test to fail
				//because money has been transferred to this user in a previous test
			})
			.expect(400);

		expect(response.body.message).toBe("You do not have that much money");
	});
});
