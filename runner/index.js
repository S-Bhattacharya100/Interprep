const express = require("express");
const cors = require("cors");
const execute = require("./execute");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/run", async(req, res) => {
    try {
        const result = await execute(req.body);

        res.json(result);
    } catch(error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.listen(5000, () => {
    console.log("Runner service running on port 5000");
});