import { test } from '@playwright/test';
import { Outbound2ShipmentPage } from '../pages/outbound2-shipment.page.js';

test.setTimeout(120_000);

test('creates an outbound customer-sample shipment with return to CSA', async ({ page }) => {
  const { BASE_URL, TEST_USERNAME, TEST_PASSWORD } = process.env;
  if (!BASE_URL || !TEST_USERNAME || !TEST_PASSWORD) {
    throw new Error('Set BASE_URL, TEST_USERNAME, and TEST_PASSWORD in the local .env file.');
  }

  const shipmentPage = new Outbound2ShipmentPage(page);
  await shipmentPage.signIn(BASE_URL, TEST_USERNAME, TEST_PASSWORD);
  await shipmentPage.openNewShipment();
  await shipmentPage.selectOutboundCustomerSampleWithReturn();
  await shipmentPage.completeBasicDetails();
  await shipmentPage.selectTwoAvailableSamples();
  await shipmentPage.completeTwoSampleContentDetails();
  const result = await shipmentPage.createShipment();
  console.log(`${result.successMessage} | Shipment ID: ${result.shipmentId}`);
});