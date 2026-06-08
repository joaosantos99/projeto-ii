import { test, expect } from '@playwright/test'
import { stubApi } from './helpers/api'


// Protected endpoints behind <RequireAuth>.
const PROTECTED_ROUTES = ['/admin/utilizadores', '/admin/roles', '/admin/conta']

test.describe('[PROJETOII-225] TC013-RNF03 - JWT em falta', () => {
  test('Redireciona visitante anónimo de /admin para /admin/login', async ({ page }) => {
    await test.step('Given a visitor with no session token', async () => {
      await stubApi(page)
    })

    await test.step('When they open the protected /admin endpoint', async () => {
      await page.goto('/admin')
    })

    await test.step('Then they are redirected to /login and see the login form', async () => {
      await expect(page).toHaveURL(/\/admin\/login/)
      await expect(page.getByText('Bem-vindo de volta')).toBeVisible()
    })
  })

  for (const route of PROTECTED_ROUTES) {
    test(`Redireciona visitante anónimo de ${route} para /admin/login`, async ({ page }) => {
      await test.step('Given a visitor with no session token', async () => {
        await stubApi(page)
      })

      await test.step(`When they open the protected ${route} endpoint`, async () => {
        await page.goto(route)
      })

      await test.step('Then they are redirected to /login', async () => {
        await expect(page).toHaveURL(/\/admin\/login/)
      })
    })
  }

  test('Não renderiza conteúdo protegido para visitante anónimo', async ({ page }) => {
    await test.step('Given a visitor with no session token', async () => {
      await stubApi(page)
    })

    await test.step('When they try to open the users management endpoint', async () => {
      await page.goto('/admin/utilizadores')
      await page.waitForURL(/\/admin\/login/)
    })

    await test.step('Then the protected page is not exposed and the login form is shown', async () => {
      await expect(page).toHaveURL(/\/admin\/login/)
      await expect(page.locator('#email')).toBeVisible()
      await expect(page.locator('#password')).toBeVisible()
    })
  })

  test('Redireciona para /admin/login quando servidor rejeita token com 401', async ({ page }) => {
    await test.step('Given a stale token cookie that the server rejects', async () => {
      await stubApi(page, {
        'users/me': (route) =>
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
      await expect(page).toHaveURL(/\/admin\/login/)
      await expect(page.getByText('Bem-vindo de volta')).toBeVisible()
    })
  })
})
