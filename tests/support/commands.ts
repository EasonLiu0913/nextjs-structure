import { Page } from '@playwright/test'

export class TestCommands {
  constructor(private page: Page) {}

  /**
   * 登入到應用程式
   */
  async login(email = 'user@example.com', password = 'password123') {
    await this.page.goto('/en/login')

    await this.page.waitForTimeout(2000)
    await this.page.fill('input[type="email"]', email)
    await this.page.fill('input[type="password"]', password)
    await this.page.click('button[type="submit"]')
    await this.page.waitForURL(/\/en\/dashboard/)
  }

  /**
   * 登出應用程式
   */
  async logout() {
    const viewportSize = await this.page.viewportSize()
    const isMobile = viewportSize && viewportSize.width < 768

    if (!isMobile){
      // 這需要根據實際的登出實作來調整
      await this.page.click('text=Logout')
      await this.page.waitForURL(/\/en\//)
    }
    else{
      // 行動版：先開啟選單
      await this.page.waitForTimeout(1000)
      await this.page.click('[aria-label="Menu"]')
      await this.page.waitForTimeout(1000)

      await this.page.locator('text=Logout').nth(1).click()
      await this.page.waitForURL(/\/en\//)
    }
  }

  /**
   * 切換語言
   */
  async switchLanguage(language: 'en' | 'zh') {
    // 檢查是否為行動版
    const viewportSize = await this.page.viewportSize()
    const isMobile = viewportSize && viewportSize.width < 768
    
    if (!isMobile) {
      await this.page.waitForTimeout(2000)
      await this.page.click('[aria-label="Language switcher"]')
    }
    else{
      // 行動版：先開啟選單
      await this.page.click('[aria-label="Menu"]')
      await this.page.waitForTimeout(2000)
      await this.page.click('.md\\:hidden [aria-label="Language switcher"]')
    }
    
    if (language === 'zh') {
      await this.page.click('text=中文')
    } else {
      await this.page.click('text=English')
    }
    
    await this.page.waitForURL(new RegExp(`/${language}/`))
  }

  /**
   * 等待載入完成
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * 檢查是否有錯誤訊息
   */
  async hasErrorMessage(): Promise<boolean> {
    return await this.page.locator('[role="alert"]').isVisible()
  }

  /**
   * 檢查是否有成功訊息
   */
  async hasSuccessMessage(): Promise<boolean> {
    return await this.page.locator('.bg-green-50').isVisible()
  }

  /**
   * 填寫個人資料表單
   */
  async fillProfileForm(data: {
    name?: string
    email?: string
    phone?: string
    website?: string
    location?: string
    bio?: string
  }) {
    await this.page.waitForTimeout(2000)
    if (data.name) await this.page.fill('input[name="name"]', data.name)
    if (data.email) await this.page.fill('input[name="email"]', data.email)
    if (data.phone) await this.page.fill('input[name="phone"]', data.phone)
    if (data.website) await this.page.fill('input[name="website"]', data.website)
    if (data.location) await this.page.fill('input[name="location"]', data.location)
    if (data.bio) await this.page.fill('textarea[name="bio"]', data.bio)
  }

  /**
   * 提交表單
   */
  async submitForm() {
    await this.page.click('button[type="submit"]')
  }

  /**
   * 等待表單提交完成
   */
  async waitForFormSubmission() {
    await this.page.waitForSelector('button[type="submit"]:not([disabled])')
  }

  /**
   * 檢查是否在行動裝置視窗
   */
  async setMobileViewport() {
    await this.page.setViewportSize({ width: 375, height: 667 })
  }

  /**
   * 檢查是否在桌面視窗
   */
  async setDesktopViewport() {
    await this.page.setViewportSize({ width: 1280, height: 720 })
  }

  /**
   * 截圖（用於除錯）
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `tests/screenshots/${name}.png` })
  }

  /**
   * 模擬網路延遲
   */
  async simulateSlowNetwork() {
    await this.page.route('**/*', route => {
      setTimeout(() => route.continue(), 1000)
    })
  }

  /**
   * 檢查可訪問性
   */
  async checkAccessibility() {
    // 這需要安裝 @axe-core/playwright
    // const { injectAxe, checkA11y } = require('axe-playwright')
    // await injectAxe(this.page)
    // await checkA11y(this.page)
  }

  /**
   * 等待動畫完成
   */
  async waitForAnimations() {
    await this.page.waitForTimeout(500) // 等待動畫完成
  }

  /**
   * 檢查元素是否有特定類別
   */
  async hasClass(selector: string, className: string): Promise<boolean> {
    const element = this.page.locator(selector)
    const classes = await element.getAttribute('class')
    return classes?.includes(className) || false
  }

  /**
   * 模擬鍵盤導航
   */
  async navigateWithKeyboard() {
    await this.page.keyboard.press('Tab')
  }

  /**
   * 檢查焦點狀態
   */
  async isFocused(selector: string): Promise<boolean> {
    return await this.page.locator(selector).evaluate(el => el === document.activeElement)
  }
}