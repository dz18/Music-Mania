import { calcStarStats } from '../../../controllers/hooks/calcStarStats.js'

describe('calcStarStats', () => {
  it('returns 10 rating entries for empty input', () => {
    const result = calcStarStats([])
    expect(result).toHaveLength(10)
  })

  it('initialises all counts to 0 for empty input', () => {
    const result = calcStarStats([])
    result.forEach(({ count }) => expect(count).toBe(0))
  })

  it('sorts ratings from highest to lowest', () => {
    const result = calcStarStats([])
    const ratings = result.map((r) => r.rating)
    expect(ratings[0]).toBe(5)
    expect(ratings[ratings.length - 1]).toBe(0.5)
  })

  it('aggregates count for a single rating group', () => {
    const stats = [{ rating: 4, _count: { rating: 3 } }]
    const result = calcStarStats(stats)
    expect(result.find((r) => r.rating === 4).count).toBe(3)
  })

  it('leaves unmentioned ratings at 0', () => {
    const stats = [{ rating: 5, _count: { rating: 7 } }]
    const result = calcStarStats(stats)
    expect(result.find((r) => r.rating === 3).count).toBe(0)
  })

  it('aggregates counts for multiple rating groups', () => {
    const stats = [
      { rating: 5, _count: { rating: 10 } },
      { rating: 3, _count: { rating: 5 } },
      { rating: 1, _count: { rating: 2 } },
    ]
    const result = calcStarStats(stats)
    expect(result.find((r) => r.rating === 5).count).toBe(10)
    expect(result.find((r) => r.rating === 3).count).toBe(5)
    expect(result.find((r) => r.rating === 1).count).toBe(2)
  })

  it('handles half-star ratings', () => {
    const stats = [
      { rating: 0.5, _count: { rating: 1 } },
      { rating: 1.5, _count: { rating: 2 } },
      { rating: 2.5, _count: { rating: 3 } },
    ]
    const result = calcStarStats(stats)
    expect(result.find((r) => r.rating === 0.5).count).toBe(1)
    expect(result.find((r) => r.rating === 1.5).count).toBe(2)
    expect(result.find((r) => r.rating === 2.5).count).toBe(3)
  })

  it('returns rating values as numbers not strings', () => {
    const result = calcStarStats([])
    result.forEach(({ rating }) => expect(typeof rating).toBe('number'))
  })
})
