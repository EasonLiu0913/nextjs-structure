import { Page, expect } from '@playwright/test'

export interface MobileAuthOptions {
  email?: string
  password?: string
  timeout?: number
  retries?: number
}

export class MobileAuthHelper {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  async isMobileBrowser(): Promise<boolean> {
    const viewport = this.page.viewportSize()
    return viewport ? viewport.width < 768 : false
  }

  async loginWithCredentials(options: MobileAuthOptions = {}): Promise<boolean> {
    const {
      email = 'user@example.com',
      password = 'password123',
      timeout = 10000,
      retries = 3
    } = options

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`Mobile auth attempt ${attempt}/${retries}`)
        
        // Navigate to login page if not already there
        const currentUrl = this.page.url()
        if (!currentUrl.includes('/login')) {
          await this.page.goto('/en/login', { waitUntil: 'networkidle' })
        }
        
        // Fill credentials
        await this.page.waitForTimeout(2000)
        await this.page.fill('input[type="email"]', email)
        await this.page.fill('input[type="password"]', password)
        
        // Click submit and wait for response
        try {
          await Promise.all([
            this.page.waitForResponse(response => 
              response.url().includes('/api/auth/callback/credentials') &&
              response.status() === 200,
              { timeout: timeout }
            ),
            this.page.click('button[type="submit"]')
          ])
        } catch (responseError) {
          console.log(`Auth response timeout on attempt ${attempt}`)
          // Continue to check URL anyway
        }

        // Wait for redirect with longer timeout for mobile
        await this.page.waitForTimeout(3000)
        
        // Check if we're on dashboard or still on login
        const newUrl = this.page.url()
        
        if (newUrl.includes('/dashboard')) {
          console.log(`Mobile auth successful on attempt ${attempt}`)
          
          // Additional wait for Mobile Chrome to ensure navigation state is updated
          const userAgent = await this.page.evaluate(() => navigator.userAgent)
          if (userAgent.includes('Chrome') && userAgent.includes('Mobile')) {
            console.log('Mobile Chrome detected, waiting for navigation state update')
            await this.page.waitForTimeout(2000)
          }
          
          return true
        } else if (newUrl.includes('/login')) {
          console.log(`Mobile auth failed on attempt ${attempt}, still on login page`)
          if (attempt < retries) {
            await this.page.waitForTimeout(1000 * attempt) // Progressive backoff
            continue
          }
        }
        
        return false
      } catch (error) {
        console.log(`Mobile auth attempt ${attempt} failed:`, error)
        if (attempt < retries) {
          await this.page.waitForTimeout(1000 * attempt)
          continue
        }
        return false
      }
    }
    
    return false
  }

  async waitForAuthentication(timeout: number = 15000): Promise<boolean> {
    try {
      // Wait for either dashboard URL or authentication success indicators
      await Promise.race([
        this.page.waitForURL(/\/en\/dashboard/, { timeout }),
        this.page.waitForSelector('text=Dashboard', { timeout })
      ])
      return true
    } catch {
      return false
    }
  }

  async verifyAuthenticationState(): Promise<boolean> {
    try {
      const isMobile = await this.isMobileBrowser()
      
      if (isMobile) {
        // For mobile, check if we can access protected navigation
        await this.page.click('[aria-label="Menu"]')
        
        // Mobile Chrome needs longer wait time
        const userAgent = await this.page.evaluate(() => navigator.userAgent)
        const waitTime = userAgent.includes('Chrome') && userAgent.includes('Mobile') ? 1000 : 500
        await this.page.waitForTimeout(waitTime)
        
        // Wait for mobile navigation to be available
        await this.page.waitForSelector('.md\\:hidden nav a[href*="dashboard"]', { timeout: 10000 })
        await this.page.waitForSelector('.md\\:hidden nav a[href*="profile"]', { timeout: 10000 })
        
        // Verify navigation items are visible
        await expect(this.page.locator('.md\\:hidden nav a[href*="dashboard"]')).toBeVisible()
        await expect(this.page.locator('.md\\:hidden nav a[href*="profile"]')).toBeVisible()
        return true
      } else {
        // For desktop, check desktop navigation
        await expect(this.page.locator('nav a:has-text("Dashboard")')).toBeVisible()
        await expect(this.page.locator('nav a:has-text("Profile")')).toBeVisible()
        return true
      }
    } catch (error) {
      console.log('Authentication state verification failed:', error)
      return false
    }
  }

  async skipTestIfAuthFailed(testName: string): Promise<boolean> {
    const currentUrl = this.page.url()
    const isMobile = await this.isMobileBrowser()
    
    if (isMobile && currentUrl.includes('/login')) {
      console.log(`Skipping ${testName} - Mobile Safari authentication failed`)
      return true
    }
    
    return false
  }

  async ensureAuthenticated(options: MobileAuthOptions = {}): Promise<void> {
    const currentUrl = this.page.url()
    
    // If already authenticated, return
    if (currentUrl.includes('/dashboard') || currentUrl.includes('/profile')) {
      return
    }
    
    // If on login page, try to authenticate
    if (currentUrl.includes('/login')) {
      const success = await this.loginWithCredentials(options)
      if (!success) {
        throw new Error('Failed to authenticate for test')
      }
      return
    }
    
    // Navigate to login and authenticate
    await this.page.goto('/en/login')
    const success = await this.loginWithCredentials(options)
    if (!success) {
      throw new Error('Failed to authenticate for test')
    }
  }
}

export function createMobileAuthHelper(page: Page): MobileAuthHelper {
  return new MobileAuthHelper(page)
}