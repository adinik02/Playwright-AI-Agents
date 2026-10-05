import { test } from '@playwright/test';
import { InternalShipmentPage } from '../pages/internal-shipment.page.js';

test.setTimeout(120_000);

test.describe('Normal Internal', () => {
  test('creates an internal customer-sample shipment', async ({ page }) => {
    const { BASE_URL, TEST_USERNAME, TEST_PASSWORD } = process.env;
    if (!BASE_URL || !TEST_USERNAME || !TEST_PASSWORD) {
      throw new Error('Set BASE_URL, TEST_USERNAME, and TEST_PASSWORD in the local .env file.');
    }

    const shipmentPage = new InternalShipmentPage(page);
    await shipmentPage.signIn(BASE_URL, TEST_USERNAME, TEST_PASSWORD);
    await shipmentPage.openNewShipment();
    await shipmentPage.selectInternalCustomerSample();
    await shipmentPage.completeInternalBasicDetails();
    await shipmentPage.selectTwoAvailableSamples();
    await shipmentPage.completeTwoSampleContentDetails();
    const result = await shipmentPage.createShipment();
    console.log(`${result.successMessage} | Shipment ID: ${result.shipmentId}`);
  });
});

test.describe('Internal NCS', () => {
  test('creates an internal non-customer-sample shipment', async ({ page }) => {
    const { BASE_URL, TEST_USERNAME, TEST_PASSWORD } = process.env;
    if (!BASE_URL || !TEST_USERNAME || !TEST_PASSWORD) {
      throw new Error('Set BASE_URL, TEST_USERNAME, and TEST_PASSWORD in the local .env file.');
    }

    const shipmentPage = new InternalShipmentPage(page);
    await shipmentPage.signIn(BASE_URL, TEST_USERNAME, TEST_PASSWORD);
    await shipmentPage.openNewShipment();
    await shipmentPage.selectInternalNonCustomerSample();
    await shipmentPage.completeInternalBasicDetails('Bangalore');
    await shipmentPage.completeNcsContentDetails();
    const result = await shipmentPage.createShipment();
    console.log(`${result.successMessage} | Shipment ID: ${result.shipmentId}`);
  });
});