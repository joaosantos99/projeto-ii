const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

export function formatDisplayDate(value) {
  if (value == null || value === "") return "—"
  if (value === "Nunca") return "Nunca"

  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (match) {
    const [, year, month, day] = match
    const monthIndex = parseInt(month, 10) - 1
    const dayNum = parseInt(day, 10)
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${MONTHS[monthIndex]} ${dayNum}, ${year}`
    }
  }

  const fallback = new Date(value)
  if (!Number.isNaN(fallback.getTime())) {
    return `${MONTHS[fallback.getMonth()]} ${fallback.getDate()}, ${fallback.getFullYear()}`
  }
  return value
}

export function formatDateTime(value) {
  if (!value) return "—"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString("pt-PT", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function relativeAge(value) {
  if (!value) return "—"
  const then = new Date(value).getTime()
  if (Number.isNaN(then)) return "—"
  const mins = Math.max(0, Math.floor((Date.now() - then) / 60000))
  if (mins < 60) return `Ha ${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `Ha ${h}h ${String(m).padStart(2, "0")}m`
}

export function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}
