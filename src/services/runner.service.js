const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const getExecutionDetails = (language, filePath) => {
    switch (language) {
        case "javascript":
            return {
                command: "node",
                args: [filePath]
            };

        case "python":
            return {
                command: "python",
                args: [filePath]
            };

        case "java":
            return {
                compile: {
                    command: "javac",
                    args: [filePath]
                },
                run: {
                    command: "java",
                    args: ["-cp", path.dirname(filePath), "Main"]
                }
            };

        default:
            throw new Error("Unsupported language");
    }
};

const runCode = async ({ code, testCases, language }) => {
    const fileName = `temp-${Date.now()}`;
    let filePath;

    // 🔹 Assign extension
    if (language === "javascript") filePath = path.join(__dirname, `${fileName}.js`);
    if (language === "python") filePath = path.join(__dirname, `${fileName}.py`);
    if (language === "java") filePath = path.join(__dirname, `Main.java`);

    fs.writeFileSync(filePath, code);

    const execDetails = getExecutionDetails(language, filePath);

    // 🔴 Step 1: Compile (Java only)
    if (language === "java") {
        const compileResult = await new Promise((resolve) => {
            const compile = spawn(execDetails.compile.command, execDetails.compile.args);

            let error = "";

            compile.stderr.on("data", (data) => {
                error += data.toString();
            });

            compile.on("close", () => {
                if (error) {
                    return resolve({
                        status: "Compilation Error",
                        error
                    });
                }
                resolve({ success: true });
            });
        });

        if (compileResult.status === "Compilation Error") {
            fs.unlinkSync(filePath);
            return compileResult;
        }
    }

    // 🔥 Step 2: Run for each test case
    for (let test of testCases) {
        const result = await new Promise((resolve) => {

            const process = spawn(
                execDetails.run ? execDetails.run.command : execDetails.command,
                execDetails.run ? execDetails.run.args : execDetails.args
            );

            let output = "";
            let error = "";

            process.stdout.on("data", (data) => {
                output += data.toString();
            });

            process.stderr.on("data", (data) => {
                error += data.toString();
            });

            process.stdin.write(test.input + "\n");
            process.stdin.end();

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

        if (result.status === "Runtime Error" || result.status === "Time Limit Exceeded") {
            cleanup(filePath, language);
            return result;
        }

        if (result.output !== test.output.trim()) {
            cleanup(filePath, language);
            return {
                status: "Wrong Answer",
                output: result.output
            };
        }
    }

    cleanup(filePath, language);

    return {
        status: "Accepted"
    };
};

// 🔹 Cleanup function
const cleanup = (filePath, language) => {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    // Java creates .class file
    if (language === "java") {
        const classFile = path.join(path.dirname(filePath), "Main.class");
        if (fs.existsSync(classFile)) fs.unlinkSync(classFile);
    }
};

module.exports = { runCode };