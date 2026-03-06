import { timeAgo } from '../../hooks/timeAgo'

// Pin "now" to a fixed point so all diffs are deterministic
const NOW = new Date('2024-06-15T12:00:00.000Z')

beforeEach(() => {
  jest.useFakeTimers()
  jest.setSystemTime(NOW)
})

afterEach(() => {
  jest.useRealTimers()
})

describe('timeAgo', () => {
  describe('seconds', () => {
    it('returns "30 secs ago" for 30 seconds in the past', () => {
      expect(timeAgo(new Date('2024-06-15T11:59:30.000Z'))).toBe('30 secs ago')
    })

    it('uses singular "sec" for exactly 1 second', () => {
      expect(timeAgo(new Date('2024-06-15T11:59:59.000Z'))).toBe('1 sec ago')
    })
  })

  describe('minutes', () => {
    it('returns "15 mins ago" for 15 minutes in the past', () => {
      expect(timeAgo(new Date('2024-06-15T11:45:00.000Z'))).toBe('15 mins ago')
    })

    it('uses singular "min" for exactly 1 minute', () => {
      expect(timeAgo(new Date('2024-06-15T11:59:00.000Z'))).toBe('1 min ago')
    })
  })

  describe('hours', () => {
    it('returns "3 hours ago" for 3 hours in the past', () => {
      expect(timeAgo(new Date('2024-06-15T09:00:00.000Z'))).toBe('3 hours ago')
    })

    it('uses singular "hour" for exactly 1 hour', () => {
      expect(timeAgo(new Date('2024-06-15T11:00:00.000Z'))).toBe('1 hour ago')
    })
  })

  describe('days', () => {
    it('returns "3 days ago" for 3 days in the past', () => {
      expect(timeAgo(new Date('2024-06-12T12:00:00.000Z'))).toBe('3 days ago')
    })

    it('uses singular "day" for exactly 1 day', () => {
      expect(timeAgo(new Date('2024-06-14T12:00:00.000Z'))).toBe('1 day ago')
    })
  })

  describe('weeks', () => {
    it('returns "2 weeks ago" for 14 days in the past', () => {
      expect(timeAgo(new Date('2024-06-01T12:00:00.000Z'))).toBe('2 weeks ago')
    })

    it('uses singular "week" for exactly 7 days', () => {
      expect(timeAgo(new Date('2024-06-08T12:00:00.000Z'))).toBe('1 week ago')
    })
  })

  describe('months', () => {
    it('returns "2 months ago" for ~60 days in the past', () => {
      // June 15 - April 15 = 61 days → months = floor(61/30) = 2
      expect(timeAgo(new Date('2024-04-15T12:00:00.000Z'))).toBe('2 months ago')
    })
  })

  describe('years', () => {
    it('returns "1 year ago" for 366 days in the past', () => {
      // 2024 is a leap year: June 15 2023 → June 15 2024 = 366 days
      // months = floor(366/30) = 12, so falls through to years branch
      expect(timeAgo(new Date('2023-06-15T12:00:00.000Z'))).toBe('1 year ago')
    })

    it('uses plural "years" for multiple years', () => {
      expect(timeAgo(new Date('2020-06-15T12:00:00.000Z'))).toBe('4 years ago')
    })
  })

  it('accepts a date string as input', () => {
    expect(timeAgo('2024-06-15T11:59:00.000Z')).toBe('1 min ago')
  })
})
