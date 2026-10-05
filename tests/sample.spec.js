import { test } from '@playwright/test';
import { SamplePage } from '../pages/sample.page.js';

test.setTimeout(120_000);

test('creates a test sample and customer shipment', async ({ page }) => {
  const { BASE_URL, TEST_USERNAME, TEST_PASSWORD } = process.env;
  if (!BASE_URL || !TEST_USERNAME || !TEST_PASSWORD) {
    throw new Error('Set BASE_URL, TEST_USERNAME, and TEST_PASSWORD in the local .env file.');
  }

  const samplePage = new SamplePage(page);
  await samplePage.signIn(BASE_URL, TEST_USERNAME, TEST_PASSWORD);
  await samplePage.openSamples();
  await samplePage.openNewSample();
  const qrDialog = await samplePage.createTestSample();
  await samplePage.printAndCancelQr(qrDialog);
  const sampleId = await samplePage.extractSampleId();
  console.log(`Sample created successfully | Sample ID: ${sampleId}`);
  await samplePage.openShipments();
  await samplePage.openNewShipment();
});