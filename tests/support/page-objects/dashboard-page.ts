import { Page, Locator } from '@playwright/test'

export class DashboardPage {
  readonly page: Page
  readonly title: Locator
  readonly subtitle: Locator
  readonly statsCards: Locator
  readonly recentActivitySection: Locator
  readonly quickActionsSection: Locator
  readonly navigation: Locator

  constructor(page: Page) {
    this.page = page
    this.title = page.locator('h1:has-text("Dashboard")')
    this.subtitle = page.locator('text=Welcome back! Here\'s what\'s happening with your account.')
    this.statsCards = page.locator('[data-testid="stats-card"]')
    this.recentActivitySection = page.locator('text=Recent Activity')
    this.quickActionsSection = page.locator('text=Quick Actions')
    this.navigation = page.locator('nav')
  }

  async goto() {
    await this.page.goto('/en/dashboard')
  }

  async getStatValue(statName: string): Promise<string> {
    const statCard = this.page.locator(`text=${statName}`).locator('..')
    const value = await statCard.locator('.text-2xl').textContent()
    return value || ''
  }

  async clickQuickAction(actionName: string) {
    await this.page.locator(`text=${actionName}`).click()
  }

  async navigateToProfile() {
    await this.page.click('text=Profile')
  }

  async navigateToHome() {
    await this.page.click('text=Home')
  }

  async waitForLoad() {
    await this.title.waitFor()
    await this.statsCards.first().waitFor()
  }

  async getRecentActivities(): Promise<string[]> {
    const activities = await this.page.locator('text=Activity').allTextContents()
    return activities
  }

  async isStatsCardVisible(cardTitle: string): Promise<boolean> {
    return await this.page.locator(`text=${cardTitle}`).isVisible()
  }
}