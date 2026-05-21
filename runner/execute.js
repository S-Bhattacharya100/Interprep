const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const executeCode = ({ code, testCases, language }) => {
    return new Promise((resolve) => {
        const fileName = `temp-${Date.now()}.js`;
        const filePath = path.resolve(__dirname, fileName);

        fs.writeFileSync(filePath, code);
        const dockerPath = filePath.replace(/\\/g, '/');

        let testIndex = 0;
        let allTestsResults = [];

        const runNextTest = () => {
            if (testIndex >= testCases.length) {
                try { fs.unlinkSync(filePath); } catch (e) {}
                return resolve({
                    status: "Accepted",
                    results: allTestsResults
                });
            }

            const testCase = testCases[testIndex];
            const inputBuffer = Buffer.from(testCase.input, 'utf-8');
            const inputBase64 = inputBuffer.toString('base64');

            const dockerCmd = `docker run --rm -i -v "${dockerPath}:/app/code.js" node:18 sh -c "echo '${inputBase64}' | base64 -d | node /app/code.js"`;

            exec(
                dockerCmd,
                { timeout: 5000 },
                (error, stdout, stderr) => {
                    const output = stdout.trim();
                    const expected = testCase.output.trim();

                    if (error) {
                        try { fs.unlinkSync(filePath); } catch (e) {}
                        return resolve({
                            status: "Runtime Error",
                            error: stderr || error.message,
                            failedTestCase: testIndex + 1
                        });
                    }

                    if (output !== expected) {
                        try { fs.unlinkSync(filePath); } catch (e) {}
                        return resolve({
                            status: "Wrong Answer",
                            failedTestCase: testIndex + 1,
                            output,
                            expected
                        });
                    }

                    allTestsResults.push({
                        testCase: testIndex + 1,
                        status: "Passed",
                        output
                    });

                    testIndex++;
                    runNextTest();
                }
            );
        };

        runNextTest();
    });
};

module.exports = executeCode;