import { chromium, firefox, webkit } from "@playwright/test";

async function globalSetup(): Promise<void> {
  console.log("🚀 Starting global test setup...");

  try {
    // 設定測試資料（如果需要）
    console.log("🗄️ Setting up test data...");

    // 這裡可以設定測試資料庫、清理快取等
    // 例如：重置測試資料庫、建立測試使用者等

    // 檢查可用的瀏覽器並使用第一個可用的
    let browser;
    let browserName = "unknown";

    try {
      browser = await chromium.launch();
      browserName = "chromium";
    } catch (chromiumError) {
      console.log("⚠️ Chromium not available, trying Firefox...");
      try {
        browser = await firefox.launch();
        browserName = "firefox";
      } catch (firefoxError) {
        console.log("⚠️ Firefox not available, trying WebKit...");
        try {
          browser = await webkit.launch();
          browserName = "webkit";
        } catch (webkitError) {
          console.log("⚠️ No browsers available, skipping browser-based setup");
          console.log("✅ Global setup completed (no browser setup)");
          return;
        }
      }
    }

    console.log(`🌐 Using ${browserName} for setup`);
    const page = await browser.newPage();

    // Playwright's webServer should handle server startup
    // Just do basic setup tasks here
    console.log("⚡ Application should be started by Playwright webServer");

    // 預熱應用程式
    console.log("🔥 Warming up application...");
    try {
      await page.goto("http://localhost:3000/en", {
        waitUntil: "networkidle",
        timeout: 30000,
      });

      // 確認頁面載入成功
      const pageTitle = await page.title();
      console.log(`📄 Page loaded successfully: ${pageTitle}`);
    } catch (pageError) {
      console.log(
        "⚠️ Could not warm up application, server might not be ready yet",
      );
      console.log(
        "This is normal in CI environments where the server starts separately",
      );
    }

    await browser.close();
    console.log("✅ Global setup completed successfully");
  } catch (error) {
    console.error("❌ Global setup failed:", error);
    // 不要拋出錯誤，讓測試繼續執行
    console.log("⚠️ Continuing with tests despite setup issues");
  }
}

export default globalSetup;
