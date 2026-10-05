import { randomUUID } from 'node:crypto';
import { test } from '@playwright/test';
import { PackageManagementPage } from '../pages/package-management.page.js';

test.use({ trace: 'off' });

test.describe('Package management', () => {
  test('creates a package with an associated test and equipment', async ({ page }) => {
    const { BASE_URL, TEST_USERNAME, TEST_PASSWORD } = process.env;
    if (!BASE_URL || !TEST_USERNAME || !TEST_PASSWORD) {
      throw new Error(
        'Set BASE_URL, TEST_USERNAME, and TEST_PASSWORD in the local .env file.',
      );
    }

    const packageName = `Package - AT-${randomUUID().slice(0, 8)}`;
    const packagePage = new PackageManagementPage(page);
    await packagePage.open(BASE_URL);
    await packagePage.signIn(TEST_USERNAME, TEST_PASSWORD);
    await packagePage.openMyPackages();
    await packagePage.createPackage({
      packageName,
      associatedTest: 'Associated Test - AT(1)',
      equipmentId: 'EM-300',
    });
    console.log(`Package created successfully | Package Name: ${packageName}`);
  });
});