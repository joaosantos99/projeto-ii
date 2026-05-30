import { test, expect } from '@playwright/test'

// All API calls are mocked so these specs need no running backend.
const USER = { id: 1, email: 'user@municipio.pt', fullName: 'Test User', role: 'admin' }

/** Stub every API call; override `/auth/login` per test. */
async function stubApi(page, { login }) {
  await page.route('**/api/auth/login', login)
  // Fallback for any other API call the app fires (dashboard, /auth/me, ...).
  await page.route('**/api/**', (route) => {
    if (route.request().url().includes('/api/auth/login')) return route.fallback()
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
  })
}

/** Navigate and wait for the client bundle to hydrate before interacting. */
async function gotoLogin(page) {
  await page.goto('/login')
  await page.waitForLoadState('networkidle')
}

async function submitLogin(page, email, password) {
  await page.locator('#email').fill(email)
  await page.locator('#password').fill(password)
  await page.getByRole('button', { name: 'Iniciar sessão' }).click()
}

test.describe('login page', () => {
  test('renders the login form', async ({ page }) => {
    await test.step('Given a visitor opens the login page', async () => {
      await gotoLogin(page)
    })

    await test.step('Then the login form is shown', async () => {
      await expect(page.getByText('Bem-vindo de volta')).toBeVisible()
      await expect(page.locator('#email')).toBeVisible()
      await expect(page.locator('#password')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Iniciar sessão' })).toBeVisible()
    })
  })

  test('shows an error on invalid credentials', async ({ page }) => {
    await test.step('Given the login endpoint rejects the credentials', async () => {
      await stubApi(page, {
        login: (route) =>
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
      await expect(page).toHaveURL(/\/login/)
    })
  })

  test('logs in and redirects to /admin', async ({ page }) => {
    await test.step('Given the login endpoint accepts the credentials', async () => {
      await stubApi(page, {
        login: (route) =>
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

  test('redirects authenticated users away from /login', async ({ page }) => {
    await test.step('Given the visitor already has a session', async () => {
      await stubApi(page, { login: (route) => route.fulfill({ status: 200, body: '{}' }) })
      await page.addInitScript(() => {
        document.cookie = 'token=fake-token; path=/'
        localStorage.setItem('user', JSON.stringify({ id: 1, email: 'user@municipio.pt' }))
      })
    })

    await test.step('When they open the login page', async () => {
      await page.goto('/login')
    })

    await test.step('Then they are redirected to /admin', async () => {
      await expect(page).toHaveURL(/\/admin/)
    })
  })
})
