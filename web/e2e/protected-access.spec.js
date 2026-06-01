import { test, expect } from '@playwright/test'
import { stubApi } from './helpers/api'


// Protected endpoints behind <RequireAuth>.
const PROTECTED_ROUTES = ['/admin/utilizadores', '/admin/roles', '/admin/conta']

test.describe('protected route access without a token', () => {
  test('redirects an anonymous visitor from /admin to /login', async ({ page }) => {
    await test.step('Given a visitor with no session token', async () => {
      await stubApi(page)
    })

    await test.step('When they open the protected /admin endpoint', async () => {
      await page.goto('/admin')
    })

    await test.step('Then they are redirected to /login and see the login form', async () => {
      await expect(page).toHaveURL(/\/login/)
      await expect(page.getByText('Bem-vindo de volta')).toBeVisible()
    })
  })

  for (const route of PROTECTED_ROUTES) {
    test(`redirects an anonymous visitor from ${route} to /login`, async ({ page }) => {
      await test.step('Given a visitor with no session token', async () => {
        await stubApi(page)
      })

      await test.step(`When they open the protected ${route} endpoint`, async () => {
        await page.goto(route)
      })

      await test.step('Then they are redirected to /login', async () => {
        await expect(page).toHaveURL(/\/login/)
      })
    })
  }

  test('never renders protected content for an anonymous visitor', async ({ page }) => {
    await test.step('Given a visitor with no session token', async () => {
      await stubApi(page)
    })

    await test.step('When they try to open the users management endpoint', async () => {
      await page.goto('/admin/utilizadores')
      await page.waitForURL(/\/login/)
    })

    await test.step('Then no /admin URL is exposed and the login form is shown', async () => {
      await expect(page).not.toHaveURL(/\/admin/)
      await expect(page.locator('#email')).toBeVisible()
      await expect(page.locator('#password')).toBeVisible()
    })
  })

  test('redirects to /login when the token is rejected by the server (401)', async ({ page }) => {
    await test.step('Given a stale token cookie that the server rejects', async () => {
      await stubApi(page, {
        'auth/me': (route) =>
          route.fulfill({
            status: 401,
            contentType: 'application/json',
            body: JSON.stringify({ description: 'Token inválido ou expirado' }),
          }),
      })
      await page.addInitScript(() => {
        document.cookie = 'token=expired-token; path=/'
      })
    })

    await test.step('When they open the protected /admin endpoint', async () => {
      await page.goto('/admin')
    })

    await test.step('Then the session is cleared and they land on /login', async () => {
      await expect(page).toHaveURL(/\/login/)
      await expect(page.getByText('Bem-vindo de volta')).toBeVisible()
    })
  })
})
