export const calcStarStats = (stats) => {
  const starCount = {
    0.5 : 0,
    1 : 0, 
    1.5 : 0,
    2 : 0, 
    2.5 : 0,
    3 : 0, 
    3.5 : 0,
    4 : 0, 
    4.5 : 0,
    5 : 0 
  }

  for (const group of [...stats]) {
    starCount[group.rating] += group._count.rating
  }

  const starStats = Object.entries(starCount)
    .map(([rating, count]) => ({ rating: +rating, count }))
    .sort((a, b) => b.rating - a.rating)

  return starStats
}