import { port } from "../../src/config/constants.js";

describe("E2E Server Tests", () => {
	const baseUrl = `http://localhost:${port}/api`;
	let server;

	beforeAll(async () => {
		// Start actual server
		const { default: app } = await import("../../index.js");
		// Assumes you export the server instance
	});

	afterAll(async () => {
		if (server) {
			await new Promise((resolve) => server.close(resolve));
		}
	});

	test("should handle full cache lifecycle", async () => {
		// Create
		const createResponse = await fetch(baseUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: "integration-test" }),
		});
		const { key } = await createResponse.json();
		expect(createResponse.status).toBe(200);

		// Read
		const readResponse = await fetch(`${baseUrl}/${key}`);
		const { context } = await readResponse.json();
		expect(context.name).toBe("integration-test");

		// Update
		const updateResponse = await fetch(`${baseUrl}/${key}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ updated: true }),
		});
		expect(updateResponse.status).toBe(200);

		// Delete
		const deleteResponse = await fetch(`${baseUrl}/${key}`, {
			method: "DELETE",
		});
		expect(deleteResponse.status).toBe(200);
	});
});
