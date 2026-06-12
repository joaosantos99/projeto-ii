import { test, expect } from '@playwright/test'
import { stubApi } from './helpers/api'

const SPACE_ID = '00000000-0000-0000-0000-000000000001'

const SPACE = {
    id: SPACE_ID,
    name: 'Jardim da Estrela',
    parish: 'Lisboa',
    imageUrl: null,
    zones: [{ id: '00000000-0000-0000-0000-000000000002', name: 'Zona Norte' }],
    reports: [],
    sensorsSummary: {},
}

async function gotoSpace(page) {
    await page.goto(`/espacos-verdes/${SPACE_ID}`)
    await page.waitForLoadState('networkidle')
}

test.describe('space public page, incident and feedback forms', () => {
    test('submits an incident report successfully', async ({ page }) => {
        await test.step('Given a visitor on the space public page', async () => {
            await page.route('**/api/spaces/**', (route) => {
                return route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(SPACE),
                })
            })
            await stubApi(page, {
                'reports': (route) => route.fulfill({
                    status: 201,
                    contentType: 'application/json',
                    body: JSON.stringify({ data: { id: '1', type: 'incident', description: 'Árvore caída' } }),
                }),
            })
            await gotoSpace(page)
        })

        await test.step('When the visitor fills and submits the incident form', async () => {
            await page.getByRole('button', { name: 'Incidentes' }).click()
            await page.getByPlaceholder('Impacto, contexto e outros detalhes relevantes.').first().fill('Árvore caída')
            await page.getByRole('button', { name: 'Submeter incidente' }).click()
        })

        await test.step('Then the form is cleared after submission', async () => {
            await expect(page.getByPlaceholder('Impacto, contexto e outros detalhes relevantes.').first()).toHaveValue('')
        })
    })

    test('submits feedback successfully', async ({ page }) => {
        await test.step('Given a visitor on the space public page', async () => {
            await page.route('**/api/spaces/**', (route) => {
                return route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(SPACE),
                })
            })
            await stubApi(page, {
                'reports': (route) => route.fulfill({
                    status: 201,
                    contentType: 'application/json',
                    body: JSON.stringify({ data: { id: '1', type: 'comment', description: 'Árvore caída' } }),
                }),
            })
            await gotoSpace(page)
        })

        await test.step('When the visitor fills and submits the comment form', async () => {
            await page.getByRole('button', { name: 'Feedback' }).click()
            await page.getByPlaceholder('Impacto, contexto e outros detalhes relevantes.').first().fill('Árvore caída')
            await page.getByRole('button', { name: 'Submeter feedback' }).click()
        })

        await test.step('Then the form is cleared after submission', async () => {
            await expect(page.getByPlaceholder('Impacto, contexto e outros detalhes relevantes.').first()).toHaveValue('')
        })
    })
})