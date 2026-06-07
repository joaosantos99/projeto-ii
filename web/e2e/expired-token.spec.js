import { test, expect } from '@playwright/test'
import { stubApi } from './helpers/api'

// A structurally valid JWT whose `exp` claim is in the past (Sept 2001).
// The backend rejects it on /users/me with 401 { description: 'Token inválido ou expirado' }.
const EXPIRED_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidXNlckBtdW5pY2lwaW8ucHQiLCJpYXQiOjEwMDAwMDAwMDAsImV4cCI6MTAwMDAwMzYwMH0.c2lnbmF0dXJlLXBsYWNlaG9sZGVy'

const STALE_USER = { id: 1, email: 'user@municipio.pt', fullName: 'Test User', role: 'admin' }

/** Stub /users/me to reject any token the way the real server rejects an expired session. */
async function stubExpiredSession(page) {
  await stubApi(page, {
    'users/me': (route) =>
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ description: 'Token inválido ou expirado' }),
      }),
  })
}

test.describe('access with an expired JWT', () => {
  test('redirects a deep-linked protected page to /admin/login', async ({ page }) => {
    await test.step('Given an expired JWT cookie that the server rejects', async () => {
      await stubExpiredSession(page)
      await page.addInitScript((token) => {
        document.cookie = `token=${token}; path=/`
      }, EXPIRED_JWT)
    })

    await test.step('When they open a protected /admin page', async () => {
      await page.goto('/admin/utilizadores')
    })

    await test.step('Then they land on /admin/login and see the login form', async () => {
      await expect(page).toHaveURL(/\/admin\/login/)
      await expect(page.getByText('Bem-vindo de volta')).toBeVisible()
    })
  })

  test('clears the expired session from cookie and storage', async ({ page }) => {
    await test.step('Given an expired JWT cookie alongside a stale cached user', async () => {
      await stubExpiredSession(page)
      await page.goto('/')
      await page.evaluate(
        ({ user, token }) => {
          document.cookie = `token=${token}; path=/`
          localStorage.setItem('user', JSON.stringify(user))
        },
        { user: STALE_USER, token: EXPIRED_JWT },
      )
    })

    await test.step('When they try to open the admin dashboard', async () => {
      await page.goto('/admin')
      await page.waitForURL(/\/admin\/login/)
    })

    await test.step('Then the token cookie and cached user are removed', async () => {
      await expect(page.locator('#email')).toBeVisible()
      await expect
        .poll(() => page.evaluate(() => document.cookie))
        .not.toContain('token=')
      await expect
        .poll(() => page.evaluate(() => localStorage.getItem('user')))
        .toBeNull()
    })
  })

  test('never renders protected content with an expired JWT', async ({ page }) => {
    await test.step('Given an expired JWT cookie', async () => {
      await stubExpiredSession(page)
      await page.addInitScript((token) => {
        document.cookie = `token=${token}; path=/`
      }, EXPIRED_JWT)
    })

    await test.step('When they deep-link into the roles management page', async () => {
      await page.goto('/admin/roles')
      await page.waitForURL(/\/admin\/login/)
    })

    await test.step('Then only the login form is shown', async () => {
      await expect(page).toHaveURL(/\/admin\/login/)
      await expect(page.locator('#email')).toBeVisible()
      await expect(page.locator('#password')).toBeVisible()
    })
  })
})
