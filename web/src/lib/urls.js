export function adminUrl(path = "/admin") {
  const base = import.meta.env.VITE_ADMIN_URL ?? ""
  return `${base}${path}`
}

export function publicUrl(path = "/") {
  const base = import.meta.env.VITE_PUBLIC_URL ?? ""
  return `${base}${path}`
}
