import express from "express";
import { v4 as uuid } from "uuid";

const app = express();

app.use(express.json());

const port = process.env.PORT || 8080;

class Cache {
    constructor() {
        this.cache = new Map();

        this.cache.set("test", { wtf: false });
    }

    create(payload) {
        const key = uuid();
        this.cache.set(key, payload);
        return key;
    }

    keys() {
        return [...this.cache.keys()];
    }

    get(key) {
        return this.cache.get(key);
    }

    update(key, payload) {
        const context = this.get(key);
        this.cache.set(key, { ...context, ...payload });
        console.log(`Updated cache with key ${key}`, this.get(key));
        return this.get(key);
    }

    remove(key) {
        return this.cache.delete(key);
    }
}

const cache = new Cache();

app.get('/api', async (req, res) => {
    res.json({ keys: cache.keys() });
});

app.post('/api', async (req, res) => {
    const payload = req.body || {};
    const key = cache.create(payload);
    console.log("Cache created:", key);
    res.json({ key });
});

app.all('/api/:key', async (req, res) => {
    const key = req.params.key;
    const context = cache.get(key);
    const payload = req.body || {};

    if (!context) {
        res.status(404).json({ error: "Could not find key", key });
        return;
    }

    try {
        switch (req.method) {
            case "GET":
                res.json({ context });
                break;
            case "PUT":
                res.send({ context: cache.update(key, payload) });
                break;
            case "DELETE":
                if(cache.remove(key)) {
                    res.json({ key });
                } else {
                    res.status(500).json({ error: `Could not delete cache with key ${key}` });
                }
        }
    } catch (error) {
        console.log("Error:", error.message);
        res.status(500).json({ error: error.message });
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