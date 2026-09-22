import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from './abstractPage'

export default class DeviceComplianceListPage extends AbstractPage {
  readonly header: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'Device compliance' })
  }

  static async verifyOnPage(page: Page): Promise<DeviceComplianceListPage> {
    const homePage = new DeviceComplianceListPage(page)
    await expect(homePage.header).toBeVisible()
    return homePage
  }
}
