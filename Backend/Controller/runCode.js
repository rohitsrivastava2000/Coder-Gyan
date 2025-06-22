import { exec } from "child_process";
import path from "path";

// import le from '../'

const extractErrorMessage = (stderr, language) => {
  const lines = stderr.split("\n");
  switch (language) {
    case "cpp":
      return (
        lines
          .filter((l) => l.includes("main.cpp:"))
          .join("\n")
          .trim() || stderr
      );
    case "python":
      return lines.slice(-10).join("\n"); // last 10 lines of traceback
    case "java":
      return (
        lines
          .filter((l) => l.includes("main.java:"))
          .join("\n")
          .trim() || stderr
      );
    case "javascript":
      return (
        lines
          .filter((l) => l.includes("SyntaxError") || l.includes("Error"))
          .join("\n")
          .trim() || stderr
      );
    default:
      return stderr;
  }
};

const RunCode = async (req, res) => {
  console.log("i am coming");
  const { language, code, input = "" } = req.body;
  const fs = await import("fs/promises");

  if (!code) {
    return res.status(400).json({
      success: false,
      message: "No Output",
    });
  }
  console.log("jiiiiiiiiiiiiiiiiiiii");
  console.log(language);
  console.log(code);
  console.log(input);
  console.log("jiiiiiiiiiiiiiiiiiii");

  // Map language info
  const langFileMap = {
    python: { ext: "py", dockerfile: "Dockerfile.python" },
    cpp: { ext: "cpp", dockerfile: "Dockerfile.cpp" },
    java: { ext: "java", dockerfile: "Dockerfile.java" },
    javascript: { ext: "js", dockerfile: "Dockerfile.js" },
  };

  const lang = langFileMap[language] || [];
  console.log(lang);
  if (!lang) return res.status(400).send("Unsupported language");

  const filePath = `./Languages/${language}-runner.${lang.ext}`;
  const inputPath = `./Languages/input.txt`;
  await fs.writeFile(filePath, code); // overwrite code
  await fs.writeFile(inputPath, input);

  const dockerImage = `code-runner-${language}`;
  const dockerfilePath = `Dockerfiles/${lang.dockerfile}`;

  // Build the Docker image
  //TODO Handling the Error as an ouput part
  exec(
    `docker build -f ${dockerfilePath} -t ${dockerImage} .`,
    (err, stdout, stderr) => {
      if (err) {
        const cleanError = extractErrorMessage(stderr || err.message, language);
        return res.status(200).json({ success: false, message: cleanError });
      }

      // Run the image
      exec(`docker run --rm ${dockerImage}`, (err2, stdout2, stderr2) => {
        if (err2 || stderr2) {
          return res.status(200).json({
            success: false,
            message: stderr2 || err2.message,
          });
        }

        res.status(200).json({
          success: true,
          message: stdout2,
        });
      });
    }
  );
};

export default RunCode;
