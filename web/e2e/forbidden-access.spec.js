import { test, expect } from '@playwright/test'
import { stubApi } from './helpers/api'

// An authenticated user whose role lacks the `users:read` / `roles:read`
// permissions. The session is valid, so they are NOT bounced to login — but the
// backend answers the protected data endpoints with 403, exactly as
// requirePermission does on the server.
const LIMITED_USER = { id: 7, email: 'operador@municipio.pt', fullName: 'Op Limitado', role: 'operador' }
const FORBIDDEN_BODY = { description: 'Sem permissões para aceder a este recurso' }

/**
 * Build a Playwright route handler that fulfils a request with a JSON response.
 * @param {number} status - HTTP status code to return (e.g. 200, 403).
 * @param {unknown} body - Value serialised as the JSON response body.
 * @returns {(route: import('@playwright/test').Route) => Promise<void>} Route handler for `page.route`.
 */
const json = (status, body) => (route) =>
  route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })

/**
 * Sign in through the real login form as {@link LIMITED_USER}, then forbid the
 * management data endpoints with 403.
 *
 * Logging in client-side (instead of `goto('/admin/...')`) is required: the SSR
 * `resolveAuth` can't see the browser-stubbed session, so a full-page request to
 * a protected route would redirect to `/admin/login`. The form login sets the
 * client auth state and navigates via the router with no SSR round-trip.
 *
 * The `/users` and `/roles` routes are registered after {@link stubApi} so they
 * are matched before its catch-all; the regexes match with or without a query
 * string (the users list is paginated).
 * @param {import('@playwright/test').Page} page - The Playwright page.
 * @returns {Promise<void>} Resolves once the dashboard (`/admin`) has loaded.
 */
async function signInWithoutPermissions(page) {
  await stubApi(page, {
    'auth/login': json(200, { token: 'valid-but-unprivileged', user: LIMITED_USER }),
    'auth/me': json(200, LIMITED_USER),
  })

  const forbid = json(403, FORBIDDEN_BODY)
  await page.route(/\/api\/users(\?|\/|$)/, forbid)
  await page.route(/\/api\/roles(\?|\/|$)/, forbid)

  await page.goto('/admin/login')
  await page.waitForLoadState('networkidle')
  await page.locator('#email').fill(LIMITED_USER.email)
  await page.locator('#password').fill('correcthorse')
  await page.getByRole('button', { name: 'Iniciar sessão' }).click()

  await page.waitForURL(/\/admin$/)
}

test.describe('access by a user without permission', () => {
  test('reaches the users page without being redirected to login', async ({ page }) => {
    await signInWithoutPermissions(page)

    await test.step('When they open the users management page from the sidebar', async () => {
      await page.getByRole('link', { name: 'Utilizadores' }).click()
    })

    await test.step('Then they stay on /admin/utilizadores (not bounced to login)', async () => {
      await expect(page).toHaveURL(/\/admin\/utilizadores/)
      await expect(page).not.toHaveURL(/\/admin\/login/)
      await expect(page.getByText('Lista de utilizadores')).toBeVisible()
    })
  })

  test('does not leak any forbidden user data', async ({ page }) => {
    await signInWithoutPermissions(page)

    await test.step('When the users management page loads its forbidden data', async () => {
      await page.getByRole('link', { name: 'Utilizadores' }).click()
      await page.waitForURL(/\/admin\/utilizadores/)
    })

    await test.step('Then no user rows are shown — only the empty state', async () => {
      await expect(page.getByText('Nenhum utilizador encontrado')).toBeVisible()
      await expect(page.locator('table')).toHaveCount(0)
    })
  })

  test('forbids the roles management data the same way', async ({ page }) => {
    await signInWithoutPermissions(page)

    await test.step('When they open the roles management page from the sidebar', async () => {
      await page.getByRole('link', { name: 'Roles' }).click()
    })

    await test.step('Then the page renders without exposing any role data', async () => {
      await expect(page).toHaveURL(/\/admin\/roles/)
      await expect(page).not.toHaveURL(/\/admin\/login/)
      await expect(page.locator('table tbody tr')).toHaveCount(0)
    })
  })
})
