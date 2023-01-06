import redisClient from "@utils/redis.util";
import request from "supertest";

const agent = request.agent(`http://localhost:${process.env.PORT}`);

describe("Admin retrieve user(s) profile", () => {
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

	it("should respond to admin with a user's profile", async () => {
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
			.get(`/api/user/data/${3}`)
			.set("Authorization", `Bearer ${accessToken}`)
			.expect(200);

		expect(response.body.data).toMatchObject({
			id: 3,
			email: "example@test.com",
			firstname: "Dhriti",
			lastname: "Ramad",
		});

		expect(response.body.message).toBe("Profile retrieved successfully.");

		await redisClient.disconnect();
	});

	it("should fail to retrieve users - user is not an admin", async () => {
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
			.get("/api/user/all")
			.set("Authorization", `Bearer ${accessToken}`)
			.expect(403);

		expect(response.body.message).toBe("Unauthorized!");
		expect(response.body.meta.reason).toBe(
			"Account could not be verified as admin"
		);

		await redisClient.disconnect();
	});
});

describe("A user can retrieve their profile", () => {
	it("should respond to user with their profile", async () => {
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
			.get("/api/user/me")
			.set("Authorization", `Bearer ${accessToken}`)
			.expect(200);

		expect(response.body.data).toMatchObject({
			id: 3,
			email: "example@test.com",
			firstname: "Dhriti",
			lastname: "Ramad",
		});

		expect(response.body.message).toBe("Profile retrieved successfully.");

		await redisClient.disconnect();
	});
});
