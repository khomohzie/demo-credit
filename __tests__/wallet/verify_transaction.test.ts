import redisClient from "@utils/redis.util";
import request from "supertest";

const agent = request.agent(`http://localhost:${process.env.PORT}`);

/**
 * The process of processing payments using paystack goes thus:
 * 1. Initialize the transaction as seen in the "fund_wallet.test.ts" file
 * 2. You will receive a checkout link from paystack to enter your details
 * 3. Verify the transaction using the reference.
 * What is missing here is the checkout step. There is no way to pause the test till I actually checkout.
 * Maybe setting a time interval before running this test will work but it is not clean.
 * //* So I am only testing for a failed transaction.
 */

describe("Verify a transaction", () => {
	it("Send a request to paystack's API to verify transaction - failed", async () => {
		await redisClient
			.connect()
			.then(() => {
				console.log("🛠\tRedis - Connection open for testing");
			})
			.catch((err: any) => {
				console.log(err);
			});

		const accessToken = await redisClient.get("test_admin_access_token");
		const reference = await redisClient.get("transaction_reference_id");

		const response = await agent
			.post("/api/transaction/verify")
			.set("Authorization", `Bearer ${accessToken}`)
			.query({ reference: reference! })
			.expect(400);

		expect(response.body.message).toBe(
			"Failed to fund account! Please try again."
		);

		await redisClient.disconnect();
	});
});
