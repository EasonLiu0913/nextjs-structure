import { test, expect } from '@playwright/test'

test.describe('Internationalization', () => {
  test('should redirect to default locale when accessing root', async ({ page }) => {
    // 訪問根路徑
    await page.goto('/')
    
    // 應該重定向到預設語言 (en)
    await expect(page).toHaveURL(/\/en/)
  })

  test('should display content in English by default', async ({ page }) => {
    await page.goto('/en')
    
    // 檢查英文內容
    await expect(page.locator('text=Welcome to Next.js 15 Enterprise App')).toBeVisible()
    await expect(page.locator('text=Get Started')).toBeVisible()
    await expect(page.locator('text=Learn More')).toBeVisible()
  })

  test('should display content in Chinese when locale is zh', async ({ page }) => {
    await page.goto('/zh')
    
    // 檢查中文內容
    await expect(page.locator('text=歡迎使用 Next.js 15 企業級應用')).toBeVisible()
    await expect(page.locator('text=開始使用')).toBeVisible()
    await expect(page.locator('text=了解更多')).toBeVisible()
  })

  test('should switch language using language switcher', async ({ page }) => {
    await page.goto('/en')
    
    // 檢查是否為行動版
    const viewportSize = await page.viewportSize()
    const isMobile = viewportSize && viewportSize.width < 768
    
    if (isMobile) {
      // 行動版：先開啟選單
      await page.waitForTimeout(1000)
      await page.click('[aria-label="Menu"]')
      await page.waitForTimeout(1000)

      // 點擊語言切換器(手機)
      await page.click('.md\\:hidden [aria-label="Language switcher"]')
    }
    else{
      // 點擊語言切換器(桌機)
      await page.click('.flex [aria-label="Language switcher"]')
    }
    
    // 等待下拉選單出現
    await page.waitForTimeout(500)
    
    // 檢查語言選項 - 使用更具體的選擇器避免與主按鈕衝突
    await expect(page.locator('button:not([aria-label])').filter({ hasText: '🇺🇸' })).toBeVisible({ timeout: 10000 })
    await expect(page.locator('button:not([aria-label])').filter({ hasText: '🇹🇼' })).toBeVisible({ timeout: 10000 })
    
    // 切換到中文
    await page.click('text=中文')
    
    // 檢查 URL 是否變更
    await expect(page).toHaveURL(/\/zh/, { timeout: 10000 })
    
    // 檢查內容是否變為中文
    await expect(page.locator('text=歡迎使用 Next.js 15 企業級應用')).toBeVisible({ timeout: 10000 })
  })

  test('should maintain language preference across navigation', async ({ page }) => {
    // 從中文頁面開始
    await page.goto('/zh')
    
    // 導航到其他頁面
    await page.click('text=了解更多')
    
    // 檢查 URL 是否保持中文語言
    await expect(page).toHaveURL(/\/zh\/about/, { timeout: 10000 })
  })

  test('should show 404 page in correct language', async ({ page }) => {
    // 訪問不存在的英文頁面
    await page.goto('/en/non-existent-page')
    
    // 檢查英文 404 頁面 - 使用自定義 404 頁面
    await expect(page.locator('h1').filter({ hasText: '404' })).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=The page you are looking for does not exist or has been moved')).toBeVisible({ timeout: 10000 })
    
    // 訪問不存在的中文頁面
    await page.goto('/zh/non-existent-page')
    
    // 檢查中文 404 頁面
    await expect(page.locator('h1').filter({ hasText: '404' })).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=您要查找的頁面不存在或已被移動')).toBeVisible({ timeout: 10000 })
  })

  test('should handle authentication pages in different languages', async ({ page }) => {
    // 英文登入頁面
    await page.goto('/en/login')
    await expect(page.locator('button[type="submit"]').filter({ hasText: 'Sign In' })).toBeVisible({ timeout: 10000 })
    await expect(page.locator('label').filter({ hasText: 'Email' })).toBeVisible()
    await expect(page.locator('label').filter({ hasText: 'Password' })).toBeVisible()
    
    // 中文登入頁面
    await page.goto('/zh/login')
    await expect(page.locator('button[type="submit"]').filter({ hasText: '登入' })).toBeVisible({ timeout: 10000 })
    await expect(page.locator('label').filter({ hasText: '電子郵件' })).toBeVisible()
    await expect(page.locator('label').filter({ hasText: '密碼' })).toBeVisible()
  })

  test('should handle form validation messages in correct language', async ({ page }) => {
    // 英文表單驗證
    await page.goto('/en/login')
    await page.click('button[type="submit"]')
    
    // 等待表單處理完成
    await page.waitForSelector('input[type="email"]:not([disabled])', { timeout: 10000 })
    
    await expect(page.locator('text=Please enter your email')).toBeVisible({ timeout: 10000 })
    
    // 中文表單驗證
    await page.goto('/zh/login')
    await page.click('button[type="submit"]')
    
    // 等待表單處理完成
    await page.waitForSelector('input[type="email"]:not([disabled])', { timeout: 10000 })
    
    // Check for validation message - Chinese validation is working!
    await expect(page.locator('text=請輸入電子郵件')).toBeVisible({ timeout: 10000 })
  })

  test('should preserve language in URL after form submission', async ({ page }) => {
    // 在中文頁面提交表單
    await page.goto('/zh/login')
    await page.waitForTimeout(2000)
    await page.fill('input[type="email"]', 'user@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // 檢查重定向後的 URL 是否保持中文
    await expect(page).toHaveURL(/\/zh\/dashboard/, { timeout: 10000 })
  })

  test('should handle navigation menu in different languages', async ({ page }) => {
    const viewportSize = await page.viewportSize()
    const isMobile = viewportSize && viewportSize.width < 768

    if (!isMobile){
      // 英文導航
      await page.goto('/en')
      await expect(page.locator('text=Home')).toBeVisible()
      await expect(page.locator('text=Dashboard')).toBeVisible()
      await expect(page.locator('text=Profile')).toBeVisible()
      
      // 中文導航
      await page.goto('/zh')
      await expect(page.locator('text=首頁')).toBeVisible()
      await expect(page.locator('text=儀表板')).toBeVisible()
      await expect(page.locator('text=個人資料')).toBeVisible()
    }
    else{
      // 英文導航
      await page.goto('/en')
      
      // 行動版：先開啟選單
      await page.waitForTimeout(1000)
      await page.click('[aria-label="Menu"]')
      await page.waitForTimeout(1000)

      await expect(page.getByRole('link', { name: 'Home' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'Profile' })).toBeVisible()
      
      // 中文導航
      await page.goto('/zh')

      // 行動版：先開啟選單
      await page.waitForTimeout(1000)
      await page.click('[aria-label="Menu"]')
      await page.waitForTimeout(1000)
      
      await expect(page.getByRole('link', { name: '首頁' })).toBeVisible()
      await expect(page.getByRole('link', { name: '儀表板' })).toBeVisible()
      await expect(page.getByRole('link', { name: '個人資料' })).toBeVisible()
    }
  })

  test('should handle footer content in different languages', async ({ page }) => {
    // 英文頁尾
    await page.goto('/en')
    await expect(page.locator('text=All rights reserved.')).toBeVisible()
    await expect(page.locator('text=Privacy Policy')).toBeVisible()
    
    // 中文頁尾
    await page.goto('/zh')
    await expect(page.locator('text=版權所有。')).toBeVisible()
    await expect(page.locator('text=隱私政策')).toBeVisible()
  })
})