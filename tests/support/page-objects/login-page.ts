import { Page, Locator } from '@playwright/test'

export class LoginPage {
  readonly page: Page
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator
  readonly errorMessage: Locator
  readonly registerLink: Locator
  readonly forgotPasswordLink: Locator
  readonly passwordToggle: Locator

  constructor(page: Page) {
    this.page = page
    this.emailInput = page.locator('input[type="email"]')
    this.passwordInput = page.locator('input[type="password"]')
    this.submitButton = page.locator('button[type="submit"]')
    this.errorMessage = page.locator('[role="alert"]')
    this.registerLink = page.locator('text=Sign up')
    this.forgotPasswordLink = page.locator('text=Forgot your password?')
    this.passwordToggle = page.locator('button[aria-label="Toggle password visibility"]')
  }

  async goto() {
    await this.page.goto('/en/login')
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }

  async loginWithValidCredentials() {
    await this.login('user@example.com', 'password123')
  }

  async loginWithInvalidCredentials() {
    await this.login('wrong@example.com', 'wrongpassword')
  }

  async togglePasswordVisibility() {
    await this.passwordToggle.click()
  }

  async goToRegister() {
    await this.registerLink.click()
  }

  async goToForgotPassword() {
    await this.forgotPasswordLink.click()
  }

  async waitForErrorMessage() {
    await this.errorMessage.waitFor()
  }

  async waitForRedirect() {
    await this.page.waitForURL(/\/en\/dashboard/)
  }
}