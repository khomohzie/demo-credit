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
});
