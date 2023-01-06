import redisClient from "@utils/redis.util";
import request from "supertest";

const agent = request.agent(`http://localhost:${process.env.PORT}`);

describe("Login a user", () => {
	it("Should login an existing user", async () => {
		const response = await agent
			.post("/api/auth/login")
			.send({
				email: "example@test.com",
				password: "1234567890",
			})
			.expect(200);

		expect(response.body.message).toBe("Welcome back!");

		expect(response.body.meta).toMatchObject({
			type: "success",
			action: "Login",
		});
	});

	it("Should throw an incorrect password error", async () => {
		const response = await agent
			.post("/api/auth/login")
			.send({
				email: "example@test.com",
				password: "123456780",
			})
			.expect(401);

		expect(response.body.message).toBe("Password is incorrect!");
	});

	it("Should throw an error because email does not exist", async () => {
		const response = await agent
			.post("/api/auth/login")
			.send({
				email: "number2@test.com",
				password: "1234567890",
			})
			.expect(404);

		expect(response.body.message).toBe("Email does not exist!");
	});

	// Note: this user already exists in db due to seeding in the setupTests.ts
	it("Should save the access token in redis after login", async () => {
		const response = await agent
			.post("/api/auth/login")
			.send({
				email: "komozy2000@gmail.com",
				password: "hunterhexhunter",
			})
			.expect(200);

		await redisClient
			.connect()
			.then(() => {
				console.log("🛠\tRedis - Connection open for testing");
			})
			.catch((err: any) => {
				console.log(err);
			});

		// Save access token in redis
		await redisClient.set(
			"test_admin_access_token",
			response.body.data.accessToken,
			{
				EX: 60,
			}
		);

		// Verify that it is saved in redis
		const accessToken = await redisClient.get("test_admin_access_token");

		expect(accessToken).toBe(response.body.data.accessToken);

		expect(response.body.message).toBe("Welcome back!");

		expect(response.body.meta).toMatchObject({
			type: "success",
			action: "Login",
		});

		await redisClient.disconnect();
	});
});
