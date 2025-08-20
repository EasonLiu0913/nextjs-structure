import { test, expect } from '@playwright/test'

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    // 導航到登入頁面
    await page.goto('/en/login')
  })

  test('should display login form correctly', async ({ page }) => {
    // 檢查頁面標題
    await expect(page).toHaveTitle(/Sign In/)
    
    // 檢查表單元素是否存在
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
    
    // 檢查表單標籤 (使用更具體的選擇器)
    await expect(page.locator('label', { hasText: 'Email' })).toBeVisible()
    await expect(page.locator('label', { hasText: 'Password' })).toBeVisible()
  })

  test('should show validation errors for empty fields', async ({ page }) => {
    // 點擊提交按鈕而不填寫任何欄位
    await page.click('button[type="submit"]')
    
    // 等待表單處理完成
    await page.waitForSelector('input[type="email"]:not([disabled])', { timeout: 10000 })
    
    // 等待驗證錯誤出現 (英文版本)
    await expect(page.locator('text=Please enter your email')).toBeVisible()
    await expect(page.locator('text=Please enter your password')).toBeVisible()
  })

  test('should show validation error for invalid email', async ({ page }) => {
    // 輸入無效的電子郵件
    await page.waitForTimeout(2000)
    await page.fill('input[type="email"]', 'invalid-email')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // 等待表單處理完成
    await page.waitForSelector('input[type="email"]:not([disabled])', { timeout: 10000 })
    
    // 檢查電子郵件驗證錯誤 (英文版本)
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    // 輸入錯誤的登入資訊
    await page.waitForTimeout(2000)
    await page.fill('input[type="email"]', 'wrong@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    
    // 等待表單處理完成
    await page.waitForSelector('input[type="email"]:not([disabled])', { timeout: 10000 })
    
    // 檢查錯誤訊息
    await expect(page.locator('text=Invalid email or password')).toBeVisible()
  })

  test('should successfully login with valid credentials', async ({ page }) => {
    // 輸入正確的登入資訊
    await page.waitForTimeout(2000)
    await page.fill('input[type="email"]', 'user@example.com')
    await page.fill('input[type="password"]', 'password123')
    
    // 點擊登入按鈕
    await page.click('button[type="submit"]')
    
    // 檢查是否重定向到儀表板
    await expect(page).toHaveURL(/\/en\/dashboard/)
    await expect(page.locator('h1', { hasText: 'Dashboard' })).toBeVisible()
  })

  test('should toggle password visibility', async ({ page }) => {
    // 使用 name 屬性來定位密碼輸入框，因為 type 會改變
    const passwordInput = page.locator('input[name="password"]')
    const toggleButton = page.locator('button[aria-label="Toggle password visibility"]')
    
    // 初始狀態應該是密碼類型
    await expect(passwordInput).toHaveAttribute('type', 'password')
    
    // 點擊切換按鈕
    await toggleButton.click()
    
    // 應該變成文字類型
    await expect(passwordInput).toHaveAttribute('type', 'text')
    
    // 再次點擊應該變回密碼類型
    await toggleButton.click()
    await expect(passwordInput).toHaveAttribute('type', 'password')
  })

  test('should navigate to register page', async ({ page }) => {
    // 點擊註冊連結
    await page.click('a[href*="/register"]')
    
    // 檢查是否導航到註冊頁面
    await expect(page).toHaveURL(/\/en\/register/)
    await expect(page.locator('h2', { hasText: 'Create Account' })).toBeVisible()
  })

  test('should show loading state during submission', async ({ page }) => {
    // 填寫表單
    await page.waitForTimeout(2000)
    await page.fill('input[type="email"]', 'user@example.com')
    await page.fill('input[type="password"]', 'password123')
    
    // 點擊提交按鈕
    await page.click('button[type="submit"]')
    
    // 檢查載入狀態
    await expect(page.locator('text=Signing in...')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeDisabled()
  })
})