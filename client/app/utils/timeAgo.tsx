export function timeAgo(dateString: string | Date) {
  const now = new Date()
  const past = new Date(dateString)
  const diff = now.getTime() - past.getTime() // difference in ms

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60) return `${seconds} sec${seconds !== 1 ? "s" : ""} ago`
  if (minutes < 60) return `${minutes} min${minutes !== 1 ? "s" : ""} ago`
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`
  if (weeks < 5) return `${weeks} week${weeks !== 1 ? "s" : ""} ago`
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`
  return `${years} year${years !== 1 ? "s" : ""} ago`
}
