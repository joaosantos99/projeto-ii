import { test, expect } from '@playwright/test'
import { stubApi } from './helpers/api'

test.describe('error pages', () => {
  test('renders the 403 page at /403 without a session', async ({ page }) => {
    await test.step('Given a visitor with no session token', async () => {
      await stubApi(page)
    })

    await test.step('When they open /403', async () => {
      await page.goto('/403')
    })

    await test.step('Then they stay on /403 and see the access-denied page', async () => {
      await expect(page).toHaveURL(/\/403$/)
      await expect(page).not.toHaveURL(/\/admin\/login/)
      await expect(page.getByText('403')).toBeVisible()
      await expect(page.getByText('Acesso negado')).toBeVisible()
    })
  })

  test('renders the 404 page for an unknown path', async ({ page }) => {
    await test.step('Given a visitor with no session token', async () => {
      await stubApi(page)
    })

    await test.step('When they open a path that does not exist', async () => {
      await page.goto('/rota-que-nao-existe')
    })

    await test.step('Then they stay on that path and see the not-found page', async () => {
      await expect(page).toHaveURL(/\/rota-que-nao-existe$/)
      await expect(page.getByText('404')).toBeVisible()
      await expect(page.getByText('Página não encontrada')).toBeVisible()
    })
  })
})
