import {port} from "./src/config/constants";
import * as path from "node:path";

describe('API server', () => {
	const baseUrl = `http://localhost:${port}/api`;

	test('should connect to the server', async () => {
		const response = await fetch(baseUrl);
		expect(response.status).toBe(200);
	});

	test('should get cache keys', async () => {
		const response = await fetch(baseUrl);
		const json = await response.json();
		expect(json.keys).toBeDefined();
	});

	test('should create cache key', async () => {
		const response = await fetch(baseUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({test: true})
		});
		const json = await response.json();
		expect(response.status).toBe(200);
		expect(json.key).toBeDefined();
	});

	test('should create cache key and read', async () => {
		const responseCreate = await fetch(baseUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({test: true})
		});
		const json = await responseCreate.json();
		const key = json.key;

		const responseRead = await fetch(path.join(baseUrl, key));
		const jsonRead = await responseRead.json();

		expect(jsonRead.key).toBe(key);
		expect(jsonRead.context).toBeDefined();
	});

	test('should create and delete cache', async () => {
		const responseCreate = await fetch(baseUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({test: true})
		});
		const json = await responseCreate.json();

		expect(responseCreate.status).toBe(200);

		const responseDelete = await fetch(path.join(baseUrl, json.key), {
			method: "DELETE",
		});

		expect(responseDelete.status).toBe(200);
	});
});
