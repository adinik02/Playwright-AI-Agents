import { expect } from '@playwright/test';
import { InternalShipmentPage } from './internal-shipment.page.js';

const LOGIN_TIMEOUT = 30_000;

export class InternalNcsShipmentPage extends InternalShipmentPage {
  async selectInternalNonCustomerSample() {
    await this.page.getByRole('radio', { name: 'Internal (From CSA to CSA)' }).check();
    await this.page
      .getByRole('radio', {
        name: 'Non-Customer Samples (i.e. Workday orders, CSA calibration equipment, ...)',
        exact: true,
      })
      .check();
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