import express from "express";

const app = express();

const port = process.env.PORT || 3000;

app.get('/api/data', async (req, res) => {
    console.log(req.query);
    const query = req.query;
    res.json({
        message: 'Hello DHBW!',
        ...query
    });
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