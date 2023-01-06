import request from "supertest";

const agent = request.agent(`http://localhost:${process.env.PORT}`);

jest.setTimeout(15000);

describe("Signup a user", () => {
	it("Should signup a new user", async () => {
		const response = await agent
			.post("/api/auth/signup")
			.send({
				firstname: "Dhriti",
				lastname: "Ramad",
				email: "example@test.com",
				password: "1234567890",
			})
			.expect(200);

		expect(
			response.body.message ==
				`A verification code has been sent to example@test.com` ||
				response.body.message ==
					"Failed to send verification email. Login and verify later."
		).toBeTruthy();
	});

	it("Should throw an error because details are missing", async () => {
		const response = await agent
			.post("/api/auth/signup")
			.send({
				firstname: "Dhriti",
				lastname: "Ramad",
				email: "number2@test.com",
				// password: "1234567890",
			})
			.expect(400);

		expect(response.body.message).toBe("Password is required");
	});

	it("Should throw an error because email already exists", async () => {
		const response = await agent
			.post("/api/auth/signup")
			.send({
				firstname: "Dhriti",
				lastname: "Ramad",
				email: "example@test.com",
				password: "1234567890",
			})
			.expect(400);

		expect(response.body.message).toBe("Email already taken!");
	});
});
