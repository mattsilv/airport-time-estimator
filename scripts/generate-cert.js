const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const os = require("os");

const certDir = path.join(__dirname, "..", "certificates");

// Get local IP address
const getLocalIpAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const interfaceName of Object.keys(interfaces)) {
    const addresses = interfaces[interfaceName];
    for (const addr of addresses) {
      if (addr.family === "IPv4" && !addr.internal) {
        return addr.address;
      }
    }
  }
  return "192.168.9.82"; // Fallback to your specified IP
};

// Create certificates directory if it doesn't exist
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir);
}

try {
  console.log("Installing mkcert via npm if not installed...");
  try {
    execSync("npm list -g mkcert", { stdio: "ignore" });
  } catch {
    execSync("npm install -g mkcert", { stdio: "inherit" });
  }

  // Change to the certificates directory
  process.chdir(certDir);

  const localIP = getLocalIpAddress();
  console.log(`Using local IP address: ${localIP}`);

  console.log("Creating CA...");
  execSync("mkcert create-ca", { stdio: "inherit" });

  // Rename CA files to match expected names
  fs.renameSync("ca.key", "ca-key.pem");
  fs.renameSync("ca.crt", "ca-cert.pem");

  console.log("Generating certificates...");
  execSync(
    `mkcert create-cert \
      --domains "localhost,127.0.0.1,${localIP},*.${localIP}" \
      --cert cert.pem \
      --key key.pem \
      --ca-key ca-key.pem \
      --ca-cert ca-cert.pem \
      --validity 365`,
    { stdio: "inherit" }
  );

  // Copy CA cert to system store location
  if (process.platform === "darwin") {
    console.log("Installing CA certificate in system trust store...");
    const caCertPath = path.join(certDir, "ca-cert.pem");
    if (fs.existsSync(caCertPath)) {
      execSync(
        `sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain "${caCertPath}"`,
        { stdio: "inherit" }
      );
    } else {
      console.error("CA certificate not found at:", caCertPath);
    }
  }

  // For development machine, also add localhost certificate
  if (process.platform === "darwin" || process.platform === "win32") {
    console.log("Adding development certificate...");
    execSync(
      `mkcert create-cert \
        --domains "localhost,127.0.0.1" \
        --cert localhost-cert.pem \
        --key localhost-key.pem \
        --ca-key ca-key.pem \
        --ca-cert ca-cert.pem \
        --validity 365`,
      { stdio: "inherit" }
    );
  }

  console.log("SSL certificates generated successfully!");
} catch (error) {
  console.error("Error generating certificates:", error.message);
  process.exit(1);
}