export async function stubApi(page, overrides = {}) {
  const paths = Object.keys(overrides)

  for (const path of paths) {
    await page.route(`**/api/${path}`, overrides[path])
  }

  await page.route('**/api/**', (route) => {
    const url = route.request().url()
    if (paths.some((path) => url.includes(`/api/${path}`))) return route.fallback()
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
  })
}
