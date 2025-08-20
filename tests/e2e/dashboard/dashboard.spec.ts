import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // 模擬已登入狀態
    await page.goto('/en/login')
    await page.waitForTimeout(2000)
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
    // 檢查統計卡片 (使用更具體的選擇器來避免衝突)
    await expect(page.locator('h3', { hasText: 'Total Users' })).toBeVisible()
    await expect(page.locator('h3', { hasText: 'Revenue' })).toBeVisible()
    await expect(page.locator('h3', { hasText: 'Orders' })).toBeVisible()
    await expect(page.locator('h3', { hasText: 'Activity' }).first()).toBeVisible()
    
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
    await expect(page.locator('text=2 minutes ago').first()).toBeVisible()
  })

  test('should display quick actions section', async ({ page }) => {
    // 檢查快速操作區塊
    await expect(page.locator('text=Quick Actions')).toBeVisible()
    await expect(page.locator('text=Common tasks and shortcuts')).toBeVisible()
    
    // 檢查操作按鈕 (使用主要區域來避免與標題衝突)
    await expect(page.locator('main').locator('text=Manage Users')).toBeVisible()
    await expect(page.locator('main').locator('text=View Reports')).toBeVisible()
    await expect(page.locator('main').locator('text=Analytics')).toBeVisible()
    await expect(page.locator('main').locator('text=Settings')).toBeVisible()
  })

  test('should have working navigation', async ({ page }) => {
    const viewportSize = await page.viewportSize()
    const isMobile = viewportSize && viewportSize.width < 768

    // 檢查導航連結 (使用桌面版導航，避免行動版衝突)
    if(!isMobile){
      await expect(page.locator('.hidden.md\\:flex').locator('text=Home')).toBeVisible()
      await expect(page.locator('.hidden.md\\:flex').locator('text=Dashboard')).toBeVisible()
      await expect(page.locator('.hidden.md\\:flex').locator('text=Profile')).toBeVisible()
    }
    else{
      // 行動版：先開啟選單
      await page.waitForTimeout(1000)
      await page.click('[aria-label="Menu"]')
      await page.waitForTimeout(1000)

      await expect(page.locator('.md\\:hidden').locator('text=Home')).toBeVisible()
      await expect(page.locator('.md\\:hidden').locator('text=Dashboard')).toBeVisible()
      await expect(page.locator('.md\\:hidden').locator('text=Profile')).toBeVisible()
    }
    
    // 測試導航到個人資料頁面
    if(!isMobile){
      await page.locator('.hidden.md\\:flex').locator('text=Profile').click()
      await expect(page).toHaveURL(/\/en\/profile/)
      await expect(page.locator('h1').first()).toBeVisible()
    }
    else{
      await page.locator('.md\\:hidden').locator('text=Profile').click()
      await expect(page).toHaveURL(/\/en\/profile/)
      await expect(page.locator('h1').first()).toBeVisible()
    }
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
    await page.waitForTimeout(2000)
    
    // 等待行動版導航元素
    await page.waitForSelector('[aria-label="Menu"]', { timeout: 10000 })

    // 檢查行動版導航
    await expect(page.locator('[aria-label="Menu"]')).toBeVisible()
    
    // 點擊選單按鈕
    await page.waitForTimeout(1000)
    await page.click('[aria-label="Menu"]')
    await page.waitForTimeout(1000)
    
    // 檢查行動版選單項目 (只在行動版選單中查找)
    await expect(page.locator('.md\\:hidden').locator('text=Home')).toBeVisible()
    await expect(page.locator('.md\\:hidden').locator('text=Dashboard')).toBeVisible()
    await expect(page.locator('.md\\:hidden').locator('text=Profile')).toBeVisible()
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