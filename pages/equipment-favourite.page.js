import { expect } from '@playwright/test';

const UI_TIMEOUT = 15_000;
const LOGIN_TIMEOUT = 30_000;

export class EquipmentFavouritePage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('input[type="text"], input[type="email"]').first();
    this.passwordInput = page.locator('input[type="password"]').first();
    this.navigationMenu = page.locator('#b1-b3-b2-Menu');
  }

  async signIn(baseUrl, username, password) {
    await this.page.goto(baseUrl, {
      waitUntil: 'domcontentloaded',
      timeout: LOGIN_TIMEOUT,
    });
    await expect(this.usernameInput).toBeVisible({ timeout: UI_TIMEOUT });
    await expect(this.passwordInput).toBeVisible({ timeout: UI_TIMEOUT });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.page.locator('#b3-Button').click();
    await expect(this.navigationMenu).toBeVisible({ timeout: LOGIN_TIMEOUT });
  }

  async openEquipmentList() {
    const equipmentMenu = this.page
      .getByRole('menuitem', { name: /Equipment Management/ })
      .first();
    await equipmentMenu.click();
    const equipmentListItem = this.page
      .getByRole('menuitem', { name: /Equipment List/ })
      .first();
    await expect(equipmentListItem).toBeVisible({ timeout: LOGIN_TIMEOUT });
    await equipmentListItem.click();
    await expect(this.page.getByText('Equipment List', { exact: true }).first()).toBeVisible({
      timeout: LOGIN_TIMEOUT,
    });
  }

  async selectGlobalAndSetPageSize() {
    const globalOption = this.page.getByRole('tab', { name: /Global/ });
    await expect(globalOption).toBeVisible({ timeout: LOGIN_TIMEOUT });
    await globalOption.click();
    await expect(globalOption).toHaveAttribute('aria-selected', 'true');

    const pageSize = this.page.getByRole('combobox').last();
    await expect(pageSize).toBeVisible({ timeout: LOGIN_TIMEOUT });
    await pageSize.selectOption({ label: '50' });
    await expect(pageSize.locator('option:checked')).toHaveText('50');
    await expect(this.page.getByRole('status')).toContainText(/1 to 50 of/);
  }

  async favoriteThreeEquipment() {
    const headerRow = this.page.getByRole('row').first();
    const headers = await headerRow.getByRole('columnheader').allInnerTexts();
    const assetIdColumn = headers.findIndex((header) => /Asset ID/i.test(header));
    if (assetIdColumn < 0) {
      throw new Error(`Could not find the Asset ID column in: ${headers.join(' | ')}`);
    }

    const rows = this.page.getByRole('row');
    await expect.poll(() => rows.count(), { timeout: LOGIN_TIMEOUT }).toBeGreaterThan(3);
    const rowCount = await rows.count();
    const assetIds = [];
    for (let index = 1; index < Math.min(rowCount, 51) && assetIds.length < 3; index += 1) {
      const row = rows.nth(index);
      const assetId = (await row.getByRole('gridcell').nth(assetIdColumn).innerText()).trim();
      if (!assetId) {
        throw new Error(`Equipment row ${index} has no Asset ID.`);
      }

      const favoriteControl = row.getByRole('menuitem').first();
      await expect(favoriteControl).toBeVisible({ timeout: UI_TIMEOUT });
      const favoriteIcon = favoriteControl.locator('span').first();
      const isFavorite = await favoriteIcon.evaluate((icon) =>
        icon.classList.contains('icon-filled'),
      );
      if (!isFavorite) {
        await favoriteControl.click();
        await expect
          .poll(
            () => favoriteIcon.evaluate((icon) => icon.classList.contains('icon-filled')),
            { timeout: LOGIN_TIMEOUT },
          )
          .toBe(true);
        assetIds.push(assetId);
      }
    }

    if (assetIds.length !== 3) {
      throw new Error(`Only marked ${assetIds.length} equipment items as favourites.`);
    }
    return assetIds;
  }
}