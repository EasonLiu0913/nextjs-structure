import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en')
  })

  test('should display main navigation correctly', async ({ page }) => {
    // 檢查主導航元素
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.locator('text=NextApp')).toBeVisible() // Logo
    await expect(page.locator('text=Home')).toBeVisible()
    await expect(page.locator('text=Dashboard')).toBeVisible()
    await expect(page.locator('text=Profile')).toBeVisible()
  })

  test('should navigate to different pages correctly', async ({ page }) => {
    // 測試首頁導航
    await page.click('text=Home')
    await expect(page).toHaveURL(/\/en\/$/)
    
    // 測試儀表板導航（需要登入）
    await page.click('text=Dashboard')
    // 如果未登入，應該重定向到登入頁面
    await expect(page).toHaveURL(/\/en\/login/)
    
    // 登入後再測試
    await page.fill('input[type="email"]', 'user@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // 現在應該能訪問儀表板
    await expect(page).toHaveURL(/\/en\/dashboard/)
    
    // 測試個人資料導航
    await page.click('text=Profile')
    await expect(page).toHaveURL(/\/en\/profile/)
  })

  test('should show active navigation state', async ({ page }) => {
    // 登入以訪問受保護的頁面
    await page.goto('/en/login')
    await page.fill('input[type="email"]', 'user@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // 檢查儀表板的活動狀態
    await expect(page.locator('nav a[href*="dashboard"]')).toHaveClass(/active|text-primary/)
    
    // 導航到個人資料
    await page.click('text=Profile')
    await expect(page.locator('nav a[href*="profile"]')).toHaveClass(/active|text-primary/)
  })

  test('should handle mobile navigation', async ({ page }) => {
    // 設定為行動裝置視窗大小
    await page.setViewportSize({ width: 375, height: 667 })
    
    // 檢查行動版選單按鈕
    await expect(page.locator('[aria-label="Menu"]')).toBeVisible()
    
    // 桌面版導航應該隱藏
    await expect(page.locator('nav a:has-text("Home")')).not.toBeVisible()
    
    // 點擊選單按鈕
    await page.click('[aria-label="Menu"]')
    
    // 檢查行動版選單
    await expect(page.locator('text=Home')).toBeVisible()
    await expect(page.locator('text=Dashboard')).toBeVisible()
    await expect(page.locator('text=Profile')).toBeVisible()
    
    // 測試行動版導航
    await page.click('text=Home')
    await expect(page).toHaveURL(/\/en\/$/)
  })

  test('should display user account menu when logged in', async ({ page }) => {
    // 登入
    await page.goto('/en/login')
    await page.fill('input[type="email"]', 'user@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // 檢查使用者帳戶選單
    await expect(page.locator('text=Account')).toBeVisible()
    
    // 點擊帳戶選單（如果有下拉選單的話）
    await page.click('text=Account')
    
    // 檢查選單項目（根據實際實作調整）
    // await expect(page.locator('text=Settings')).toBeVisible()
    // await expect(page.locator('text=Logout')).toBeVisible()
  })

  test('should handle language switcher in navigation', async ({ page }) => {
    // 檢查語言切換器
    await expect(page.locator('[aria-label="Language switcher"]')).toBeVisible()
    
    // 點擊語言切換器
    await page.click('[aria-label="Language switcher"]')
    
    // 檢查語言選項
    await expect(page.locator('text=English')).toBeVisible()
    await expect(page.locator('text=中文')).toBeVisible()
    
    // 切換語言
    await page.click('text=中文')
    
    // 檢查導航是否更新為中文
    await expect(page.locator('text=首頁')).toBeVisible()
    await expect(page.locator('text=儀表板')).toBeVisible()
  })

  test('should handle breadcrumb navigation', async ({ page }) => {
    // 登入並導航到深層頁面
    await page.goto('/en/login')
    await page.fill('input[type="email"]', 'user@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    await page.goto('/en/profile')
    
    // 檢查麵包屑導航（如果有實作的話）
    // await expect(page.locator('nav[aria-label="Breadcrumb"]')).toBeVisible()
    // await expect(page.locator('text=Home')).toBeVisible()
    // await expect(page.locator('text=Profile')).toBeVisible()
  })

  test('should handle navigation with keyboard', async ({ page }) => {
    // 使用 Tab 鍵導航
    await page.keyboard.press('Tab')
    
    // 檢查焦點是否在第一個導航項目上
    await expect(page.locator('a:focus')).toBeVisible()
    
    // 使用 Enter 鍵激活連結
    await page.keyboard.press('Enter')
    
    // 檢查是否正確導航
    // 這需要根據實際的鍵盤導航實作來調整
  })

  test('should handle external links correctly', async ({ page }) => {
    // 如果有外部連結，檢查是否在新視窗開啟
    // 這需要根據實際的外部連結實作來調整
    
    // 檢查頁尾的外部連結
    await expect(page.locator('footer')).toBeVisible()
    
    // 測試外部連結（如果有的話）
    // const [newPage] = await Promise.all([
    //   page.context().waitForEvent('page'),
    //   page.click('a[target="_blank"]')
    // ])
    // await expect(newPage).toHaveURL(/external-site/)
  })

  test('should maintain navigation state during page transitions', async ({ page }) => {
    // 登入
    await page.goto('/en/login')
    await page.fill('input[type="email"]', 'user@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // 在頁面間導航
    await page.click('text=Profile')
    await page.click('text=Dashboard')
    
    // 檢查導航狀態是否正確維持
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.locator('text=Account')).toBeVisible()
  })
})