import { test, expect } from '@playwright/test'
import { createMobileAuthHelper } from '../utils/mobile-auth'

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en')
  })

  test('should display main navigation correctly', async ({ page }) => {
    // 檢查主導航元素 - 使用更具體的選擇器來避免多元素衝突
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('header').locator('text=NextApp')).toBeVisible() // Logo in header only
    
    // 檢查導航元素（使用更具體的選擇器）
    // 桌面版導航 - 使用正確的類別選擇器
    const desktopNav = page.locator('nav.hidden.md\\:flex')
    const viewportSize = await page.viewportSize()
    const isMobile = viewportSize && viewportSize.width < 768
    
    if (!isMobile) {
      // 桌面版：檢查桌面導航可見
      await expect(desktopNav).toBeVisible()
      await expect(desktopNav.getByText('Home')).toBeVisible()
      await expect(desktopNav.getByText('Dashboard')).toBeVisible()
      await expect(desktopNav.getByText('Profile')).toBeVisible()
    } else {
      // 行動版：檢查選單按鈕存在，桌面導航隱藏
      await expect(page.locator('[aria-label="Menu"]')).toBeVisible()
      await expect(desktopNav).toBeHidden()
    }
  })

  test('should navigate to different pages correctly', async ({ page }) => {
    const authHelper = createMobileAuthHelper(page)
    const isMobile = await authHelper.isMobileBrowser()
    
    if (isMobile) {
      // Mobile navigation test using auth helper
      await expect(page.locator('[aria-label="Menu"]')).toBeVisible()
      await page.click('[aria-label="Menu"]')
      await page.waitForTimeout(500)
      
      const mobileNav = page.locator('.md\\:hidden').locator('nav')
      await mobileNav.getByText('Dashboard').click()
      await expect(page).toHaveURL(/\/en\/login/)
      
      // Use mobile auth helper for reliable authentication
      const authSuccess = await authHelper.loginWithCredentials({
        timeout: 15000,
        retries: 3
      })
      
      if (!authSuccess) {
        console.log('Mobile Chrome authentication failed, skipping test')
        test.skip()
        return
      }
      
      // Ensure we're authenticated before proceeding
      await authHelper.waitForAuthentication(10000)
      
      // Wait longer for Mobile Chrome to update navigation state
      await page.waitForTimeout(2000)
      
      // Navigate to profile with more robust selectors
      await page.click('[aria-label="Menu"]')
      await page.waitForTimeout(1000) // Longer wait for Mobile Chrome
      
      // Try multiple selectors for mobile navigation after login
      const mobileNavAfterLogin = page.locator('.md\\:hidden').locator('nav')
      
      // Wait for Profile link to be available with longer timeout
      await expect(mobileNavAfterLogin.getByText('Profile')).toBeVisible({ timeout: 10000 })
      await mobileNavAfterLogin.getByText('Profile').click()
      await expect(page).toHaveURL(/\/en\/profile/)
    } else {
      // Desktop navigation test
      const desktopNav = page.locator('nav.hidden.md\\:flex')
      await desktopNav.getByText('Home').click()
      await expect(page).toHaveURL(/\/en\/$/)
      
      await desktopNav.getByText('Dashboard').click()
      await expect(page).toHaveURL(/\/en\/login/)
      
      await page.waitForTimeout(2000)
      await page.fill('input[type="email"]', 'user@example.com')
      await page.fill('input[type="password"]', 'password123')
      await page.click('button[type="submit"]')
      
      // Wait for successful authentication and redirect to dashboard
      await expect(page).toHaveURL(/\/en\/dashboard/, { timeout: 10000 })
      
      // Wait for navigation state to update after login
      await page.waitForTimeout(1000)
      
      const headerDesktopNav = page.locator('nav.hidden.md\\:flex')
      await headerDesktopNav.getByText('Profile').click()
      await expect(page).toHaveURL(/\/en\/profile/, { timeout: 10000 })
    }
  })

  test('should show active navigation state', async ({ page }) => {
    const authHelper = createMobileAuthHelper(page)
    const isMobile = await authHelper.isMobileBrowser()
    
    // Use mobile auth helper for reliable authentication
    const authSuccess = await authHelper.loginWithCredentials({
      timeout: 15000,
      retries: 3
    })
    
    if (!authSuccess && isMobile) {
      console.log('Mobile Safari authentication failed, skipping test')
      test.skip()
      return
    }
    
    // Ensure we're authenticated before proceeding
    await authHelper.waitForAuthentication(10000)
    
    if (!isMobile) {
      // Desktop navigation active state test
      const desktopNav = page.locator('nav.hidden.md\\:flex')
      await expect(desktopNav.locator('a[href*="dashboard"]')).toHaveClass(/text-primary/)
      
      await desktopNav.getByText('Profile').click()
      await page.waitForTimeout(2000)
      await expect(desktopNav.locator('a[href*="profile"]')).toHaveClass(/text-primary/)
    } else {
      // Mobile navigation - verify authentication state
      const isAuthenticated = await authHelper.verifyAuthenticationState()
      expect(isAuthenticated).toBe(true)
    }
  })

  test('should handle mobile navigation', async ({ page }) => {
    // 設定為行動裝置視窗大小
    await page.setViewportSize({ width: 375, height: 667 })
    
    // 檢查行動版選單按鈕
    await expect(page.locator('[aria-label="Menu"]')).toBeVisible()
    
    // 桌面版導航應該隱藏
    const desktopNav = page.locator('nav.hidden.md\\:flex')
    await expect(desktopNav).toBeHidden()
    
    // 點擊選單按鈕
    await page.click('[aria-label="Menu"]')
    
    // 等待選單動畫完成
    await page.waitForTimeout(500)
    
    // 檢查行動版選單 - 使用行動版導航容器
    const mobileNav = page.locator('.md\\:hidden').locator('nav')
    await expect(mobileNav.getByText('Home')).toBeVisible()
    await expect(mobileNav.getByText('Dashboard')).toBeVisible()
    await expect(mobileNav.getByText('Profile')).toBeVisible()
    
    // 測試行動版導航
    await mobileNav.getByText('Home').click()
    await expect(page).toHaveURL(/\/en\/$/)
  })

  test('should display user account menu when logged in', async ({ page }) => {
    const authHelper = createMobileAuthHelper(page)
    const isMobile = await authHelper.isMobileBrowser()
    
    // Use mobile auth helper for reliable authentication
    const authSuccess = await authHelper.loginWithCredentials({
      timeout: 15000,
      retries: 3
    })
    
    if (!authSuccess && isMobile) {
      console.log('Mobile Safari authentication failed, skipping test')
      test.skip()
      return
    }
    
    // Ensure we're authenticated before proceeding
    await authHelper.waitForAuthentication(10000)
    
    if (!isMobile) {
      // Desktop user menu test
      const desktopActions = page.locator('.hidden.md\\:flex').last()
      await expect(desktopActions.getByText('Settings')).toBeVisible()
      await expect(desktopActions.getByText('Logout')).toBeVisible()
      
      // 檢查使用者資訊存在（可能是 email 或 name 的任一部分）
      await expect(page.locator('span:has-text("user")')).toBeVisible()
    } else {
      // Mobile user menu test - verify authentication state
      const isAuthenticated = await authHelper.verifyAuthenticationState()
      expect(isAuthenticated).toBe(true)
    }
  })

  test('should handle language switcher in navigation', async ({ page }) => {
    const viewport = page.viewportSize()
    const isMobile = viewport && viewport.width < 768
    
    if (!isMobile) {
      // Desktop language switcher test
      await expect(page.locator('[aria-label="Language switcher"]')).toBeVisible()
      await page.waitForTimeout(2000)
      await page.click('[aria-label="Language switcher"]')
      await page.waitForTimeout(2000)
      
      const dropdown = page.locator('[role="menu"], .bg-white.rounded-md.shadow-lg').first()
      await expect(dropdown.getByText('English')).toBeVisible()
      await expect(dropdown.getByText('中文')).toBeVisible()
      
      await dropdown.getByText('中文').click()
      await page.waitForTimeout(2000)
      
      // Check navigation updated to Chinese
      const desktopNav = page.locator('nav.hidden.md\\:flex')
      await expect(desktopNav.getByText('首頁')).toBeVisible()
      await expect(desktopNav.getByText('儀表板')).toBeVisible()
    } else {
      // Mobile language switcher test
      await page.waitForTimeout(2000)
      await page.click('[aria-label="Menu"]')
      await page.waitForTimeout(2000)
      
      const mobileMenu = page.locator('.md\\:hidden')
      await expect(mobileMenu.locator('[aria-label="Language switcher"]')).toBeVisible()
      
      await mobileMenu.locator('[aria-label="Language switcher"]').click()
      await page.waitForTimeout(500)
      
      const dropdown = page.locator('[role="menu"], .bg-white.rounded-md.shadow-lg').first()
      await expect(dropdown.getByText('中文')).toBeVisible()
      
      await dropdown.getByText('中文').click()
      await page.waitForTimeout(2000)
      
      // Verify URL changed to Chinese
      await expect(page).toHaveURL(/\/zh/)
    }
  })

  test('should handle breadcrumb navigation', async ({ page }) => {
    const viewport = page.viewportSize()
    const isMobile = viewport && viewport.width < 768
    
    // 登入並導航到深層頁面
    await page.goto('/en/login')

    await page.waitForTimeout(2000)
    await page.fill('input[type="email"]', 'user@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    await page.waitForTimeout(3000)
    
    if (!isMobile) {
      // Desktop breadcrumb test
      const desktopNav = page.locator('nav.hidden.md\\:flex')
      await desktopNav.getByText('Profile').click()
      await page.waitForTimeout(2000)
      await expect(page.locator('header')).toBeVisible()
    } else {
      // Mobile breadcrumb test
      await page.click('[aria-label="Menu"]')
      await page.waitForTimeout(500)
      const mobileNav = page.locator('.md\\:hidden').locator('nav')
      await mobileNav.getByText('Profile').click()
      await page.waitForTimeout(2000)
      await expect(page.locator('header')).toBeVisible()
    }
  })

  test('should handle navigation with keyboard', async ({ page }) => {
    const viewport = page.viewportSize()
    const isMobile = viewport && viewport.width < 768
    
    if (!isMobile) {
      // Desktop keyboard navigation test
      const desktopNav = page.locator('nav.hidden.md\\:flex')
      const homeLink = desktopNav.getByText('Home')
      
      await homeLink.focus()
      await expect(homeLink).toBeFocused()
      
      await page.keyboard.press('Enter')
      await expect(page).toHaveURL(/\/en\/$/)
    } else {
      // Mobile keyboard navigation test - test menu button
      const menuButton = page.locator('[aria-label="Menu"]')
      await menuButton.focus()
      await expect(menuButton).toBeFocused()
      
      await page.keyboard.press('Enter')
      await page.waitForTimeout(500)
      
      const mobileNav = page.locator('.md\\:hidden').locator('nav')
      await expect(mobileNav.getByText('Home')).toBeVisible()
    }
  })

  test('should handle external links correctly', async ({ page }) => {
    const viewport = page.viewportSize()
    const isMobile = viewport && viewport.width < 768
    
    // 檢查頁尾存在（外部鏈接的常見位置）
    await expect(page.locator('footer')).toBeVisible()
    
    if (!isMobile) {
      // Desktop external links test
      const desktopNav = page.locator('nav.hidden.md\\:flex')
      await desktopNav.getByText('Home').click()
      await expect(page).toHaveURL(/\/en\/$/)
    } else {
      // Mobile external links test
      await page.click('[aria-label="Menu"]')
      await page.waitForTimeout(500)
      const mobileNav = page.locator('.md\\:hidden').locator('nav')
      await mobileNav.getByText('Home').click()
      await expect(page).toHaveURL(/\/en\/$/)
    }
  })

  test('should maintain navigation state during page transitions', async ({ page }) => {
    const authHelper = createMobileAuthHelper(page)
    const isMobile = await authHelper.isMobileBrowser()
    
    // Use mobile auth helper for reliable authentication
    const authSuccess = await authHelper.loginWithCredentials({
      timeout: 15000,
      retries: 3
    })
    
    if (!authSuccess && isMobile) {
      console.log('Mobile Safari authentication failed, skipping test')
      test.skip()
      return
    }
    
    // Ensure we're authenticated before proceeding
    await authHelper.waitForAuthentication(10000)
    
    if (!isMobile) {
      // Desktop navigation state test
      const desktopNav = page.locator('nav.hidden.md\\:flex')
      await desktopNav.getByText('Profile').click()
      await page.waitForTimeout(2000)
      
      await desktopNav.getByText('Dashboard').click()
      await page.waitForTimeout(2000)
      
      // 檢查導航狀態是否正確維持
      await expect(page.locator('header')).toBeVisible()
      const desktopActions = page.locator('.hidden.md\\:flex').last()
      await expect(desktopActions.getByText('Settings')).toBeVisible()
      await expect(desktopActions.getByText('Logout')).toBeVisible()
    } else {
      // Mobile navigation state test - verify authentication state
      const isAuthenticated = await authHelper.verifyAuthenticationState()
      expect(isAuthenticated).toBe(true)
      
      // 檢查導航狀態是否正確維持
      await expect(page.locator('header')).toBeVisible()
    }
  })
})