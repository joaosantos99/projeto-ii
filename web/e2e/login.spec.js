import { test, expect } from '@playwright/test'
import { stubApi } from './helpers/api'

// All API calls are mocked so these specs need no running backend.
const USER = { id: 1, email: 'user@municipio.pt', fullName: 'Test User', role: 'admin' }

/** Navigate and wait for the client bundle to hydrate before interacting. */
async function gotoLogin(page) {
  await page.goto('/admin/login')
  await page.waitForLoadState('networkidle')
}

async function submitLogin(page, email, password) {
  await page.locator('#email').fill(email)
  await page.locator('#password').fill(password)
  await page.getByRole('button', { name: 'Iniciar sessão' }).click()
}

test.describe('login with invalid and valid credentials', () => {
  test('shows an error and stays on /login with invalid credentials', async ({ page }) => {
    await test.step('Given the login endpoint rejects the credentials', async () => {
      await stubApi(page, {
        'users/login': (route) =>
          route.fulfill({
            status: 401,
            contentType: 'application/json',
            body: JSON.stringify({ description: 'Credenciais inválidas.' }),
          }),
      })
      await gotoLogin(page)
    })

    await test.step('When the visitor submits wrong credentials', async () => {
      await submitLogin(page, 'wrong@municipio.pt', 'badpassword')
    })

    await test.step('Then an error message is shown and they stay on /login', async () => {
      await expect(page.getByRole('alert')).toHaveText('Credenciais inválidas.')
      await expect(page).toHaveURL(/\/admin\/login/)
    })
  })

  test('logs in and redirects to /admin with valid credentials', async ({ page }) => {
    await test.step('Given the login endpoint accepts the credentials', async () => {
      await stubApi(page, {
        'users/login': (route) =>
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ token: 'fake-token', user: USER }),
          }),
      })
      await gotoLogin(page)
    })

    await test.step('When the visitor submits valid credentials', async () => {
      await submitLogin(page, 'user@municipio.pt', 'correcthorse')
    })

    await test.step('Then they are redirected to /admin', async () => {
      await expect(page).toHaveURL(/\/admin/)
    })
  })

  test('does not redirect when the server errors on login', async ({ page }) => {
    await test.step('Given the login endpoint fails with a server error', async () => {
      await stubApi(page, {
        'users/login': (route) =>
          route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ description: 'Erro ao iniciar sessão.' }),
          }),
      })
      await gotoLogin(page)
    })

    await test.step('When the visitor submits credentials', async () => {
      await submitLogin(page, 'user@municipio.pt', 'correcthorse')
    })

    await test.step('Then a generic error is shown and they stay on /login', async () => {
      await expect(page.getByRole('alert')).toHaveText('Erro ao iniciar sessão.')
      await expect(page).toHaveURL(/\/admin\/login/)
    })
  })
})
