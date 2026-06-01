const API_TARGET = import.meta.env.VITE_API_URL || process.env.VITE_API_URL
const AUTH_ROUTES = ["/admin/login", "/admin/recuperar-password", "/admin/redefinir-password"]
const PUBLIC_ROUTES = ["/", "/space-public-page", "/403"]

function readToken(cookieHeader) {
  if (!cookieHeader) return null
  const match = cookieHeader.match(/(?:^|;\s*)token=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

export async function resolveAuth(request) {
  const cookieHeader = request?.headers?.get?.("cookie") ?? null
  const token = readToken(cookieHeader)
  if (!token) return { user: null }
  try {
    const res = await fetch(`${API_TARGET}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return { user: null }
    return { user: await res.json() }
  } catch {
    return { user: null }
  }
}

export function resolveRedirect(pathname, user) {
  const isAuthRoute = AUTH_ROUTES.includes(pathname)
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname)
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/")

  if (isPublicRoute) return null
  if (isAuthRoute) return user ? "/admin" : null
  if (isAdminRoute && !user) return "/admin/login"
  // Unknown paths render the client 404 page instead of redirecting.
  return null
}
