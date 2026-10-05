import { expect } from '@playwright/test';
import { OutboundShipmentPage } from './outbound-shipment.page.js';

const LOGIN_TIMEOUT = 30_000;

export class OutboundNcsShipmentPage extends OutboundShipmentPage {
  async selectOutboundNonCustomerSample(returnToIssuingCsa = false) {
    await this.page.getByRole('radio', { name: 'Outbound (From CSA to X)' }).check();
    await this.page
      .getByRole('radio', {
        name: 'Non-Customer Samples (i.e. Workday orders, CSA calibration equipment, ...)',
        exact: true,
      })
      .check();
    await this.page
      .getByRole('radio', {
        name: returnToIssuingCsa ? 'Yes' : 'No',
        exact: true,
      })
      .check();
  }

  async selectLocation() {
    const combobox = this.page.locator('#Dropdown_Locations [role="combobox"]');
    await combobox.click();
    const popupId = await combobox.getAttribute('aria-controls');
    const popup = this.page.locator(`#${popupId}`);
    const location = popup.getByRole('option', { name: /Cleveland/i });
    await expect(location.first()).toBeVisible({ timeout: LOGIN_TIMEOUT });
    await location.first().click();
  }

  async completeNonCustomerBasicDetails() {
    await this.selectLocation();
    await this.page.getByRole('textbox', { name: 'Receiver Name' }).fill('3M Canada Company');
    await this.page.getByLabel(/Receiver Address/i).fill('Sample Address');
    await this.page.getByRole('button', { name: /Next: Content Details/ }).click();
    await expect(this.page.getByRole('tab', { name: 'Content Details' })).toHaveClass(
      /active/,
      { timeout: LOGIN_TIMEOUT },
    );
  }

  async completeNonCustomerContentDetails() {
    await this.page
      .getByPlaceholder('Enter item title or description')
      .fill('Sample Testing Item');
    await this.page.getByPlaceholder('Enter item identifier').fill('ID-0001');
    await this.page.getByPlaceholder('Enter HS-code').fill('HS0001');
    await this.page.getByRole('spinbutton', { name: 'Cost' }).fill('1001');
    await this.page.getByRole('spinbutton', { name: 'Quantity' }).fill('50');
    await this.page.getByPlaceholder('Enter comment').first().fill('None');
    await this.page.getByRole('button', { name: /Next: Special Instructions/ }).click();
    await expect(this.page.getByRole('tab', { name: 'Special Instructions' })).toHaveClass(
      /active/,
      { timeout: LOGIN_TIMEOUT },
    );
  }
}