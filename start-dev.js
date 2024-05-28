// start-dev.js
const { execSync } = require("child_process");

if (process.env.NODE_ENV !== "production") {
  console.log("Running mergefiles.js for local development...");
  execSync("node mergefiles.js", { stdio: "inherit" });
}

// Start the React application
execSync("react-scripts start", { stdio: "inherit" });
