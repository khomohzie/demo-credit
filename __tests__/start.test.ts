import request from "supertest";

describe("/", () => {
	const agent = request.agent("http://localhost:4000");

	it("should return 200", async () => {
		const response = await agent.get("/");
		expect(response.status).toBe(200);
	});
});
