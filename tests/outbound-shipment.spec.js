import { test } from '@playwright/test';
import { OutboundShipmentPage } from '../pages/outbound-shipment.page.js';

test.setTimeout(120_000);

test.describe('Normal Outbound', () => {
  test('creates an outbound customer-sample shipment', async ({ page }) => {
    const { BASE_URL, TEST_USERNAME, TEST_PASSWORD } = process.env;
    if (!BASE_URL || !TEST_USERNAME || !TEST_PASSWORD) {
      throw new Error('Set BASE_URL, TEST_USERNAME, and TEST_PASSWORD in the local .env file.');
    }

    const shipmentPage = new OutboundShipmentPage(page);
    await shipmentPage.signIn(BASE_URL, TEST_USERNAME, TEST_PASSWORD);
    await shipmentPage.openNewShipment();
    await shipmentPage.selectOutboundCustomerSample();
    await shipmentPage.completeBasicDetails();
    await shipmentPage.selectRequestedSample();
    await shipmentPage.completeContentDetails();
    const result = await shipmentPage.createShipment();
    console.log(`${result.successMessage} | Shipment ID: ${result.shipmentId}`);
  });
});

test.describe('Outbound NCS', () => {
  test('creates an outbound non-customer-sample shipment', async ({ page }) => {
    const { BASE_URL, TEST_USERNAME, TEST_PASSWORD } = process.env;
    if (!BASE_URL || !TEST_USERNAME || !TEST_PASSWORD) {
      throw new Error('Set BASE_URL, TEST_USERNAME, and TEST_PASSWORD in the local .env file.');
    }

    const shipmentPage = new OutboundShipmentPage(page);
    await shipmentPage.signIn(BASE_URL, TEST_USERNAME, TEST_PASSWORD);
    await shipmentPage.openNewShipment();
    await shipmentPage.selectOutboundNonCustomerSample();
    await shipmentPage.completeNonCustomerBasicDetails();
    await shipmentPage.completeNonCustomerContentDetails();
    const result = await shipmentPage.createShipment();
    console.log(`${result.successMessage} | Shipment ID: ${result.shipmentId}`);
  });
});

test.describe('Outbound NCS2', () => {
  test('creates an outbound non-customer-sample shipment with return to CSA', async ({ page }) => {
    const { BASE_URL, TEST_USERNAME, TEST_PASSWORD } = process.env;
    if (!BASE_URL || !TEST_USERNAME || !TEST_PASSWORD) {
      throw new Error('Set BASE_URL, TEST_USERNAME, and TEST_PASSWORD in the local .env file.');
    }

    const shipmentPage = new OutboundShipmentPage(page);
    await shipmentPage.signIn(BASE_URL, TEST_USERNAME, TEST_PASSWORD);
    await shipmentPage.openNewShipment();
    await shipmentPage.selectOutboundNonCustomerSample(true);
    await shipmentPage.completeNonCustomerBasicDetails();
    await shipmentPage.completeNonCustomerContentDetails();
    const result = await shipmentPage.createShipment();
    console.log(`${result.successMessage} | Shipment ID: ${result.shipmentId}`);
  });
});

test.describe('Outbound2', () => {
  test('creates an outbound customer-sample shipment with return to CSA', async ({ page }) => {
    const { BASE_URL, TEST_USERNAME, TEST_PASSWORD } = process.env;
    if (!BASE_URL || !TEST_USERNAME || !TEST_PASSWORD) {
      throw new Error('Set BASE_URL, TEST_USERNAME, and TEST_PASSWORD in the local .env file.');
    }

    const shipmentPage = new OutboundShipmentPage(page);
    await shipmentPage.signIn(BASE_URL, TEST_USERNAME, TEST_PASSWORD);
    await shipmentPage.openNewShipment();
    await shipmentPage.selectOutboundCustomerSampleWithReturn();
    await shipmentPage.completeBasicDetails();
    await shipmentPage.selectTwoAvailableSamples();
    await shipmentPage.completeTwoSampleContentDetails();
    const result = await shipmentPage.createShipment();
    console.log(`${result.successMessage} | Shipment ID: ${result.shipmentId}`);
  });
});