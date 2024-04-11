import express from "express";
import {port} from "./src/config/constants.js";
import {Cache} from "./src/Cache.js";


const cache = new Cache();
const app = express();

app.use(express.json());

app.get("/api", async (req, res) => {
	res.json({keys: cache.keys()});
});

app.post("/api", async (req, res) => {
	const payload = req.body || {};
	const key = cache.create(payload);
	console.log("Cache created:", key);
	res.json({key});
});

app.all("/api/:key", async (req, res) => {
	const key = req.params.key;
	const context = cache.get(key);
	const payload = req.body || {};

	if (!context) {
		res.status(404).json({error: "Could not find key", key});
		return;
	}

	try {
		switch (req.method) {
			case "GET":
				res.json({context});
				break;
			case "PUT":
				res.send({context: cache.update(key, payload)});
				break;
			case "DELETE":
				if (cache.remove(key)) {
					res.json({key});
				} else {
					res.status(500).json({error: `Could not delete cache with key ${key}`});
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
