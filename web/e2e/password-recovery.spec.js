import { test, expect } from '@playwright/test'
import { stubApi } from './helpers/api'

async function goto(page, path) {
  await stubApi(page)
  await page.goto(path)
  await page.waitForLoadState('networkidle')
}

test.describe('forgot password request', () => {
  test('submitting an email shows the check-your-inbox confirmation', async ({ page }) => {
    await test.step('Given the visitor is on the recover page', async () => {
      await goto(page, '/admin/recuperar-password')
      await expect(page.getByText('Recuperar palavra-passe')).toBeVisible()
    })

    await test.step('When they submit their email', async () => {
      await page.locator('#recuperar-email').fill('user@municipio.pt')
      await page.getByRole('button', { name: 'Enviar instruções' }).click()
    })

    await test.step('Then a confirmation card naming the email is shown', async () => {
      await expect(page.getByText('Verifique o seu email')).toBeVisible()
      await expect(page.getByText('user@municipio.pt')).toBeVisible()
    })
  })

  test('the back-to-login link returns to /admin/login', async ({ page }) => {
    await test.step('Given the visitor is on the recover page', async () => {
      await goto(page, '/admin/recuperar-password')
    })

    await test.step('When they click "Voltar ao início de sessão"', async () => {
      await page.getByRole('link', { name: 'Voltar ao início de sessão' }).click()
    })

    await test.step('Then they land on /admin/login', async () => {
      await expect(page).toHaveURL(/\/admin\/login/)
    })
  })
})

test.describe('reset password with a token', () => {
  const RESET_URL = '/admin/redefinir-password?token=valid-token'

  test('shows the invalid-link card when no token is present', async ({ page }) => {
    await test.step('Given the visitor opens the reset page without a token', async () => {
      await goto(page, '/admin/redefinir-password')
    })

    await test.step('Then the invalid-or-expired card is shown', async () => {
      await expect(page.getByText('Link inválido ou expirado')).toBeVisible()
      await expect(page.getByRole('link', { name: 'Pedir novo link' })).toBeVisible()
    })
  })

  test('shows the reset form when a token is present', async ({ page }) => {
    await test.step('Given the visitor opens the reset page with a token', async () => {
      await goto(page, RESET_URL)
    })

    await test.step('Then the new-password form is shown', async () => {
      await expect(page.getByText('Escolha uma palavra-passe forte.')).toBeVisible()
      await expect(page.locator('#reset-password')).toBeVisible()
    })
  })

  test('rejects a password shorter than 8 characters', async ({ page }) => {
    await test.step('Given the visitor is on the reset form', async () => {
      await goto(page, RESET_URL)
    })

    await test.step('When they submit a short password', async () => {
      await page.locator('#reset-password').fill('short')
      await page.locator('#reset-password-confirm').fill('short')
      await page.getByRole('button', { name: 'Guardar palavra-passe' }).click()
    })

    await test.step('Then the password field is marked invalid and no success card appears', async () => {
      await expect(page.locator('[data-invalid="true"]')).toBeVisible()
      await expect(page.getByText('Palavra-passe atualizada')).toHaveCount(0)
    })
  })

  test('rejects mismatched passwords', async ({ page }) => {
    await test.step('Given the visitor is on the reset form', async () => {
      await goto(page, RESET_URL)
    })

    await test.step('When the two passwords do not match', async () => {
      await page.locator('#reset-password').fill('correcthorse')
      await page.locator('#reset-password-confirm').fill('batterystaple')
      await page.getByRole('button', { name: 'Guardar palavra-passe' }).click()
    })

    await test.step('Then a mismatch message is shown and no success card appears', async () => {
      await expect(page.getByText('As palavras-passe não coincidem.')).toBeVisible()
      await expect(page.getByText('Palavra-passe atualizada')).toHaveCount(0)
    })
  })

  test('accepts a valid matching password and confirms the update', async ({ page }) => {
    await test.step('Given the visitor is on the reset form', async () => {
      await goto(page, RESET_URL)
    })

    await test.step('When they submit a valid matching password', async () => {
      await page.locator('#reset-password').fill('correcthorse')
      await page.locator('#reset-password-confirm').fill('correcthorse')
      await page.getByRole('button', { name: 'Guardar palavra-passe' }).click()
    })

    await test.step('Then the password-updated confirmation is shown', async () => {
      await expect(page.getByText('Palavra-passe atualizada')).toBeVisible()
      await expect(page.getByRole('link', { name: 'Iniciar sessão' })).toBeVisible()
    })
  })
})
