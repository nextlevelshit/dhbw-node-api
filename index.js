import express from "express";
import {port} from "./src/config/constants.js";
import {Cache} from "./src/Cache.js";


const cache = new Cache();
const app = express();

app.use(express.json());

app.get("/api", async (req, res) => {
	console.log("GET /api requested");
	const keys = cache.keys();
	console.log(cache.cache);
	res.status(200).json({keys});
});

app.post("/api", async (req, res) => {
	console.log("POST /api requested");
	const body = req.body || {}
	const key = cache.create(body);
	console.log("Add new key", key, body);
	res.json({key});
});

app.all("/api/:key", async (req, res) => {
	try {
		const key = req.params.key;
		if (!key) {
			res.status(400).json({error: "Key is required"});
			return;
		}

		switch (req.method) {
			case "GET":
				const context = cache.get(key);
				if (!context) {
					res.status(404).json({error: "Key not found"});
					return;
				}
				res.json({key, context});
				break;
			case "PUT":
				console.log("PUT /api/:key requested");
				res.json({status: true});
				break;
			case "DELETE":
				if (cache.remove(key)) {
					res.json({status: true});
				} else {
					res.status(404).json({error: "Key not found"});
				}
		}
	} catch (error) {
		console.log("Error:", error.message);
		res.status(500).json({error: error.message});
	}
});

const server = app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

process.on("SIGINT", () => {
	console.log("Received SIGINT. Closing server...");
	server.close(() => {
		console.log("Server closed.");
		process.exit(0);
	});
});

process.on("SIGTERM", () => {
	console.log("Received SIGINT. Closing server...");
	server.close(() => {
		console.log("Server closed.");
		process.exit(0);
	});
});
