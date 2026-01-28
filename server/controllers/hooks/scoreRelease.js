export function scoreRelease(r) {
  let score = 0
  if (r.status === "Official") score += 50

  if (
    r.date === r["release-group"]?.["first-release-date"]
  ) score += 40

  if (!r.disambiguation) score += 20

  if (r.disambiguation?.includes("explicit")) score += 10
  if (r.disambiguation?.includes("clean")) score -= 10

  if (r.disambiguation?.includes("music video")) score -= 50
  if (r.disambiguation?.includes("Dolby")) score -= 15
  if (r.disambiguation?.includes("hi-res")) score -= 5
  

  if (r.packaging === "None") score += 5

  return score
}