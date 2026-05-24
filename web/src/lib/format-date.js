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

export function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}
