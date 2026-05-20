const SECURE = window.location.protocol === "https:"

export function setCookie(name, value, maxAgeSeconds) {
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
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name}=([^;]*)`),
  )
  return match ? decodeURIComponent(match[1]) : null
}

export function deleteCookie(name) {
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`
}
