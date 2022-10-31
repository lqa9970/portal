import { test, expect } from '@playwright/test'
import * as dotenv from 'dotenv'
dotenv.config()

const login = async (page) => {
  await page.goto('http://localhost:3000/')
  await page
    .getByPlaceholder(/Email/)
    .fill(process.env.CYPRESS_TEST_USERNAME as string)
  await page.getByRole('button', { name: 'Next' }).click()
  await page
    .getByPlaceholder(/Password/)
    .fill(process.env.CYPRESS_TEST_PASSWORD as string)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.getByRole('button', { name: 'Yes' }).click()
  await expect(page).toHaveURL('http://localhost:3000/projects')
}

test('user are able to login', async ({ page }) => {
  await login(page)
})

test('home page contains welcome message', async ({ page }) => {
  await login(page)
  await expect(
    page.getByRole('heading', { name: 'Welcome, Technical DevOps Foundation' })
  ).toBeVisible()
})

test('can see project list', async ({ page }) => {
  await login(page)
  await expect(page.getByText(/tesa-sandbox/)).toBeVisible()
  await expect(page.getByText(/tepa-dev/)).toBeVisible()
  await expect(page.getByText(/tepa-prod/)).toBeVisible()
})

test('can navigate to sandbox form', async ({ page }) => {
  await login(page)
  await page.locator('[data-cy="create-sandbox"]').click()
  await expect(page.getByText(/New Sandbox/)).toBeVisible()
  await expect(page.getByText(/Application type/)).toBeVisible()
  await expect(page.getByText(/Application short name/)).toBeVisible()
  await expect(page.getByText(/Application detail/)).toBeVisible()
  await expect(
    page.getByText(/Organisation unit or Business domain/)
  ).toBeVisible()
  await expect(page.getByText(/Application administrator/)).toBeVisible()
  await expect(page.getByText(/Cost center/)).toBeVisible()
  await expect(page.getByText(/Privacy data/)).toBeVisible()
  await expect(page.getByText(/Data Classification/)).toBeVisible()
})
test('can navigate to project form', async ({ page }) => {
  await login(page)
  await page.locator('[data-cy="create-project"]').click()
  await expect(page.getByText(/New Project/)).toBeVisible()
  await expect(page.getByText(/Application type/)).toBeVisible()
  await expect(page.getByText(/Application Operating system/)).toBeVisible()
  await expect(page.getByText(/Environment type/)).toBeVisible()
  await expect(page.getByText(/Create dedicated environment/)).toBeVisible()
  await expect(page.getByText(/Application short name/)).toBeVisible()
  await expect(page.getByText(/Application detail/)).toBeVisible()
  await expect(
    page.getByText(/Organisation unit or Business domain/)
  ).toBeVisible()
  await expect(page.getByText(/Application administrator/)).toBeVisible()
  await expect(page.getByText(/Cost center/)).toBeVisible()
  await expect(page.getByText(/Efecte \(CMDB\) Application name/)).toBeVisible()
  await expect(page.getByText(/Efecte \(CMDB\) Application ID/)).toBeVisible()
  await expect(page.getByText(/Privacy data/)).toBeVisible()
  await expect(page.getByText(/Data Classification/)).toBeVisible()
  await expect(page.getByText(/Infrastructure business partner/)).toBeVisible()
})

test('sandbox form show errors messages for required fields', async ({
  page,
}) => {
  await login(page)
  await page.locator('[data-cy="create-sandbox"]').click()
  await expect(page.getByText(/New Sandbox/)).toBeVisible()
  await page.waitForTimeout(1000)
  await page.locator('[data-cy="submit"]').click()
  await expect(page.getByText('Required').first()).toBeVisible()
})
test('show errors messages for applicationShortName', async ({ page }) => {
  await login(page)
  await page.locator('[data-cy="create-sandbox"]').click()
  await expect(page.getByText(/New Sandbox/)).toBeVisible()
  await page.waitForTimeout(1000)
  await page.locator('[data-cy="submit"]').click()

  const applicationShortNameInput = await page.locator(
    '[name="applicationShortName"]'
  )
  await applicationShortNameInput.fill('1')
  await expect(page.getByText('Only letters')).toBeVisible()
  await applicationShortNameInput.fill('abcaa')
  await expect(page.getByText('Max 4 characters')).toBeVisible()
  await applicationShortNameInput.fill('tesa')
  await expect(
    page.getByText('Short name is not available. Please use another short name')
  ).toBeVisible()
})
test('show errors messages for costCenter', async ({ page }) => {
  await login(page)
  await page.locator('[data-cy="create-sandbox"]').click()
  await expect(page.getByText(/New Sandbox/)).toBeVisible()
  await page.waitForTimeout(1000)
  await page.locator('[data-cy="submit"]').click()

  const costCenterInput = await page.locator('[name="costCenter"]')
  await costCenterInput.fill('a')
  await expect(page.getByText('Numbers only')).toBeVisible()
})
