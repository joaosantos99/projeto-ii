const isBrowser = typeof window !== "undefined"
const SECURE = isBrowser && window.location.protocol === "https:"

export function setCookie(name, value, maxAgeSeconds) {
  if (!isBrowser) return
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    "path=/",
    "samesite=lax",
  ]
  if (maxAgeSeconds) parts.push(`max-age=${maxAgeSeconds}`)
  if (SECURE) parts.push("secure")
  document.cookie = parts.join("; ")
}

export function getCookie(name) {
  if (!isBrowser) return null
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name}=([^;]*)`),
  )
  return match ? decodeURIComponent(match[1]) : null
}

export function deleteCookie(name) {
  if (!isBrowser) return
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`
}
