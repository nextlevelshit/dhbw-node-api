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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});