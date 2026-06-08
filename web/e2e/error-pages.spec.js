import { test, expect } from '@playwright/test'
import { stubApi } from './helpers/api'

test.describe('[PROJETOII-242] TC030-RNF03 - Redirecionamento sem sessão', () => {
  test('Mostra página 403 em /403 sem sessão', async ({ page }) => {
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

  test('Mostra página 404 para caminho desconhecido', async ({ page }) => {
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
