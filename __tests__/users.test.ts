import request from "supertest";

const agent = request.agent("http://localhost:4000");

describe("GET /api/user/all", () => {
	it("should respond with an array of users", async () => {
		const response = await agent.get("/api/user/all").expect(200);

		expect(response.body.data.length).toBeGreaterThanOrEqual(0);
	});
});
