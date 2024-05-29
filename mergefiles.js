const fs = require("fs");
const path = require("path");
const ignore = require("ignore");

// Initialize ignore parser with .gitignore rules
const ig = ignore();
const gitignorePath = path.join(__dirname, ".gitignore");
if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath).toString();
  ig.add(gitignoreContent);
}

// File extensions to include
const extensions = [".js", ".toml", ".json", ".html"];
const outputFilePath = path.join(__dirname, "merged.txt");
let mergedContent = "";

// Function to read files recursively
const readFilesRecursively = (dir) => {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const relativePath = path.relative(__dirname, filePath);

    // Check if the file should be ignored or is mergefiles.js
    if (ig.ignores(relativePath) || file === "mergefiles.js") {
      return;
    }

    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      readFilesRecursively(filePath);
    } else if (extensions.includes(path.extname(file))) {
      const content = fs.readFileSync(filePath, "utf-8");
      const comment = `\n// ${relativePath}\n`;
      mergedContent += comment + content + "\n";
    }
  });
};

// Start reading from the current directory
readFilesRecursively(__dirname);

// Write the merged content to a .txt file
fs.writeFileSync(outputFilePath, mergedContent);

console.log("All content merged into", outputFilePath);
process.exit(0); // Ensure the script exits
