const axios = require("axios");

const runCode = async ({ code, testCases, language }) => {
    try {
        const response = await axios.post(
            "http://localhost:5000/run",
            {
                code,
                testCases,
                language
            },
            { timeout: 10000 }
        );

        return response.data;
    } catch (error) {
        console.error("Runner service error:", error.message);
        return {
            status: "Error",
            error: error.message
        };
    }
};

module.exports = { runCode };