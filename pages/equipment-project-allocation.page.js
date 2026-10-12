import { expect } from '@playwright/test';
import { EquipmentFavouritePage } from './equipment-favourite.page.js';

const LOGIN_TIMEOUT = 30_000;

export class EquipmentProjectAllocationPage extends EquipmentFavouritePage {
  async selectGlobalEquipment() {
    const globalTab = this.page.getByRole('tab', { name: /Global/ });
    await expect(globalTab).toBeVisible({ timeout: LOGIN_TIMEOUT });
    await globalTab.click();
    await expect(globalTab).toHaveAttribute('aria-selected', 'true');
  }

  async openProjectChooser(assetId) {
    const equipmentRow = this.page.getByRole('row').filter({ hasText: assetId }).first();
    await expect(equipmentRow).toBeVisible({ timeout: LOGIN_TIMEOUT });
    await equipmentRow.getByRole('button', { name: 'Trigger the balloon' }).click();

    const addToProjectOption = this.page.getByRole('menuitem', { name: /Add to Project/i });
    await expect(addToProjectOption).toBeVisible({ timeout: LOGIN_TIMEOUT });
    await expect(addToProjectOption).toBeEnabled();
    await addToProjectOption.evaluate((option) => option.click());

    const projectDialog = this.page.getByRole('dialog').last();
    await expect(projectDialog).toBeVisible({ timeout: LOGIN_TIMEOUT });
    return projectDialog;
  }

  async addToFirstProject(projectDialog) {
    await projectDialog.getByPlaceholder('Search by Project ID or Name.').fill('a');
    const projectRow = projectDialog.getByRole('row').nth(1);
    await expect(projectRow).toBeVisible({ timeout: LOGIN_TIMEOUT });
    const projectId = (await projectRow.getByRole('gridcell').first().innerText()).trim();
    expect(projectId).toMatch(/^\d{8}$/);
    await projectRow.getByRole('link', { name: /Add to Project/i }).click();
    return projectId;
  }
}