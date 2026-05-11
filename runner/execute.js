const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const executeCode = ({ code }) => {
    return new Promise((resolve) => {

        const fileName = `temp-${Date.now()}.js`;
        const filePath = path.join(__dirname, fileName);

        fs.writeFileSync(filePath, code);

        exec(
            `docker run --rm -v "${filePath}:/app/code.js" node:18 node /app/code.js`,
            { timeout: 3000 },
            (error, stdout, stderr) => {

                fs.unlinkSync(filePath);

                if (error) {
                    return resolve({
                        status: "Runtime Error",
                        error: stderr || error.message
                    });
                }

                resolve({
                    status: "Success",
                    output: stdout.trim()
                });
            }
        );
    });
};

module.exports = executeCode;