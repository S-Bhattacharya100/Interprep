const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const runCode = async ({ code, testCases, language }) => {
    const filePath = path.join(__dirname, `temp-${Date.now()}.js`);
    fs.writeFileSync(filePath, code);

    for (let test of testCases) {
        const result = await new Promise((resolve) => {

            const process = spawn("node", [filePath]);

            let output = "";
            let error = "";

            // Capture stdout
            process.stdout.on("data", (data) => {
                output += data.toString();
            });

            // Capture stderr
            process.stderr.on("data", (data) => {
                error += data.toString();
            });

            // Send input to stdin
            process.stdin.write(test.input);
            process.stdin.end();

            // Timeout protection
            const timeout = setTimeout(() => {
                process.kill();
                resolve({
                    status: "Time Limit Exceeded",
                    error: "Execution timed out"
                });
            }, 2000);

            process.on("close", () => {
                clearTimeout(timeout);

                if (error) {
                    return resolve({
                        status: "Runtime Error",
                        error
                    });
                }

                resolve({
                    output: output.trim()
                });
            });
        });

        // Handle runtime error
        if (result.status === "Runtime Error" || result.status === "Time Limit Exceeded") {
            fs.unlinkSync(filePath);
            return result;
        }

        // Compare output
        if (result.output !== test.output.trim()) {
            fs.unlinkSync(filePath);
            return {
                status: "Wrong Answer",
                output: result.output
            };
        }
    }

    fs.unlinkSync(filePath);

    return {
        status: "Accepted"
    };
};

module.exports = { runCode };