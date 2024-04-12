import express from "express";
import {port} from "./src/config/constants.js";
import {Cache} from "./src/Cache.js";


const cache = new Cache();
const app = express();

app.use(express.json());

app.get("/api", async (req, res) => {
	console.log("GET /api requested");
	const keys = cache.keys();
	res.status(200).json({keys});
});

app.post("/api", async (req, res) => {
	console.log("POST /api requested");
	res.json({status: true});
});

app.all("/api/:key", async (req, res) => {
	try {
		switch (req.method) {
			case "GET":
				console.log("GET /api/:key requested");
				res.json({status: true});
				break;
			case "PUT":
				console.log("PUT /api/:key requested");
				res.json({status: true});
				break;
			case "DELETE":
				console.log("DELETE /api/:key requested");
				res.json({status: true});
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
