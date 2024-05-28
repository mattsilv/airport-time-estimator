// src/testPageLoad.js
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.error("Console error detected:", msg.text());
      process.exit(1);
    }
  });

  await page.goto("http://localhost:3000");
  console.log("Page loaded successfully without console errors.");
  await browser.close();
  process.exit(0);
})();
