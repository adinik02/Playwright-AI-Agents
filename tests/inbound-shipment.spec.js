import { test } from '@playwright/test';
import { InboundShipmentPage } from '../pages/inbound-shipment.page.js';

test.setTimeout(120_000);

test.describe('Normal Inbound', () => {
  test('creates an inbound customer-sample shipment', async ({ page }) => {
    const { BASE_URL, TEST_USERNAME, TEST_PASSWORD } = process.env;
    if (!BASE_URL || !TEST_USERNAME || !TEST_PASSWORD) {
      throw new Error('Set BASE_URL, TEST_USERNAME, and TEST_PASSWORD in the local .env file.');
    }

    const shipmentPage = new InboundShipmentPage(page);
    await shipmentPage.signIn(BASE_URL, TEST_USERNAME, TEST_PASSWORD);
    await shipmentPage.openNewShipment();
    await shipmentPage.selectInboundCustomerSample();
    await shipmentPage.completeBasicDetails();
    await shipmentPage.completeContentDetails();
    const result = await shipmentPage.createShipment();
    console.log(`${result.successMessage} | Shipment ID: ${result.shipmentId}`);
  });
});

test.describe('Inbound NCS', () => {
  test('creates an inbound non-customer-sample shipment', async ({ page }) => {
    const { BASE_URL, TEST_USERNAME, TEST_PASSWORD } = process.env;
    if (!BASE_URL || !TEST_USERNAME || !TEST_PASSWORD) {
      throw new Error('Set BASE_URL, TEST_USERNAME, and TEST_PASSWORD in the local .env file.');
    }

    const shipmentPage = new InboundShipmentPage(page);
    await shipmentPage.signIn(BASE_URL, TEST_USERNAME, TEST_PASSWORD);
    await shipmentPage.openNewShipment();
    await shipmentPage.selectInboundNonCustomerSample();
    await shipmentPage.completeBasicDetails();
    await shipmentPage.completeNcsContentDetails();
    const result = await shipmentPage.createShipment();
    console.log(`${result.successMessage} | Shipment ID: ${result.shipmentId}`);
  });
});