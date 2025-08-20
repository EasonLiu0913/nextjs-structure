import { test, expect } from '@playwright/test'

test.describe('Profile Management', () => {
  test.beforeEach(async ({ page }) => {
    // 登入流程
    await page.goto('/en/login')

    await page.waitForTimeout(2000)
    await page.fill('input[type="email"]', 'user@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // 等待重定向到儀表板
    await expect(page).toHaveURL(/\/en\/dashboard/)
    
    // 直接導航到個人資料頁面 (避免複雜的導航測試)
    await page.goto('/en/profile')
    await expect(page).toHaveURL(/\/en\/profile/)
  })

  test('should display profile form correctly', async ({ page }) => {
    // 檢查頁面標題
    await expect(page).toHaveTitle(/Profile/)
    
    // 檢查主要標題
    await expect(page.locator('h1:has-text("Profile")')).toBeVisible()
    await expect(page.locator('text=Manage your account settings and preferences.')).toBeVisible()
    
    // 檢查表單區塊
    await expect(page.locator('text=Personal Information')).toBeVisible()
    await expect(page.locator('text=Update your personal details and contact information.')).toBeVisible()
  })

  test('should display all form fields', async ({ page }) => {
    // 檢查所有表單欄位
    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="phone"]')).toBeVisible()
    await expect(page.locator('input[name="website"]')).toBeVisible()
    await expect(page.locator('input[name="location"]')).toBeVisible()
    await expect(page.locator('textarea[name="bio"]')).toBeVisible()
    
    // 檢查表單標籤
    await expect(page.locator('text=Full Name')).toBeVisible()
    await expect(page.locator('text=Email Address')).toBeVisible()
    await expect(page.locator('text=Phone Number')).toBeVisible()
    await expect(page.locator('text=Website')).toBeVisible()
    await expect(page.locator('text=Location')).toBeVisible()
    await expect(page.locator('text=Bio')).toBeVisible()
  })

  test('should validate required fields', async ({ page }) => {
    // 清空必填欄位
    await page.waitForTimeout(2000)
    await page.fill('input[name="name"]', '')
    await page.fill('input[name="email"]', '')
    
    // 點擊儲存按鈕
    await page.click('button[type="submit"]')
    
    // 等待表單處理完成
    await page.waitForSelector('input[name="name"]:not([disabled])', { timeout: 10000 })
    
    // 檢查驗證錯誤 - 使用中文錯誤訊息
    await expect(page.locator('p.text-destructive').filter({ hasText: '請輸入姓名' })).toBeVisible({ timeout: 10000 })
    await expect(page.locator('p.text-destructive').filter({ hasText: '請輸入電子郵件' })).toBeVisible({ timeout: 10000 })
  })

  test('should validate email format', async ({ page }) => {
    // 輸入無效的電子郵件
    await page.waitForTimeout(2000)
    await page.fill('input[name="email"]', 'invalid-email')
    await page.click('button[type="submit"]')
    
    // 等待表單處理完成
    await page.waitForSelector('input[name="name"]:not([disabled])', { timeout: 10000 })
    
    // 檢查電子郵件格式錯誤
    await expect(page.locator('p.text-destructive').filter({ hasText: '請輸入有效的電子郵件格式' })).toBeVisible({ timeout: 10000 })
  })

  test('should validate phone number format', async ({ page }) => {
    // 輸入無效的電話號碼 (包含不允許的字符)
    await page.waitForTimeout(2000)
    await page.fill('input[name="phone"]', 'abc123!@#')
    await page.click('button[type="submit"]')
    
    // 等待表單處理完成
    await page.waitForSelector('input[name="name"]:not([disabled])', { timeout: 10000 })
    
    // 檢查電話號碼格式錯誤
    await expect(page.locator('p.text-destructive').filter({ hasText: '請輸入有效的電話號碼' })).toBeVisible({ timeout: 10000 })
  })

  test('should validate website URL format', async ({ page }) => {
    // 輸入無效的網址
    await page.waitForTimeout(2000)
    await page.fill('input[name="website"]', 'invalid-url')
    await page.click('button[type="submit"]')
    
    // 等待表單處理完成
    await page.waitForSelector('input[name="name"]:not([disabled])', { timeout: 10000 })
    
    // 檢查網址格式錯誤
    await expect(page.locator('p.text-destructive').filter({ hasText: '請輸入有效的網址' })).toBeVisible({ timeout: 10000 })
  })

  test('should validate bio length', async ({ page }) => {
    // 輸入過長的個人簡介
    await page.waitForTimeout(2000)
    const longBio = 'a'.repeat(501)
    await page.fill('textarea[name="bio"]', longBio)
    await page.click('button[type="submit"]')
    
    // 等待表單處理完成
    await page.waitForSelector('input[name="name"]:not([disabled])', { timeout: 10000 })
    
    // 檢查長度限制錯誤
    await expect(page.locator('p.text-destructive').filter({ hasText: '個人簡介不能超過 500 個字元' })).toBeVisible({ timeout: 10000 })
  })

  test('should successfully update profile with valid data', async ({ page }) => {
    // 填寫有效的個人資料
    await page.waitForTimeout(2000)
    await page.fill('input[name="name"]', 'Updated Name')
    await page.fill('input[name="email"]', 'updated@example.com')
    await page.fill('input[name="phone"]', '+1234567890')
    await page.fill('input[name="website"]', 'https://example.com')
    await page.fill('input[name="location"]', 'New York, USA')
    await page.fill('textarea[name="bio"]', 'This is my updated bio.')
    
    // 點擊儲存按鈕
    await page.click('button[type="submit"]')
    
    // 等待表單處理完成
    await page.waitForSelector('input[name="name"]:not([disabled])', { timeout: 10000 })
    
    // 檢查成功訊息
    await expect(page.locator('text=Profile updated successfully')).toBeVisible()
  })

  test('should show loading state during form submission', async ({ page }) => {
    // 填寫表單
    await page.waitForTimeout(2000)
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'test@example.com')
    
    // 點擊儲存按鈕
    await page.click('button[type="submit"]')
    
    // 檢查載入狀態
    await expect(page.locator('text=Saving...')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeDisabled()
  })

  test('should handle form animations', async ({ page }) => {
    // 檢查表單欄位是否有動畫效果
    // 這可能需要等待動畫完成
    await page.waitForTimeout(1000)
    
    // 檢查所有欄位都已顯示
    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('textarea[name="bio"]')).toBeVisible()
  })

  test('should preserve form data on validation errors', async ({ page }) => {
    // 等待表單載入完成
    await page.waitForSelector('input[name="name"]:not([disabled])', { timeout: 10000 })
    
    // 清空並填寫部分有效資料和部分無效資料
    await page.waitForTimeout(2000)
    await page.fill('input[name="name"]', 'Valid Name')
    await page.fill('input[name="email"]', 'invalid-email')
    await page.fill('input[name="location"]', 'Valid Location')
    
    // 提交表單
    await page.click('button[type="submit"]')
    
    // 等待表單處理完成
    await page.waitForSelector('input[name="name"]:not([disabled])', { timeout: 10000 })
    
    // 檢查有效資料是否保留
    await expect(page.locator('input[name="name"]')).toHaveValue('Valid Name')
    await expect(page.locator('input[name="location"]')).toHaveValue('Valid Location')
    
    // 檢查錯誤訊息
    await expect(page.locator('p.text-destructive').filter({ hasText: '請輸入有效的電子郵件格式' })).toBeVisible({ timeout: 10000 })
  })

  test('should be responsive on mobile devices', async ({ page }) => {
    // 設定為行動裝置視窗大小
    await page.setViewportSize({ width: 375, height: 667 })
    
    // 檢查表單在行動裝置上的顯示
    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('textarea[name="bio"]')).toBeVisible()
    
    // 檢查按鈕是否正確顯示
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })
})