const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const getLanguageConfig = (language) => {
    const configs = {
        javascript: {
            extension: "js",
            image: "node:18-alpine",
            fileName: (timestamp) => `temp-${timestamp}.js`,
            containerPath: "/app/code.js",
            buildCmd: null,
            runCmd: "node /app/code.js"
        },
        python: {
            extension: "py",
            image: "python:3.11-alpine",
            fileName: (timestamp) => `temp-${timestamp}.py`,
            containerPath: "/app/code.py",
            buildCmd: null,
            runCmd: "python /app/code.py"
        },
        java: {
            extension: "java",
            image: "openjdk:11-jdk-alpine",
            fileName: (timestamp) => `Main.java`,
            containerPath: "/app/Main.java",
            buildCmd: "cd /app && javac Main.java",
            runCmd: "cd /app && java Main"
        },
        cpp: {
            extension: "cpp",
            image: "gcc:11-alpine",
            fileName: (timestamp) => `temp-${timestamp}.cpp`,
            containerPath: "/app/code.cpp",
            buildCmd: "g++ -o /app/code /app/code.cpp",
            runCmd: "/app/code"
        }
    };

    return configs[language.toLowerCase()] || configs.javascript;
};

const executeCode = ({ code, testCases, language }) => {
    return new Promise((resolve) => {
        const config = getLanguageConfig(language);
        const timestamp = Date.now();
        const fileName = config.fileName(timestamp);
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
                    results: allTestsResults,
                    language: language
                });
            }

            const testCase = testCases[testIndex];
            const inputBuffer = Buffer.from(testCase.input, 'utf-8');
            const inputBase64 = inputBuffer.toString('base64');

            let dockerCmd;
            if (config.buildCmd) {
                dockerCmd = `docker run --rm -i -v "${dockerPath}:${config.containerPath}" ${config.image} sh -c "${config.buildCmd} && echo '${inputBase64}' | base64 -d | ${config.runCmd}"`;
            } else {
                dockerCmd = `docker run --rm -i -v "${dockerPath}:${config.containerPath}" ${config.image} sh -c "echo '${inputBase64}' | base64 -d | ${config.runCmd}"`;
            }

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
                            failedTestCase: testIndex + 1,
                            language: language
                        });
                    }

                    if (output !== expected) {
                        try { fs.unlinkSync(filePath); } catch (e) {}
                        return resolve({
                            status: "Wrong Answer",
                            failedTestCase: testIndex + 1,
                            output,
                            expected,
                            language: language
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