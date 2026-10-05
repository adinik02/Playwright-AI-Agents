import { test } from '@playwright/test';
import { OutboundNcsShipmentPage } from '../pages/outbound-ncs-shipment.page.js';

test.setTimeout(120_000);

test('creates an outbound non-customer-sample shipment with return to CSA', async ({ page }) => {
  const { BASE_URL, TEST_USERNAME, TEST_PASSWORD } = process.env;
  if (!BASE_URL || !TEST_USERNAME || !TEST_PASSWORD) {
    throw new Error('Set BASE_URL, TEST_USERNAME, and TEST_PASSWORD in the local .env file.');
  }

  const shipmentPage = new OutboundNcsShipmentPage(page);
  await shipmentPage.signIn(BASE_URL, TEST_USERNAME, TEST_PASSWORD);
  await shipmentPage.openNewShipment();
  await shipmentPage.selectOutboundNonCustomerSample(true);
  await shipmentPage.completeNonCustomerBasicDetails();
  await shipmentPage.completeNonCustomerContentDetails();
  const result = await shipmentPage.createShipment();
  console.log(`${result.successMessage} | Shipment ID: ${result.shipmentId}`);
});