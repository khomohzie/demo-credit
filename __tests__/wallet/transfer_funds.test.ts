import { connect, disconnect } from "@config/db";
import redisClient from "@utils/redis.util";
import Wallet from "src/models/wallet.model";
import request from "supertest";

const agent = request.agent(`http://localhost:${process.env.PORT}`);

describe("Wallet funds transfer", () => {
	it("Should transfer funds to another user's wallet successfully", async () => {
		await redisClient
			.connect()
			.then(() => {
				console.log("🛠\tRedis - Connection open for testing");
			})
			.catch((err: any) => {
				console.log(err);
			});

		const accessToken = await redisClient.get("test_admin_access_token");

		// I need the next few lines to get the recipient account from the database
		await connect();

		const recipientWallet = await Wallet.query().findById(2);

		const response = await agent
			.put("/api/transaction/transfer")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				pin: "1234",
				recipient_account: recipientWallet?.account_number,
				description: "Use am chop life",
				amount: 10000,
			})
			.expect(200);

		expect(response.body.message).toBe("Transfer successful!");

		await redisClient.disconnect();
		await disconnect();
	});

	it("Should fail to transfer funds when sender inputs the wrong pin", async () => {
		await redisClient
			.connect()
			.then(() => {
				console.log("🛠\tRedis - Connection open for testing");
			})
			.catch((err: any) => {
				console.log(err);
			});

		const accessToken = await redisClient.get("test_admin_access_token");

		// I need the next few lines to get the recipient account from the database
		await connect();

		const recipientWallet = await Wallet.query().findById(2);

		const response = await agent
			.put("/api/transaction/transfer")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				pin: "0000",
				recipient_account: recipientWallet?.account_number,
				description: "Use am chop life",
				amount: 10000,
			})
			.expect(401);

		expect(response.body.message).toBe("Wrong pin!");

		await redisClient.disconnect();
		await disconnect();
	});

	it("Should fail to transfer to an invalid recipient wallet", async () => {
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
			.put("/api/transaction/transfer")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				pin: "1234",
				recipient_account: "027348901",
				description: "Use am chop life",
				amount: 10000,
			})
			.expect(400);

		expect(response.body.message).toBe("Invalid account details!");

		await redisClient.disconnect();
	});
});
