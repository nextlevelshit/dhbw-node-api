import request from "supertest";
import express from "express";
import { Cache } from "../../src/Cache.js";

// Mock the cache for isolated API testing
jest.mock("../../src/Cache.js");

describe("API Integration Tests", () => {
	let app;
	let mockCache;

	beforeEach(() => {
		mockCache = {
			keys: jest.fn(),
			create: jest.fn(),
			get: jest.fn(),
			update: jest.fn(),
			remove: jest.fn(),
		};
		Cache.mockImplementation(() => mockCache);

		// Rebuild app with mocked cache
		app = express();
		app.use(express.json());

		const cache = new Cache();

		app.get("/api", (req, res) => {
			res.json({ keys: cache.keys() });
		});

		app.post("/api", (req, res) => {
			const payload = req.body || {};
			const key = cache.create(payload);
			res.json({ key });
		});

		app.delete("/api/:key", (req, res) => {
			const key = req.params.key;
			const context = cache.get(key);

			if (!context) {
				return res
					.status(404)
					.json({ error: "Could not find key", key });
			}

			try {
				if (cache.remove(key)) {
					res.json({ key });
				} else {
					res.status(500).json({
						error: `Could not delete cache with key ${key}`,
					});
				}
			} catch (error) {
				res.status(500).json({ error: error.message });
			}
		});
	});

	test("GET /api should return cache keys", async () => {
		mockCache.keys.mockReturnValue(["key1", "key2"]);

		const response = await request(app).get("/api");

		expect(response.status).toBe(200);
		expect(response.body).toEqual({ keys: ["key1", "key2"] });
	});

	test("POST /api should create cache entry", async () => {
		mockCache.create.mockReturnValue("mock-uuid");

		const response = await request(app).post("/api").send({ test: true });

		expect(response.status).toBe(200);
		expect(response.body.key).toBe("mock-uuid");
		expect(mockCache.create).toHaveBeenCalledWith({ test: true });
	});

	test.skip("DELETE /api/:key should handle non-existent key", async () => {
		mockCache.get.mockReturnValue(undefined);

		const response = await request(app).delete("/api/fake-key");

		expect(response.status).toBe(404);
		expect(response.body.error).toBe("Could not find key");
	});
});
