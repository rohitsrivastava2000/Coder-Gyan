import { exec } from "child_process";
import path from "path";

const extractErrorMessage = (stderr, language) => {
  const lines = stderr.split("\n");
  switch (language) {
    case "cpp":
      return lines.filter((l) => l.includes("main.cpp:")).join("\n").trim() || stderr;
    case "python":
      return lines.slice(-10).join("\n");
    case "java":
      return lines.filter((l) => l.includes("Main.java:")).join("\n").trim() || stderr;
    case "javascript":
      return lines.filter((l) => l.includes("SyntaxError") || l.includes("Error")).join("\n").trim() || stderr;
    default:
      return stderr;
  }
};

const RunCode = async (req, res) => {
  const { language, code, input = "" } = req.body;
  const fs = await import("fs/promises");

  if (!code) {
    return res.status(400).json({ success: false, message: "No Output" });
  }

  const langFileMap = {
    python: { ext: "py", file: "script.py" },
    cpp: { ext: "cpp", file: "main.cpp" },
    java: { ext: "java", file: "Main.java" },
    javascript: { ext: "js", file: "script.js" },
  };

  const lang = langFileMap[language];
  if (!lang) return res.status(400).send("Unsupported language");

  const codePath = `./Languages/${lang.file}`;
  const inputPath = `./Languages/input.txt`;
  await fs.writeFile(codePath, code);
  await fs.writeFile(inputPath, input);

  const dockerImage = `code-runner-${language}`;
  const volumePath = path.resolve("./Languages").replace(/\\/g, "/");
const dockerCmd = `docker run --rm -v "${volumePath}:/app" ${dockerImage}`;

  exec(dockerCmd, (err, stdout, stderr) => {
    if (err || stderr) {
      console.log(err || stderr);
      return res.status(200).json({
        success: false,
        message: extractErrorMessage(stderr || err.message, language),
      });
    }

    res.status(200).json({
      success: true,
      message: stdout,
    });
  });
};

export default RunCode;
