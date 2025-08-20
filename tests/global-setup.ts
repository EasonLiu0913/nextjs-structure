import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global test setup...')
  
  // 啟動瀏覽器進行設定
  const browser = await chromium.launch()
  const page = await browser.newPage()
  
  try {
    // Playwright's webServer should handle server startup
    // Just do basic setup tasks here
    console.log('⚡ Application should be started by Playwright webServer')
    
    // 設定測試資料（如果需要）
    console.log('🗄️ Setting up test data...')
    
    // 這裡可以設定測試資料庫、清理快取等
    // 例如：重置測試資料庫、建立測試使用者等
    
    // 預熱應用程式
    console.log('🔥 Warming up application...')
    await page.goto('http://localhost:3000/en', { waitUntil: 'networkidle' })
    
    // 確認頁面載入成功
    const pageTitle = await page.title()
    console.log(`📄 Page loaded successfully: ${pageTitle}`)
    
    console.log('✅ Global setup completed successfully')
    
  } catch (error) {
    console.error('❌ Global setup failed:', error)
    throw error
  } finally {
    await browser.close()
  }
}

export default globalSetup