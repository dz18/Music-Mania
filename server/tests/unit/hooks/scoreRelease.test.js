import { scoreRelease } from '../../../controllers/hooks/scoreRelease.js'

// Base release with no scoring conditions met
const base = {
  status: null,
  date: '2000-01-01',
  disambiguation: 'standard edition',
  packaging: 'Jewel Case',
  'release-group': { 'first-release-date': '1999-01-01' },
}

describe('scoreRelease', () => {
  it('returns 0 when no scoring conditions are met', () => {
    expect(scoreRelease(base)).toBe(0)
  })

  it('adds 50 for Official status', () => {
    expect(scoreRelease({ ...base, status: 'Official' })).toBe(50)
  })

  it('adds 40 when release date matches the first release date', () => {
    const r = { ...base, date: '1999-01-01' }
    expect(scoreRelease(r)).toBe(40)
  })

  it('adds 20 when disambiguation is falsy', () => {
    expect(scoreRelease({ ...base, disambiguation: null })).toBe(20)
    expect(scoreRelease({ ...base, disambiguation: undefined })).toBe(20)
  })

  it('adds 10 for explicit disambiguation', () => {
    expect(scoreRelease({ ...base, disambiguation: 'explicit' })).toBe(10)
  })

  it('subtracts 10 for clean disambiguation', () => {
    expect(scoreRelease({ ...base, disambiguation: 'clean version' })).toBe(-10)
  })

  it('subtracts 50 for music video disambiguation', () => {
    expect(scoreRelease({ ...base, disambiguation: 'music video' })).toBe(-50)
  })

  it('subtracts 15 for Dolby disambiguation', () => {
    expect(scoreRelease({ ...base, disambiguation: 'Dolby Atmos mix' })).toBe(-15)
  })

  it('subtracts 5 for hi-res disambiguation', () => {
    expect(scoreRelease({ ...base, disambiguation: 'hi-res audio' })).toBe(-5)
  })

  it('adds 5 for None packaging', () => {
    expect(scoreRelease({ ...base, packaging: 'None' })).toBe(5)
  })

  it('accumulates scores across multiple matching conditions', () => {
    const r = {
      status: 'Official',                                          // +50
      date: '2020-01-01',
      'release-group': { 'first-release-date': '2020-01-01' },    // +40
      disambiguation: undefined,                                    // +20
      packaging: 'None',                                            // +5
    }
    expect(scoreRelease(r)).toBe(115)
  })

  it('does not throw when release-group is undefined', () => {
    const r = { ...base, 'release-group': undefined }
    expect(() => scoreRelease(r)).not.toThrow()
  })
})
