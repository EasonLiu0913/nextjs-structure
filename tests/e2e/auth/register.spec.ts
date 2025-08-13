import { test, expect } from '@playwright/test'

test.describe('Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    // 導航到註冊頁面
    await page.goto('/en/register')
  })

  test('should display registration form correctly', async ({ page }) => {
    // 檢查頁面標題
    await expect(page).toHaveTitle(/Create Account/)
    
    // 檢查表單元素是否存在
    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
    
    // 檢查表單標籤
    await expect(page.locator('text=Full Name')).toBeVisible()
    await expect(page.locator('text=Email')).toBeVisible()
    await expect(page.locator('text=Password')).toBeVisible()
    await expect(page.locator('text=Confirm Password')).toBeVisible()
  })

  test('should show validation errors for empty fields', async ({ page }) => {
    // 點擊提交按鈕而不填寫任何欄位
    await page.click('button[type="submit"]')
    
    // 等待驗證錯誤出現
    await expect(page.locator('text=請輸入姓名')).toBeVisible()
    await expect(page.locator('text=請輸入電子郵件')).toBeVisible()
    await expect(page.locator('text=密碼至少需要 8 個字元')).toBeVisible()
  })

  test('should validate password requirements', async ({ page }) => {
    // 輸入弱密碼
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'weak')
    await page.fill('input[name="confirmPassword"]', 'weak')
    await page.click('button[type="submit"]')
    
    // 檢查密碼強度錯誤
    await expect(page.locator('text=密碼至少需要 8 個字元')).toBeVisible()
  })

  test('should validate password confirmation', async ({ page }) => {
    // 輸入不匹配的密碼
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'Password123')
    await page.fill('input[name="confirmPassword"]', 'DifferentPassword123')
    await page.click('button[type="submit"]')
    
    // 檢查密碼確認錯誤
    await expect(page.locator('text=密碼確認不一致')).toBeVisible()
  })

  test('should show error for existing email', async ({ page }) => {
    // 輸入已存在的電子郵件
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'existing@example.com')
    await page.fill('input[name="password"]', 'Password123')
    await page.fill('input[name="confirmPassword"]', 'Password123')
    await page.click('button[type="submit"]')
    
    // 檢查錯誤訊息
    await expect(page.locator('text=User already exists with this email')).toBeVisible()
  })

  test('should successfully register with valid data', async ({ page }) => {
    // 輸入有效的註冊資訊
    await page.fill('input[name="name"]', 'New User')
    await page.fill('input[name="email"]', 'newuser@example.com')
    await page.fill('input[name="password"]', 'Password123')
    await page.fill('input[name="confirmPassword"]', 'Password123')
    
    // 點擊註冊按鈕
    await page.click('button[type="submit"]')
    
    // 檢查是否重定向到登入頁面
    await expect(page).toHaveURL(/\/en\/login/)
    await expect(page.locator('text=Sign In')).toBeVisible()
  })

  test('should toggle password visibility for both fields', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]')
    const confirmPasswordInput = page.locator('input[name="confirmPassword"]')
    const passwordToggle = page.locator('input[name="password"]').locator('..').locator('button')
    const confirmPasswordToggle = page.locator('input[name="confirmPassword"]').locator('..').locator('button')
    
    // 初始狀態應該是密碼類型
    await expect(passwordInput).toHaveAttribute('type', 'password')
    await expect(confirmPasswordInput).toHaveAttribute('type', 'password')
    
    // 切換密碼可見性
    await passwordToggle.click()
    await expect(passwordInput).toHaveAttribute('type', 'text')
    
    await confirmPasswordToggle.click()
    await expect(confirmPasswordInput).toHaveAttribute('type', 'text')
  })

  test('should navigate to login page', async ({ page }) => {
    // 點擊登入連結
    await page.click('text=Sign in')
    
    // 檢查是否導航到登入頁面
    await expect(page).toHaveURL(/\/en\/login/)
    await expect(page.locator('text=Sign In')).toBeVisible()
  })

  test('should show loading state during submission', async ({ page }) => {
    // 填寫表單
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'Password123')
    await page.fill('input[name="confirmPassword"]', 'Password123')
    
    // 點擊提交按鈕
    await page.click('button[type="submit"]')
    
    // 檢查載入狀態
    await expect(page.locator('text=Creating account...')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeDisabled()
  })
})