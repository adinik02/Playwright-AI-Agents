import { expect, test } from '@playwright/test';
import { EquipmentFavouritePage } from '../pages/equipment-favourite.page.js';

test.setTimeout(120_000);

test('marks three global equipment items as favourites', async ({ page }) => {
  const { BASE_URL, TEST_USERNAME, TEST_PASSWORD } = process.env;
  if (!BASE_URL || !TEST_USERNAME || !TEST_PASSWORD) {
    throw new Error('Set BASE_URL, TEST_USERNAME, and TEST_PASSWORD in the local .env file.');
  }

  const equipmentPage = new EquipmentFavouritePage(page);
  await equipmentPage.signIn(BASE_URL, TEST_USERNAME, TEST_PASSWORD);
  await equipmentPage.openEquipmentList();
  await equipmentPage.selectGlobalAndSetPageSize();
  const assetIds = await equipmentPage.favoriteThreeEquipment();

  expect(assetIds).toHaveLength(3);
  expect(new Set(assetIds).size).toBe(3);
  console.log(`Marked equipment as favourites | Asset IDs: ${assetIds.join(', ')}`);
  await page.close();
});