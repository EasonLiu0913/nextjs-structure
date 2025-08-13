import { test, expect } from '@playwright/test'
import { TestCommands } from '../support/commands'
import userData from '../fixtures/users.json'

test.describe('Complete User Flow', () => {
  let commands: TestCommands

  test.beforeEach(async ({ page }) => {
    commands = new TestCommands(page)
  })

  test('complete user journey: register → login → profile update → logout', async ({ page }) => {
    // 1. 註冊新使用者
    await page.goto('/en/register')
    
    const { newUser } = userData
    await page.fill('input[name="name"]', newUser.name)
    await page.fill('input[name="email"]', newUser.email)
    await page.fill('input[name="password"]', newUser.password)
    await page.fill('input[name="confirmPassword"]', newUser.confirmPassword)
    await page.click('button[type="submit"]')
    
    // 應該重定向到登入頁面
    await expect(page).toHaveURL(/\/en\/login/)
    
    // 2. 登入
    await page.fill('input[type="email"]', newUser.email)
    await page.fill('input[type="password"]', newUser.password)
    await page.click('button[type="submit"]')
    
    // 應該重定向到儀表板
    await expect(page).toHaveURL(/\/en\/dashboard/)
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible()
    
    // 3. 查看儀表板內容
    await expect(page.locator('text=Total Users')).toBeVisible()
    await expect(page.locator('text=Recent Activity')).toBeVisible()
    await expect(page.locator('text=Quick Actions')).toBeVisible()
    
    // 4. 導航到個人資料頁面
    await page.click('text=Profile')
    await expect(page).toHaveURL(/\/en\/profile/)
    
    // 5. 更新個人資料
    const { profileUpdateData } = userData
    await commands.fillProfileForm(profileUpdateData)
    await commands.submitForm()
    
    // 檢查成功訊息
    await expect(page.locator('text=Profile updated successfully')).toBeVisible()
    
    // 6. 驗證資料已更新
    await expect(page.locator(`input[name="name"][value="${profileUpdateData.name}"]`)).toBeVisible()
    await expect(page.locator(`input[name="email"][value="${profileUpdateData.email}"]`)).toBeVisible()
    
    // 7. 登出
    await commands.logout()
    
    // 應該重定向到首頁
    await expect(page).toHaveURL(/\/en\/login/)
  })

  test('complete authentication error handling flow', async ({ page }) => {
    // 1. 嘗試訪問受保護的頁面
    await page.goto('/en/dashboard')
    
    // 應該重定向到登入頁面
    await expect(page).toHaveURL(/\/en\/login/)
    
    // 2. 嘗試使用錯誤的認證資訊登入
    const { invalidCredentials } = userData
    await page.fill('input[type="email"]', invalidCredentials.email)
    await page.fill('input[type="password"]', invalidCredentials.password)
    await page.click('button[type="submit"]')
    
    // 檢查錯誤訊息
    await expect(page.locator('text=Invalid email or password')).toBeVisible()
    
    // 3. 使用正確的認證資訊登入
    const { validUser } = userData
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
    // 1. 從英文開始
    await page.goto('/en')
    await expect(page.locator('text=Welcome to Next.js 15 Enterprise App')).toBeVisible()
    
    // 2. 切換到中文
    await commands.switchLanguage('zh')
    await expect(page.locator('text=歡迎使用 Next.js 15 企業級應用')).toBeVisible()
    
    // 3. 在中文環境下登入
    await page.click('text=開始使用')
    await expect(page).toHaveURL(/\/zh\/login/)
    
    await page.fill('input[type="email"]', 'user@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // 4. 檢查儀表板是否為中文
    await expect(page).toHaveURL(/\/zh\/dashboard/)
    await expect(page.locator('text=儀表板')).toBeVisible()
    
    // 5. 導航到個人資料頁面
    await page.click('text=個人資料')
    await expect(page).toHaveURL(/\/zh\/profile/)
    await expect(page.locator('text=個人資料')).toBeVisible()
    
    // 6. 切換回英文
    await commands.switchLanguage('en')
    await expect(page).toHaveURL(/\/en\/profile/)
    await expect(page.locator('text=Profile')).toBeVisible()
  })

  test('complete responsive design flow', async ({ page }) => {
    // 1. 桌面版測試
    await commands.setDesktopViewport()
    await page.goto('/en')
    
    // 檢查桌面版導航
    await expect(page.locator('nav a:has-text("Home")')).toBeVisible()
    await expect(page.locator('nav a:has-text("Dashboard")')).toBeVisible()
    
    // 2. 切換到行動版
    await commands.setMobileViewport()
    
    // 檢查行動版選單按鈕
    await expect(page.locator('[aria-label="Menu"]')).toBeVisible()
    
    // 桌面版導航應該隱藏
    await expect(page.locator('nav a:has-text("Home")')).not.toBeVisible()
    
    // 3. 測試行動版登入流程
    await page.click('[aria-label="Menu"]')
    await page.click('text=Dashboard')
    
    // 應該重定向到登入頁面
    await expect(page).toHaveURL(/\/en\/login/)
    
    // 在行動版完成登入
    await page.fill('input[type="email"]', 'user@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // 檢查行動版儀表板
    await expect(page).toHaveURL(/\/en\/dashboard/)
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible()
    
    // 4. 測試行動版個人資料表單
    await page.click('[aria-label="Menu"]')
    await page.click('text=Profile')
    
    // 檢查表單在行動版的顯示
    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.locator('textarea[name="bio"]')).toBeVisible()
  })

  test('complete error handling flow', async ({ page }) => {
    // 1. 測試網路錯誤處理
    await commands.simulateSlowNetwork()
    await page.goto('/en/login')
    
    // 2. 測試表單驗證錯誤
    await page.click('button[type="submit"]')
    await expect(page.locator('text=請輸入電子郵件')).toBeVisible()
    
    // 3. 測試認證錯誤
    await page.fill('input[type="email"]', 'wrong@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    await expect(page.locator('text=Invalid email or password')).toBeVisible()
    
    // 4. 測試 404 錯誤
    await page.goto('/en/non-existent-page')
    await expect(page.locator('text=Page Not Found')).toBeVisible()
    
    // 5. 測試錯誤恢復
    await page.click('text=Return Home')
    await expect(page).toHaveURL(/\/en\//)
  })

  test('complete accessibility flow', async ({ page }) => {
    await page.goto('/en')
    
    // 1. 鍵盤導航測試
    await page.keyboard.press('Tab')
    await expect(page.locator('a:focus')).toBeVisible()
    
    // 2. 檢查 ARIA 標籤
    await expect(page.locator('[aria-label]')).toHaveCount(1) // 至少有一個 ARIA 標籤
    
    // 3. 檢查表單可訪問性
    await page.goto('/en/login')
    await expect(page.locator('label[for]')).toHaveCount(2) // Email 和 Password 標籤
    
    // 4. 檢查錯誤訊息的可訪問性
    await page.click('button[type="submit"]')
    await expect(page.locator('[role="alert"]')).toBeVisible()
    
    // 5. 檢查焦點管理
    await page.fill('input[type="email"]', 'test@example.com')
    await page.keyboard.press('Tab')
    await expect(page.locator('input[type="password"]:focus')).toBeVisible()
  })
})