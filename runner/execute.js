const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const executeCode = ({ code, testCases, language }) => {
    return new Promise((resolve) => {

        const fileName = `temp-${Date.now()}.js`;
        const filePath = path.resolve(__dirname, fileName);

        fs.writeFileSync(filePath, code);

        // Get first test case input
        const input = testCases[0].input;

        // Convert Windows path to Docker-compatible path
        const dockerPath = filePath.replace(/\\/g, '/');

        // Use printf to pass input via stdin
        const dockerCmd = `docker run --rm -i -v "${dockerPath}:/app/code.js" node:18 sh -c "printf '${input}' | node /app/code.js"`;

        exec(
            dockerCmd,
            { timeout: 5000 },
            (error, stdout, stderr) => {

                // Clean up temp file
                try { fs.unlinkSync(filePath); } catch (e) {}

                if (error) {
                    return resolve({
                        status: "Runtime Error",
                        error: stderr || error.message
                    });
                }

                const output = stdout.trim();
                const expected = testCases[0].output.trim();

                if (output !== expected) {
                    return resolve({
                        status: "Wrong Answer",
                        output,
                        expected: expected
                    });
                }

                resolve({
                    status: "Accepted",
                    output
                });
            }
        );
    });
};

module.exports = executeCode;