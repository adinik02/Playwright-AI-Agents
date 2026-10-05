import { expect } from '@playwright/test';
import { OutboundShipmentPage } from './outbound-shipment.page.js';

const LOGIN_TIMEOUT = 30_000;

export class Outbound2ShipmentPage extends OutboundShipmentPage {
  async selectOutboundCustomerSampleWithReturn() {
    await this.page.getByRole('radio', { name: 'Outbound (From CSA to X)' }).check();
    await this.page.getByRole('radio', { name: 'Customer Samples', exact: true }).check();
    await this.page.getByRole('radio', { name: 'Yes', exact: true }).check();
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
      await comments.nth(index).fill('Outbound 2 sample');
    }

    await this.page.getByRole('button', { name: /Next: Special Instructions/ }).click();
    await expect(this.page.getByRole('tab', { name: 'Special Instructions' })).toHaveClass(
      /active/,
      { timeout: LOGIN_TIMEOUT },
    );
  }
}