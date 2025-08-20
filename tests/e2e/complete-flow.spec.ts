import { test, expect } from '@playwright/test'
import { TestCommands } from '../support/commands'

// Test user data
const userData = {
  newUser: {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'TestPassword123',
    confirmPassword: 'TestPassword123'
  },
  validUser: {
    email: 'user@example.com',
    password: 'password123'
  },
  invalidUser: {
    email: 'wrong@example.com',
    password: 'wrongpassword'
  },
  profileUpdateData: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Software developer passionate about creating amazing user experiences.'
  }
}

test.describe('Complete User Flow', () => {
  let commands: TestCommands

  test.beforeEach(async ({ page }) => {
    commands = new TestCommands(page)
  })

  test('complete user journey: register → login → profile update → logout', async ({ page }) => {
    // 1. 註冊新使用者
    await page.goto('/en/register')

    const { newUser } = userData
    await page.waitForTimeout(2000)
    await page.fill('input[name="name"]', newUser.name)
    await page.fill('input[name="email"]', newUser.email)
    await page.fill('input[name="password"]', newUser.password)
    await page.fill('input[name="confirmPassword"]', newUser.confirmPassword)
    await page.click('button[type="submit"]')

    // 應該重定向到登入頁面
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 })

    // 2. 登入 (使用已知的測試認證)
    await page.waitForTimeout(2000)
    await page.fill('input[type="email"]', 'user@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')

    // Wait for successful authentication
    await expect(page).toHaveURL(/\/en\/dashboard/, { timeout: 10000 })

    // 3. 查看儀表板內容
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Total Users')).toBeVisible()
    await expect(page.locator('text=Recent Activity')).toBeVisible()
    await expect(page.locator('text=Quick Actions')).toBeVisible()

    // 4. 導航到個人資料頁面
    const viewportSize = await page.viewportSize()
    const isMobile = viewportSize && viewportSize.width < 768

    if (!isMobile) {
      await page.click('nav a[href*="/profile"]')
    }
    else {
      // 行動版：先開啟選單
      await page.waitForTimeout(1000)
      await page.click('[aria-label="Menu"]')
      await page.waitForTimeout(1000)

      await page.click('.md\\:hidden nav a[href*="/profile"]')
    }

    await expect(page).toHaveURL(/\/en\/profile/, { timeout: 10000 })

    // 5. 更新個人資料
    const { profileUpdateData } = userData
    await commands.fillProfileForm(profileUpdateData)
    await commands.submitForm()

    // 檢查成功訊息
    await expect(page.locator('text=Profile updated successfully')).toBeVisible()

    // 6. 驗證資料已更新
    // 等待表單重新載入完成
    await page.waitForSelector('input[name="name"]:not([disabled])', { timeout: 10000 })

    // 檢查名稱欄位的值
    const nameInput = page.locator('input[name="name"]')
    await expect(nameInput).toBeVisible()
    await expect(nameInput).toHaveValue(profileUpdateData.name)

    // 檢查電子郵件欄位的值
    const emailInput = page.locator('input[name="email"]')
    await expect(emailInput).toBeVisible()
    await expect(emailInput).toHaveValue(profileUpdateData.email)

    // 7. 登出
    await commands.logout()

    // 應該重定向到首頁
    await expect(page).toHaveURL(/\/en\//)
  })

  test('complete authentication error handling flow', async ({ page }) => {
    // 1. 嘗試訪問受保護的頁面
    await page.goto('/en/dashboard')

    // 應該重定向到登入頁面
    await expect(page).toHaveURL(/\/en\/login/)

    // 2. 嘗試使用錯誤的認證資訊登入
    const { invalidUser } = userData
    await page.waitForTimeout(2000)
    await page.fill('input[type="email"]', invalidUser.email)
    await page.fill('input[type="password"]', invalidUser.password)
    await page.click('button[type="submit"]')

    // 檢查錯誤訊息
    await expect(page.locator('text=Invalid email or password')).toBeVisible()

    // 3. 使用正確的認證資訊登入
    const { validUser } = userData
    await page.waitForTimeout(2000)
    await page.fill('input[type="email"]', validUser.email)
    await page.fill('input[type="password"]', validUser.password)
    await page.click('button[type="submit"]')

    // 應該成功登入並重定向
    await expect(page).toHaveURL(/\/en\/dashboard/)

    // 4. 現在應該能訪問受保護的頁面
    await page.goto('/en/profile')
    await expect(page).toHaveURL(/\/en\/profile/)
    await expect(page.locator('h1:has-text("Profile")')).toBeVisible()
  })

  test('complete internationalization flow', async ({ page }) => {
    const viewportSize = await page.viewportSize()
    const isMobile = viewportSize && viewportSize.width < 768

    // 1. 從英文開始
    await page.goto('/en')
    await expect(page.locator('text=Welcome to Next.js 15 Enterprise App')).toBeVisible({ timeout: 10000 })

    // 2. 切換到中文
    await commands.switchLanguage('zh')
    await expect(page.locator('text=歡迎使用 Next.js 15 企業級應用')).toBeVisible({ timeout: 10000 })

    // 3. 在中文環境下登入
    await page.click('text=開始使用')
    await expect(page).toHaveURL(/\/zh\/login/, { timeout: 10000 })

    await page.waitForTimeout(2000)
    await page.fill('input[type="email"]', 'user@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')

    // 4. 檢查儀表板是否為中文
    await expect(page).toHaveURL(/\/zh\/dashboard/, { timeout: 10000 })
    await expect(page.locator('h1:has-text("儀表板")')).toBeVisible({ timeout: 10000 })

    // 5. 導航到個人資料頁面
    if (!isMobile) {
      await page.click('nav a[href*="/profile"]')
      await expect(page).toHaveURL(/\/zh\/profile/, { timeout: 10000 })
      await expect(page.locator('h1:has-text("個人資料")')).toBeVisible({ timeout: 10000 })
    }
    else {
      // 行動版：先開啟選單
      await page.waitForTimeout(1000)
      await page.click('[aria-label="Menu"]')
      await page.waitForTimeout(1000)

      await page.click('.md\\:hidden nav a[href*="/profile"]')
      await expect(page).toHaveURL(/\/zh\/profile/, { timeout: 10000 })
      await expect(page.locator('h1:has-text("個人資料")')).toBeVisible({ timeout: 10000 })
    }

    // 6. 切換回英文
    await commands.switchLanguage('en')
    await expect(page).toHaveURL(/\/en\/profile/)
    await expect(page.locator('h1:has-text("Profile")')).toBeVisible()
  })

  test('complete responsive design flow', async ({ page }) => {
    // 1. 桌面版測試
    await commands.setDesktopViewport()
    await page.goto('/en')

    // 檢查桌面版導航
    await expect(page.locator('nav a:has-text("Home")')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('nav a:has-text("Dashboard")')).toBeVisible()

    // 2. 切換到行動版
    await commands.setMobileViewport()

    // 手動觸發 resize 事件來確保選單狀態重置
    await page.evaluate(() => {
      window.dispatchEvent(new Event('resize'))
    })

    // 等待 resize 事件處理完成
    await page.waitForTimeout(500)

    // 如果選單仍然開啟，手動關閉它
    const isMobileMenuVisible = await page.locator('.md\\:hidden nav.flex.flex-col').isVisible().catch(() => false)
    if (isMobileMenuVisible) {
      await page.click('[aria-label="Menu"]') // 點擊關閉選單
      await page.waitForTimeout(300) // 等待動畫完成
    }

    // 檢查行動版選單按鈕
    await expect(page.locator('[aria-label="Menu"]')).toBeVisible({ timeout: 10000 })

    // 桌面版導航應該隱藏
    await expect(page.locator('nav a:has-text("Home")')).not.toBeVisible()

    // 確認行動版選單初始狀態應該是關閉的
    await expect(page.locator('.md\\:hidden nav.flex.flex-col')).not.toBeVisible()

    // 3. 測試行動版登入流程
    await page.waitForTimeout(1000)
    await page.click('[aria-label="Menu"]')
    await page.waitForTimeout(1000)

    // Wait for mobile menu to appear and find dashboard link
    await page.waitForSelector('.md\\:hidden nav.flex.flex-col a[href*="/dashboard"]', { timeout: 10000 })
    await page.click('.md\\:hidden nav.flex.flex-col a[href*="/dashboard"]')
    await page.waitForTimeout(1000)
    // await page.click('.md\\:hidden nav.flex.flex-col a[href*="/dashboard"]')

    // 應該重定向到登入頁面
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 })

    // 在行動版完成登入
    await page.waitForTimeout(2000)
    await page.fill('input[type="email"]', 'user@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')

    // 檢查行動版儀表板
    await expect(page).toHaveURL(/\/en\/dashboard/, { timeout: 10000 })
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible({ timeout: 10000 })

    // 4. 測試行動版個人資料表單
    await page.waitForTimeout(2000)
    await expect(page.locator('[aria-label="Menu"]')).toBeVisible({ timeout: 10000 })
    await page.click('[aria-label="Menu"]')
    await page.waitForTimeout(2000)

    // Wait for mobile menu to appear and find profile link
    await page.waitForSelector('.md\\:hidden nav.flex.flex-col a[href*="/profile"]', { timeout: 10000 })
    await page.click('.md\\:hidden nav.flex.flex-col a[href*="/profile"]')

    // 檢查表單在行動版的顯示
    await expect(page.locator('input[name="name"]')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('textarea[name="bio"]')).toBeVisible()
  })

  test('complete error handling flow', async ({ page }) => {
    // 1. 測試網路錯誤處理
    await commands.simulateSlowNetwork()
    await page.goto('/en/login')

    // 2. 測試表單驗證錯誤
    await page.click('button[type="submit"]')

    // 等待表單處理完成
    await page.waitForSelector('input[type="email"]:not([disabled])', { timeout: 10000 })

    await expect(page.locator('text=Please enter your email')).toBeVisible({ timeout: 10000 })

    // 3. 測試認證錯誤
    await page.waitForTimeout(2000)
    await page.fill('input[type="email"]', 'wrong@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')

    // 等待表單處理完成
    await page.waitForSelector('input[type="email"]:not([disabled])', { timeout: 10000 })

    await expect(page.locator('text=Invalid email or password')).toBeVisible({ timeout: 10000 })

    // 4. 測試 404 錯誤
    await page.goto('/en/non-existent-page')
    await expect(page.locator('h1').filter({ hasText: '404' })).toBeVisible({ timeout: 10000 })

    // 5. 測試錯誤恢復 - navigate back manually since there's no Return Home button
    await page.goto('/en/')
    await expect(page).toHaveURL(/\/en\//, { timeout: 10000 })
  })

  test('complete accessibility flow', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'WebKit has different focus behavior for keyboard navigation')

    await page.goto('/en')
    await page.waitForLoadState('networkidle')

    // 1. 鍵盤導航測試
    await page.keyboard.press('Tab')
    await expect(page.locator('a:focus')).toBeVisible({ timeout: 10000 })

    // 2. 檢查 ARIA 標籤
    await expect(page.locator('[aria-label]')).toHaveCount(4, { timeout: 10000 }) // 檢查 ARIA 標籤數量

    // 3. 檢查表單可訪問性
    await page.goto('/en/login')
    await expect(page.locator('label[for]')).toHaveCount(2, { timeout: 10000 }) // Email 和 Password 標籤

    // 4. 檢查錯誤訊息的可訪問性
    await page.click('button[type="submit"]')

    // 等待表單處理完成
    await page.waitForSelector('input[type="email"]:not([disabled])', { timeout: 10000 })

    await expect(page.locator('[role="alert"], .error-message')).toBeVisible({ timeout: 10000 })

    // 5. 檢查焦點管理
    await page.waitForTimeout(2000)
    await page.fill('input[type="email"]', 'test@example.com')
    await page.keyboard.press('Tab')
    await expect(page.locator('input[type="password"]:focus')).toBeVisible()
  })
})