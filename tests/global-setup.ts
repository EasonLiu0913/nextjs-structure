import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global test setup...')
  
  // 啟動瀏覽器進行設定
  const browser = await chromium.launch()
  const page = await browser.newPage()
  
  try {
    // 檢查應用程式是否正在運行
    console.log('📡 Checking if application is running...')
    await page.goto('http://localhost:3000/api/health', { timeout: 10000 })
    
    const response = await page.textContent('body')
    const healthData = JSON.parse(response || '{}')
    
    if (healthData.status === 'ok') {
      console.log('✅ Application is running and healthy')
    } else {
      throw new Error('Application health check failed')
    }
    
    // 設定測試資料（如果需要）
    console.log('🗄️ Setting up test data...')
    
    // 這裡可以設定測試資料庫、清理快取等
    // 例如：重置測試資料庫、建立測試使用者等
    
    // 預熱應用程式
    console.log('🔥 Warming up application...')
    await page.goto('http://localhost:3000/en')
    await page.waitForLoadState('networkidle')
    
    console.log('✅ Global setup completed successfully')
    
  } catch (error) {
    console.error('❌ Global setup failed:', error)
    throw error
  } finally {
    await browser.close()
  }
}

export default globalSetup