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
    
    // 點擊語言切換器
    await page.click('[aria-label="Language switcher"]')
    
    // 檢查語言選項
    await expect(page.locator('text=English')).toBeVisible()
    await expect(page.locator('text=中文')).toBeVisible()
    
    // 切換到中文
    await page.click('text=中文')
    
    // 檢查 URL 是否變更
    await expect(page).toHaveURL(/\/zh/)
    
    // 檢查內容是否變為中文
    await expect(page.locator('text=歡迎使用 Next.js 15 企業級應用')).toBeVisible()
  })

  test('should maintain language preference across navigation', async ({ page }) => {
    // 從中文頁面開始
    await page.goto('/zh')
    
    // 導航到其他頁面
    await page.click('text=了解更多')
    
    // 檢查 URL 是否保持中文語言
    await expect(page).toHaveURL(/\/zh\/about/)
  })

  test('should show 404 page in correct language', async ({ page }) => {
    // 訪問不存在的英文頁面
    await page.goto('/en/non-existent-page')
    
    // 檢查英文 404 頁面
    await expect(page.locator('text=Page Not Found')).toBeVisible()
    await expect(page.locator('text=Return Home')).toBeVisible()
    
    // 訪問不存在的中文頁面
    await page.goto('/zh/non-existent-page')
    
    // 檢查中文 404 頁面（如果有翻譯的話）
    await expect(page.locator('text=頁面未找到')).toBeVisible()
  })

  test('should handle authentication pages in different languages', async ({ page }) => {
    // 英文登入頁面
    await page.goto('/en/login')
    await expect(page.locator('text=Sign In')).toBeVisible()
    await expect(page.locator('text=Email')).toBeVisible()
    await expect(page.locator('text=Password')).toBeVisible()
    
    // 中文登入頁面
    await page.goto('/zh/login')
    await expect(page.locator('text=登入')).toBeVisible()
    await expect(page.locator('text=電子郵件')).toBeVisible()
    await expect(page.locator('text=密碼')).toBeVisible()
  })

  test('should handle form validation messages in correct language', async ({ page }) => {
    // 英文表單驗證
    await page.goto('/en/login')
    await page.click('button[type="submit"]')
    await expect(page.locator('text=Please enter your email')).toBeVisible()
    
    // 中文表單驗證
    await page.goto('/zh/login')
    await page.click('button[type="submit"]')
    await expect(page.locator('text=請輸入電子郵件')).toBeVisible()
  })

  test('should preserve language in URL after form submission', async ({ page }) => {
    // 在中文頁面提交表單
    await page.goto('/zh/login')
    await page.fill('input[type="email"]', 'user@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // 檢查重定向後的 URL 是否保持中文
    await expect(page).toHaveURL(/\/zh\/dashboard/)
  })

  test('should handle navigation menu in different languages', async ({ page }) => {
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