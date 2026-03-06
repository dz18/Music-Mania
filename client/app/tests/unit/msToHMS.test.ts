import { msToHMS } from '../../hooks/timeMs'

describe('msToHMS', () => {
  it('returns all zeros for 0 ms', () => {
    expect(msToHMS(0)).toEqual({ hours: 0, minutes: 0, seconds: 0 })
  })

  it('converts pure seconds correctly', () => {
    expect(msToHMS(30_000)).toEqual({ hours: 0, minutes: 0, seconds: 30 })
  })

  it('converts pure minutes correctly', () => {
    expect(msToHMS(3 * 60 * 1000)).toEqual({ hours: 0, minutes: 3, seconds: 0 })
  })

  it('converts pure hours correctly', () => {
    expect(msToHMS(2 * 3600 * 1000)).toEqual({ hours: 2, minutes: 0, seconds: 0 })
  })

  it('converts a mixed duration (1h 30m 45s)', () => {
    const ms = (1 * 3600 + 30 * 60 + 45) * 1000
    expect(msToHMS(ms)).toEqual({ hours: 1, minutes: 30, seconds: 45 })
  })

  it('floors sub-second milliseconds', () => {
    expect(msToHMS(1_500)).toEqual({ hours: 0, minutes: 0, seconds: 1 })
  })

  it('converts a typical song duration (3:45)', () => {
    expect(msToHMS(225_000)).toEqual({ hours: 0, minutes: 3, seconds: 45 })
  })

  it('converts a long album duration (1h 12m 08s)', () => {
    const ms = (1 * 3600 + 12 * 60 + 8) * 1000
    expect(msToHMS(ms)).toEqual({ hours: 1, minutes: 12, seconds: 8 })
  })
})
