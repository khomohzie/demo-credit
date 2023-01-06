import redisClient from "@utils/redis.util";
import request from "supertest";

const agent = request.agent(`http://localhost:${process.env.PORT}`);

describe("Retrieve user(s) profile", () => {
	it("should respond to admin with an array of users", async () => {
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
			.get("/api/user/all")
			.set("Authorization", `Bearer ${accessToken}`)
			.expect(200);

		expect(response.body.data.length).toBeGreaterThanOrEqual(0);

		expect(response.body.message).toBe("Profiles retrieved successfully.");

		await redisClient.disconnect();
	});
});
