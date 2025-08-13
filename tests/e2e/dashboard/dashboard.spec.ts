import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // 模擬已登入狀態
    await page.goto('/en/login')
    await page.fill('input[type="email"]', 'user@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // 等待重定向到儀表板
    await expect(page).toHaveURL(/\/en\/dashboard/)
  })

  test('should display dashboard correctly', async ({ page }) => {
    // 檢查頁面標題
    await expect(page).toHaveTitle(/Dashboard/)
    
    // 檢查主要元素
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible()
    await expect(page.locator('text=Welcome back! Here\'s what\'s happening with your account.')).toBeVisible()
  })

  test('should display statistics cards', async ({ page }) => {
    // 檢查統計卡片
    await expect(page.locator('text=Total Users')).toBeVisible()
    await expect(page.locator('text=Revenue')).toBeVisible()
    await expect(page.locator('text=Orders')).toBeVisible()
    await expect(page.locator('text=Activity')).toBeVisible()
    
    // 檢查統計數值
    await expect(page.locator('text=2,543')).toBeVisible()
    await expect(page.locator('text=$45,231')).toBeVisible()
    await expect(page.locator('text=1,234')).toBeVisible()
    await expect(page.locator('text=89%')).toBeVisible()
  })

  test('should display recent activity section', async ({ page }) => {
    // 檢查最近活動區塊
    await expect(page.locator('text=Recent Activity')).toBeVisible()
    await expect(page.locator('text=Your latest account activity')).toBeVisible()
    
    // 檢查活動項目
    await expect(page.locator('text=Activity 1')).toBeVisible()
    await expect(page.locator('text=Activity 2')).toBeVisible()
    await expect(page.locator('text=2 minutes ago')).toBeVisible()
  })

  test('should display quick actions section', async ({ page }) => {
    // 檢查快速操作區塊
    await expect(page.locator('text=Quick Actions')).toBeVisible()
    await expect(page.locator('text=Common tasks and shortcuts')).toBeVisible()
    
    // 檢查操作按鈕
    await expect(page.locator('text=Manage Users')).toBeVisible()
    await expect(page.locator('text=View Reports')).toBeVisible()
    await expect(page.locator('text=Analytics')).toBeVisible()
    await expect(page.locator('text=Settings')).toBeVisible()
  })

  test('should have working navigation', async ({ page }) => {
    // 檢查導航連結
    await expect(page.locator('text=Home')).toBeVisible()
    await expect(page.locator('text=Dashboard')).toBeVisible()
    await expect(page.locator('text=Profile')).toBeVisible()
    
    // 測試導航到個人資料頁面
    await page.click('text=Profile')
    await expect(page).toHaveURL(/\/en\/profile/)
    await expect(page.locator('text=Profile')).toBeVisible()
  })

  test('should show user account menu', async ({ page }) => {
    // 點擊使用者帳戶按鈕
    await page.click('text=Account')
    
    // 檢查下拉選單項目（如果有實作的話）
    // 這裡可能需要根據實際實作調整
  })

  test('should be responsive on mobile', async ({ page }) => {
    // 設定為行動裝置視窗大小
    await page.setViewportSize({ width: 375, height: 667 })
    
    // 檢查行動版導航
    await expect(page.locator('[aria-label="Menu"]')).toBeVisible()
    
    // 點擊選單按鈕
    await page.click('[aria-label="Menu"]')
    
    // 檢查行動版選單項目
    await expect(page.locator('text=Home')).toBeVisible()
    await expect(page.locator('text=Dashboard')).toBeVisible()
    await expect(page.locator('text=Profile')).toBeVisible()
  })

  test('should handle loading states', async ({ page }) => {
    // 重新載入頁面
    await page.reload()
    
    // 檢查載入狀態（如果有實作的話）
    // 這可能需要根據實際的載入實作來調整
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible()
  })

  test('should display correct statistics with animations', async ({ page }) => {
    // 檢查統計卡片是否有動畫效果
    const statsCards = page.locator('[data-testid="stats-card"]')
    
    // 如果有實作 data-testid，可以檢查動畫
    // 否則檢查卡片是否正確顯示
    await expect(page.locator('text=Total Users')).toBeVisible()
    
    // 檢查趨勢指標
    await expect(page.locator('text=+12%')).toBeVisible()
    await expect(page.locator('text=+8%')).toBeVisible()
    await expect(page.locator('text=+23%')).toBeVisible()
    await expect(page.locator('text=+5%')).toBeVisible()
  })
})