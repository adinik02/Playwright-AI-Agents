import { expect, test } from '@playwright/test';
import { EquipmentProjectAllocationPage } from '../pages/equipment-project-allocation.page.js';

test.setTimeout(120_000);

test('allocates equipment to a project', async ({ page }) => {
  const { BASE_URL, TEST_USERNAME, TEST_PASSWORD } = process.env;
  if (!BASE_URL || !TEST_USERNAME || !TEST_PASSWORD) {
    throw new Error('Set BASE_URL, TEST_USERNAME, and TEST_PASSWORD in the local .env file.');
  }

  const equipmentPage = new EquipmentProjectAllocationPage(page);
  await equipmentPage.signIn(BASE_URL, TEST_USERNAME, TEST_PASSWORD);
  await equipmentPage.openEquipmentList();
  await equipmentPage.selectGlobalEquipment();
  const projectDialog = await equipmentPage.openProjectChooser('00010031');
  const projectId = await equipmentPage.addToFirstProject(projectDialog);
  const doneButton = projectDialog.getByRole('button', { name: 'Done', exact: true });
  await expect(doneButton).toBeVisible({ timeout: 30_000 });
  await doneButton.click();

  const successMessage = page.getByRole('alert').filter({
    hasText: /project added successfully|equipment allocated successfully/i,
  });
  await expect(successMessage).toBeVisible({ timeout: 30_000 });
  await expect(successMessage).toContainText(/success/i);
  console.log(
    `Project added successfully | Asset ID: 00010031 | Project ID: ${projectId} | ${await successMessage.innerText()}`,
  );
  await page.close();
});