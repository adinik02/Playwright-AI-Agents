import { expect } from '@playwright/test';

const UI_TIMEOUT = 15_000;
const LOGIN_TIMEOUT = 30_000;

export class SamplePage {
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

  async openSamples() {
    await this.openSamplesAndShipments();
    await this.page.locator('#b1-b3-Link_Samples').click();
    await expect(this.page).toHaveURL(/\/SamplesListing/, { timeout: LOGIN_TIMEOUT });
    await expect(this.page.locator('#AddNewSampleButton')).toBeVisible({
      timeout: LOGIN_TIMEOUT,
    });
  }

  async openShipments() {
    await this.openSamplesAndShipments();
    await this.page.locator('#b1-b3-Link_Shipments').click();
    await expect(this.page).toHaveURL(/\/ShipmentsListing/, {
      timeout: LOGIN_TIMEOUT,
    });
    await expect(this.page.locator('#NewShipmentButton')).toBeVisible({
      timeout: LOGIN_TIMEOUT,
    });
  }

  async openNewShipment() {
    await this.page.locator('#NewShipmentButton').click();
    await expect(this.page.getByRole('tab', { name: 'Basic Details' })).toBeVisible({
      timeout: LOGIN_TIMEOUT,
    });
    await this.page.getByRole('radio', { name: 'Outbound (From CSA to X)' }).check();
    await this.page.getByRole('radio', { name: 'Customer Samples', exact: true }).check();
  }

  async openSamplesAndShipments() {
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
  }

  async openNewSample() {
    await this.page.locator('#AddNewSampleButton').click();
    await this.page.waitForTimeout(3_000);
  }

  async createTestSample() {
    await this.page.locator('#Dropdown_Laboratories').selectOption({
      label: 'LAB-TOR-IMPORT-001',
    });
    await this.page.locator('#Dropdown_SampleStatuses').selectOption({
      label: 'Received',
    });
    await expect
      .poll(() => this.page.locator('#Dropdown_Rooms option').count(), {
        timeout: LOGIN_TIMEOUT,
      })
      .toBeGreaterThan(1);
    await this.page.locator('#Dropdown_Rooms').selectOption({ index: 1 });

    const staffCombobox = this.page.locator('#b11-DropdownTags [role="combobox"]');
    await staffCombobox.click();
    const staffPopupId = await staffCombobox.getAttribute('aria-controls');
    const staffPopup = this.page.locator(`#${staffPopupId}`);
    const staffSearch = staffPopup.getByPlaceholder('Search...', { exact: true });
    await expect(staffSearch).toBeVisible({ timeout: UI_TIMEOUT });
    await staffSearch.pressSequentially('Aditya Mathuria');
    const staffOption = staffPopup.getByRole('option', {
      name: 'Aditya Mathuria',
      exact: true,
    });
    await expect(staffOption).toBeVisible({ timeout: LOGIN_TIMEOUT });
    await staffOption.click();

    const customerPicker = this.page.locator('#ServerSideCustomerNameDD');
    await customerPicker.locator('.osui-dropdown-serverside').click();
    const customerSearch = this.page.locator('#Input_CustomerSearchName');
    await expect(customerSearch).toBeVisible({ timeout: UI_TIMEOUT });
    await customerSearch.fill('3M Canada Company');
    const customerOption = customerPicker.getByRole('option', {
      name: '3M Canada Company',
      exact: true,
    });
    await expect(customerOption).toBeVisible({ timeout: LOGIN_TIMEOUT });
    await customerOption.click();

    await this.page
      .locator('select[id$="-List_Dropdown_Type2"]')
      .selectOption({ label: 'Sample' });
    await this.page.getByPlaceholder('Enter item title or description').fill('Test Sample');
    await expect(this.page.locator('#Loader')).toBeHidden({ timeout: LOGIN_TIMEOUT });
    await this.page.locator('#Btn_SavePrint').click();
    const qrDialog = this.page.getByRole('dialog').filter({ hasText: 'Print QR Codes' });
    await expect(qrDialog).toBeVisible({ timeout: LOGIN_TIMEOUT });
    return qrDialog;
  }

  async printAndCancelQr(qrDialog) {
    const printWindowPromise = this.page.waitForEvent('popup');
    await qrDialog.getByRole('button', { name: 'Print All QR Codes' }).click();
    const printWindow = await printWindowPromise;
    await printWindow.keyboard.press('Escape');
    if (!printWindow.isClosed()) {
      await printWindow.close();
    }
    await expect(this.page).toHaveURL(/\/SamplesListing/, {
      timeout: LOGIN_TIMEOUT,
    });
  }

  async extractSampleId() {
    await this.page
      .getByRole('searchbox', { name: 'Search by customer, project, sample ID, or more' })
      .fill('Test Sample');
    const sampleRow = this.page.getByRole('row').filter({ hasText: 'Test Sample' }).first();
    await expect(sampleRow).toBeVisible({ timeout: LOGIN_TIMEOUT });
    const rowSampleId = (await sampleRow.innerText()).match(/SMP\d+\s*-\s*\d+/)?.[0];
    if (!rowSampleId) {
      throw new Error(`Could not read the Sample ID from: ${await sampleRow.innerText()}`);
    }

    await sampleRow.getByRole('link', { name: rowSampleId, exact: true }).click();
    await expect(this.page).toHaveURL(/\/SampleDetails/, {
      timeout: LOGIN_TIMEOUT,
    });
    const detailsScreen = this.page.locator('.active-screen:not(.fade-leave-active)').first();
    await expect(detailsScreen).toContainText(rowSampleId, { timeout: LOGIN_TIMEOUT });
    await expect(detailsScreen).toContainText('3M Canada Company', {
      timeout: LOGIN_TIMEOUT,
    });
    const sampleDetails = await detailsScreen.innerText();
    const sampleId = sampleDetails.match(/SMP\d+\s*-\s*\d+/)?.[0];
    if (!sampleId) {
      throw new Error(`Could not read the Sample ID from sample details: ${sampleDetails}`);
    }
    return sampleId;
  }
}