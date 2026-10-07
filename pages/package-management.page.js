import { expect } from '@playwright/test';

const UI_TIMEOUT = 15_000;
const LOGIN_TIMEOUT = 30_000;

export class PackageManagementPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('input[type="text"], input[type="email"]').first();
    this.passwordInput = page.locator('input[type="password"]').first();
    this.navigationMenu = page.locator('#b1-b3-b2-Menu');
    this.packageNameInput = page.getByRole('textbox', { name: 'Package Name' });
    this.associatedTestInput = page.getByRole('textbox', { name: 'Associated Test' });
  }

  async open(baseUrl) {
    await this.page.goto(baseUrl, {
      waitUntil: 'domcontentloaded',
      timeout: LOGIN_TIMEOUT,
    });
    await expect(this.usernameInput).toBeVisible({ timeout: UI_TIMEOUT });
    await expect(this.passwordInput).toBeVisible({ timeout: UI_TIMEOUT });
  }

  async signIn(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.page.locator('#b3-Button').click();
    await expect(this.navigationMenu).toBeVisible({ timeout: LOGIN_TIMEOUT });
  }

  async openMyPackages() {
    await this.navigationMenu.click();
    await this.page.locator('.margin-right-xs').nth(3).click();

    const myPackagesLink = this.page
      .locator('span.margin-right-s')
      .filter({ hasText: 'My Packages' })
      .first();
    await expect(myPackagesLink).toBeVisible({ timeout: UI_TIMEOUT });
    await myPackagesLink.click();
    await expect(
      this.page.getByRole('button', { name: 'Add New Package' }),
    ).toBeVisible({ timeout: LOGIN_TIMEOUT });
  }

  async createPackage({ packageName, associatedTest, equipmentId }) {
    await this.page.getByRole('button', { name: 'Add New Package' }).click();
    await expect(this.packageNameInput).toBeVisible({ timeout: UI_TIMEOUT });

    await this.packageNameInput.fill(packageName);
    await this.associatedTestInput.fill(associatedTest);

    await this.page.locator('#Input_Search2').fill(equipmentId);
    await expect(this.page.getByText(equipmentId, { exact: true })).toBeVisible({
      timeout: LOGIN_TIMEOUT,
    });
    await this.page.locator('.checkbox').click();
    await this.page.locator('#SavePackage').click();
    const successAlert = this.page.getByRole('alert').filter({
      hasText: /Package saved successfully/i,
    });
    await expect(successAlert).toBeVisible({ timeout: LOGIN_TIMEOUT });
    await expect(
      this.page.getByRole('button', { name: 'Add New Package' }),
    ).toBeVisible({ timeout: LOGIN_TIMEOUT });
    return successAlert;
  }
}