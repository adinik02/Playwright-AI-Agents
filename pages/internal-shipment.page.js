import { expect } from '@playwright/test';
import { OutboundShipmentPage } from './outbound-shipment.page.js';

const LOGIN_TIMEOUT = 30_000;

export class InternalShipmentPage extends OutboundShipmentPage {
  async selectInternalCustomerSample() {
    await this.page.getByRole('radio', { name: 'Internal (From CSA to CSA)' }).check();
    await this.page.getByRole('radio', { name: 'Customer Samples', exact: true }).check();
  }

  async selectInternalNonCustomerSample() {
    await this.page.getByRole('radio', { name: 'Internal (From CSA to CSA)' }).check();
    await this.page
      .getByRole('radio', {
        name: 'Non-Customer Samples (i.e. Workday orders, CSA calibration equipment, ...)',
        exact: true,
      })
      .check();
  }

  async completeInternalBasicDetails(receiverLocation = 'Cleveland') {
    await this.chooseSearchOption('Dropdown_Locations', 'Cleveland', /Cleveland/i);
    await this.chooseSearchOption(
      'Receiver_sDropdown_Location2',
      receiverLocation,
      new RegExp(receiverLocation, 'i'),
    );
    await this.chooseSearchOption(
      'DropdownSearch_PrimaryInformant',
      'Aditya Mathuria',
      'Aditya Mathuria',
    );
    await this.page.getByRole('button', { name: /Next: Content Details/ }).click();
    await expect(this.page.getByRole('tab', { name: 'Content Details' })).toHaveClass(
      /active/,
      { timeout: LOGIN_TIMEOUT },
    );
  }

  async selectTwoAvailableSamples() {
    const sampleRows = this.page.getByRole('row').filter({ hasText: /SMP/i });
    await expect(sampleRows.nth(1)).toBeVisible({ timeout: LOGIN_TIMEOUT });
    await sampleRows.nth(0).getByRole('checkbox').check();
    await sampleRows.nth(1).getByRole('checkbox').check();
  }

  async completeTwoSampleContentDetails() {
    const hsCodes = this.page.getByPlaceholder('Enter HS-code');
    const costs = this.page.getByPlaceholder('Enter cost');
    const comments = this.page.getByPlaceholder('Enter comment');

    for (let index = 0; index < 2; index += 1) {
      await hsCodes.nth(index).fill('0001');
      await costs.nth(index).fill('1000');
      await comments.nth(index).fill('Internal sample');
    }

    await this.page.getByRole('button', { name: /Next: Special Instructions/ }).click();
    await expect(this.page.getByRole('tab', { name: 'Special Instructions' })).toHaveClass(
      /active/,
      { timeout: LOGIN_TIMEOUT },
    );
  }

  async completeNcsContentDetails() {
    await this.page
      .getByPlaceholder('Enter item title or description')
      .fill('Internal NCS Sample');
    await this.page.getByPlaceholder('Enter item identifier').fill('INT-NCS-001');
    await this.page.getByPlaceholder('Enter HS-code').fill('0001');
    await this.page.getByRole('spinbutton', { name: 'Cost' }).fill('1000');
    await this.page.getByRole('spinbutton', { name: 'Quantity' }).fill('1');
    await this.page.getByPlaceholder('Enter comment').first().fill('Internal NCS shipment');
    await this.page.getByRole('button', { name: /Next: Special Instructions/ }).click();
    await expect(this.page.getByRole('tab', { name: 'Special Instructions' })).toHaveClass(
      /active/,
      { timeout: LOGIN_TIMEOUT },
    );
  }
}