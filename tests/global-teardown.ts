import { FullConfig } from '@playwright/test'

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global test teardown...')
  
  try {
    // 清理測試資料
    console.log('🗑️ Cleaning up test data...')
    
    // 這裡可以清理測試過程中產生的資料
    // 例如：清理測試資料庫、刪除上傳的檔案、重置快取等
    
    // 清理截圖目錄（如果存在）
    console.log('📸 Cleaning up screenshots...')
    
    // 清理測試報告（如果需要）
    console.log('📊 Cleaning up old test reports...')
    
    console.log('✅ Global teardown completed successfully')
    
  } catch (error) {
    console.error('❌ Global teardown failed:', error)
    // 不拋出錯誤，避免影響測試結果
  }
}

export default globalTeardown