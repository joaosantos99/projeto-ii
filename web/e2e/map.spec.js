import { test, expect } from '@playwright/test'
import { stubApi } from './helpers/api'

const SPACES = [
    {
        id: '00000000-0000-0000-0000-000000000001',
        name: 'Jardim da Estrela',
        latitude: 38.7154,
        longitude: -9.1601,
    },
    {
        id: '00000000-0000-0000-0000-000000000002',
        name: 'Parque das Nações',
        latitude: 38.7635,
        longitude: -9.0937,
    },
]

async function gotoHome(page) {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
}

test.describe('space map widget', () => {
    test('renders the map with markers and interactive popups', async ({page}) => {
        await test.step('Given a list of spaces available on the platform', async () => {
            await stubApi(page, {
                '**/api/spaces**': (route) =>
                    route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(SPACES),
                }),
            })
            await page.route('**/tile.openstreetmap**', (route) => route.abort())
            await gotoHome(page)
        })

        await test.step('When the map is visible', async () => {
            await expect(page.locator('.leaflet-container')).toBeVisible()
        })
    })
})