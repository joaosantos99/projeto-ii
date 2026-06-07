import { test, expect } from '@playwright/test'
import { stubApi } from './helpers/api'

const ADMIN_USER = { id: 'a1b2c3d4-0000-0000-0000-000000000001', email: 'admin@municipio.pt', fullName: 'Admin Teste', role: 'admin' }

const MAINTENANCE_TASK = {
  id: 'f1e2d3c4-0000-0000-0000-000000000001',
  spaceId: 'b0b0b0b0-0000-0000-0000-000000000001',
  greenSpaceId: 'b0b0b0b0-0000-0000-0000-000000000001',
  type: 'poda',
  description: 'Poda de arbustos na zona norte',
  status: 'scheduled',
  scheduledDate: new Date(Date.now() + 2 * 86_400_000).toISOString(),
  completedAt: null,
}

/**
 * Build a Playwright route handler that fulfils a request with a JSON response.
 * @param {number} status
 * @param {unknown} body
 */
const json = (status, body) => (route) =>
  route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })

/**
 * Sign in through the login form as ADMIN_USER and stub the maintenance API.
 *
 * The maintenance list endpoint is stubbed with a single scheduled task so
 * tests can assert UI state without a running backend.
 */
async function signInAndStubMaintenance(page, maintenanceTasks = [MAINTENANCE_TASK]) {
  await stubApi(page, {
    'users/login': json(200, { token: 'admin-fake-token', user: ADMIN_USER }),
    'users/me': json(200, ADMIN_USER),
  })

  // Stub the paginated maintenance list used by the maintenance management page.
  await page.route(/\/api\/maintenance(\?|$)/, json(200, {
    data: maintenanceTasks,
    meta: { page: 1, limit: 20, total: maintenanceTasks.length, totalPages: 1 },
    _links: { self: { href: '/api/maintenance?page=1&limit=20' } },
  }))

  // Stub the maintenance creation endpoint.
  await page.route(/\/api\/maintenance$/, async (route) => {
    if (route.request().method() === 'POST') {
      const body = JSON.parse(route.request().postData() || '{}')
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            ...MAINTENANCE_TASK,
            id: 'f1e2d3c4-0000-0000-0000-999999999999',
            type: body.type ?? MAINTENANCE_TASK.type,
            description: body.description ?? MAINTENANCE_TASK.description,
            scheduledDate: body.scheduled_date ?? MAINTENANCE_TASK.scheduledDate,
          },
          _links: { self: { href: '/api/maintenance/f1e2d3c4-0000-0000-0000-999999999999' } },
        }),
      })
    } else {
      route.fallback()
    }
  })

  await page.goto('/admin/login')
  await page.waitForLoadState('networkidle')
  await page.locator('#email').fill(ADMIN_USER.email)
  await page.locator('#password').fill('correcthorse')
  await page.getByRole('button', { name: 'Iniciar sessão' }).click()
  await page.waitForURL(/\/admin/)
}

test.describe('Manutenção — visualização de tarefas agendadas na lista', () => {
  test('mostra a tarefa agendada na lista depois de navegar para a página de manutenção', async ({ page }) => {
    await test.step('Dado que existe uma tarefa agendada devolvida pela API', async () => {
      await signInAndStubMaintenance(page, [MAINTENANCE_TASK])
    })

    await test.step('Quando o utilizador navega para a secção de manutenção', async () => {
      await page.getByRole('link', { name: /manuten/i }).click()
      await page.waitForURL(/\/admin\/manutencao|\/admin\/maintenance/)
    })

    await test.step('Então a tarefa agendada é visível na lista com o tipo e descrição corretos', async () => {
      await expect(page.getByText(MAINTENANCE_TASK.type, { exact: false })).toBeVisible()
      await expect(page.getByText(MAINTENANCE_TASK.description, { exact: false })).toBeVisible()
    })
  })

  test('exibe o estado "agendada" da tarefa na lista', async ({ page }) => {
    await test.step('Dado que a API devolve uma tarefa com status "scheduled"', async () => {
      await signInAndStubMaintenance(page, [MAINTENANCE_TASK])
    })

    await test.step('Quando o utilizador acede à lista de manutenção', async () => {
      await page.getByRole('link', { name: /manuten/i }).click()
      await page.waitForURL(/\/admin\/manutencao|\/admin\/maintenance/)
    })

    await test.step('Então o estado da tarefa é apresentado na linha correspondente', async () => {
      await expect(
        page.getByText(/scheduled|agendad/i).first()
      ).toBeVisible()
    })
  })

  test('mostra estado vazio quando não existem tarefas agendadas', async ({ page }) => {
    await test.step('Dado que a API devolve uma lista vazia de tarefas', async () => {
      await signInAndStubMaintenance(page, [])
    })

    await test.step('Quando o utilizador acede à lista de manutenção', async () => {
      await page.getByRole('link', { name: /manuten/i }).click()
      await page.waitForURL(/\/admin\/manutencao|\/admin\/maintenance/)
    })

    await test.step('Então é apresentada uma mensagem de estado vazio', async () => {
      await expect(
        page.getByText(/nenhuma tarefa|sem tarefas|no tasks/i).first()
      ).toBeVisible()
    })
  })

  test('lista múltiplas tarefas agendadas devolvidas pela API', async ({ page }) => {
    const tasks = [
      { ...MAINTENANCE_TASK, id: 'task-0001', type: 'rega', description: 'Rega automática' },
      { ...MAINTENANCE_TASK, id: 'task-0002', type: 'limpeza', description: 'Limpeza da área' },
      { ...MAINTENANCE_TASK, id: 'task-0003', type: 'poda', description: 'Poda trimestral' },
    ]

    await test.step('Dado que a API devolve três tarefas agendadas', async () => {
      await signInAndStubMaintenance(page, tasks)
    })

    await test.step('Quando o utilizador acede à lista de manutenção', async () => {
      await page.getByRole('link', { name: /manuten/i }).click()
      await page.waitForURL(/\/admin\/manutencao|\/admin\/maintenance/)
    })

    await test.step('Então as três tarefas são visíveis na lista', async () => {
      await expect(page.getByText('Rega automática', { exact: false })).toBeVisible()
      await expect(page.getByText('Limpeza da área', { exact: false })).toBeVisible()
      await expect(page.getByText('Poda trimestral', { exact: false })).toBeVisible()
    })
  })
})