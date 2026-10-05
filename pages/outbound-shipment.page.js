import { expect } from '@playwright/test';

const UI_TIMEOUT = 15_000;
const LOGIN_TIMEOUT = 30_000;

export class OutboundShipmentPage {
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

  async openNewShipment() {
    const samplesMenu = this.page
      .locator('#b1-b3-SamplesAndShipments')
      .getByRole('menuitem', { name: /Samples & Shipments/ })
      .first();
    if ((await samplesMenu.getAttribute('aria-expanded')) !== 'true') {
      await samplesMenu.click();
    }
    await expect(samplesMenu).toHaveAttribute('aria-expanded', 'true', {
      timeout: UI_TIMEOUT,
    });
    await this.page.locator('#b1-b3-Link_Shipments').click();
    await expect(this.page).toHaveURL(/\/ShipmentsListing/, {
      timeout: LOGIN_TIMEOUT,
    });
    await this.page.locator('#NewShipmentButton').click();
    await expect(this.page.getByRole('tab', { name: 'Basic Details' })).toBeVisible({
      timeout: LOGIN_TIMEOUT,
    });
  }

  async selectOutboundCustomerSample() {
    await this.page.getByRole('radio', { name: 'Outbound (From CSA to X)' }).check();
    await this.page.getByRole('radio', { name: 'Customer Samples', exact: true }).check();
    await this.page.getByRole('radio', { name: 'No', exact: true }).check();
  }

  async chooseSearchOption(wrapperId, searchText, optionName) {
    const combobox = this.page.locator(`#${wrapperId} [role="combobox"]`);
    await combobox.click();
    const popupId = await combobox.getAttribute('aria-controls');
    const popup = this.page.locator(`#${popupId}`);
    const search = popup.getByPlaceholder('Search...', { exact: true });
    await expect(search).toBeVisible({ timeout: UI_TIMEOUT });
    await search.fill(searchText);
    const option = popup.getByRole('option', { name: optionName });
    await expect(option.first()).toBeVisible({ timeout: LOGIN_TIMEOUT });
    await option.first().click();
  }

  async completeBasicDetails() {
    await this.chooseSearchOption('Dropdown_Locations', 'Cleveland', /Cleveland/i);
    const receiverCombo = this.page.locator(
      '#DropdownSearch_SenderName2 [role="combobox"]',
    );
    await expect
      .poll(() => receiverCombo.getAttribute('class'), { timeout: LOGIN_TIMEOUT })
      .not.toContain('has-no-options');
    await this.chooseSearchOption(
      'DropdownSearch_SenderName2',
      '3M Canada Company',
      '3M Canada Company',
    );
    await this.page.getByRole('button', { name: /Next: Content Details/ }).click();
    await expect(this.page.getByRole('tab', { name: 'Content Details' })).toHaveClass(
      /active/,
      { timeout: LOGIN_TIMEOUT },
    );
  }

  async selectRequestedSample() {
    const sampleRow = this.page
      .getByRole('row')
      .filter({ hasText: 'SMP2026000004 - 01' });
    await expect(sampleRow).toBeVisible({ timeout: LOGIN_TIMEOUT });
    await sampleRow.getByRole('checkbox').check();
  }

  async completeContentDetails() {
    await this.page.getByPlaceholder('Enter HS-code').fill('0001');
    await this.page.getByPlaceholder('Enter cost').fill('1000');
    await this.page.getByPlaceholder('Enter comment').fill('None');
    await this.page.getByRole('button', { name: /Next: Special Instructions/ }).click();
    await expect(this.page.getByRole('tab', { name: 'Special Instructions' })).toHaveClass(
      /active/,
      { timeout: LOGIN_TIMEOUT },
    );
  }

  async createShipment() {
    await this.page.getByRole('radio', { name: 'No', exact: true }).check();
    await this.page.locator('#Btn_CreateShipment').click();
    const successDialog = this.page.getByRole('dialog').filter({
      hasText: /Shipment created Successfully/i,
    });
    await expect(successDialog).toBeVisible({ timeout: LOGIN_TIMEOUT });
    const successMessage = await successDialog.innerText();
    const shipmentId = successMessage.match(/Shipment ID:\s*(\d+)/i)?.[1];
    if (!shipmentId) {
      throw new Error(`Could not extract a Shipment ID from: ${successMessage}`);
    }
    await successDialog.getByRole('button', { name: 'Close' }).click();
    return { shipmentId, successMessage };
  }
}