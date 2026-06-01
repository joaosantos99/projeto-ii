import { test, expect } from '@playwright/test'
import { stubApi } from './helpers/api'

test.describe('redirect to login when there is no session', () => {
  test('serves the public landing page at the root path "/"', async ({ page }) => {
    await test.step('Given a visitor with no session token', async () => {
      await stubApi(page)
    })

    await test.step('When they open the site root', async () => {
      await page.goto('/')
    })

    await test.step('Then they stay on "/" and see the landing page', async () => {
      await expect(page).toHaveURL(/\/$/)
      await expect(page.getByText('Portal de monitorização de')).toBeVisible()
    })
  })

  test('redirects an unknown path to /login', async ({ page }) => {
    await test.step('Given a visitor with no session token', async () => {
      await stubApi(page)
    })

    await test.step('When they open a path that does not exist', async () => {
      await page.goto('/qualquer-coisa-inexistente')
    })

    await test.step('Then they land on /login', async () => {
      await expect(page).toHaveURL(/\/admin\/login/)
    })
  })

  test('redirects a deep-linked protected page to /login', async ({ page }) => {
    await test.step('Given a visitor with no session token', async () => {
      await stubApi(page)
    })

    await test.step('When they deep-link into a protected page', async () => {
      await page.goto('/admin/relatorios')
    })

    await test.step('Then they land on /admin/login without seeing protected content', async () => {
      await expect(page).toHaveURL(/\/admin\/login/)
      await expect(page.locator('#email')).toBeVisible()
    })
  })

  test('redirects to /login once the session is cleared', async ({ page }) => {
    await test.step('Given an authenticated visitor on the admin area', async () => {
      await stubApi(page, {
        'auth/me': (route) =>
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ id: 1, email: 'user@municipio.pt', fullName: 'Test User', role: 'admin' }),
          }),
      })
      await page.addInitScript(() => {
        document.cookie = 'token=valid-token; path=/'
        localStorage.setItem('user', JSON.stringify({ id: 1, email: 'user@municipio.pt' }))
      })
      await page.goto('/admin')
      await expect(page).toHaveURL(/\/admin/)
    })

    await test.step('When the session is cleared (logout/expiry) and they revisit', async () => {
      await page.evaluate(() => {
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        localStorage.removeItem('user')
      })
      await page.goto('/admin')
    })

    await test.step('Then they are redirected back to /login', async () => {
      await expect(page).toHaveURL(/\/admin\/login/)
    })
  })
})
