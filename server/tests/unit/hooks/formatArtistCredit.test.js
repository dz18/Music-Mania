const { formatArtistCredit } = require('../../../controllers/hooks/formatArtistCredit.js')

const artistCredit = {
  name: 'The Beatles',
  joinphrase: ' & ',
  artist: {
    id: 'b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d',
    disambiguation: 'British rock band',
    extraField: 'should be ignored',
  },
}

describe('formatArtistCredit', () => {
  it('maps name correctly', () => {
    expect(formatArtistCredit(artistCredit).name).toBe('The Beatles')
  })

  it('maps joinphrase correctly', () => {
    expect(formatArtistCredit(artistCredit).joinphrase).toBe(' & ')
  })

  it('maps artist.id correctly', () => {
    expect(formatArtistCredit(artistCredit).artist.id).toBe(
      'b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d'
    )
  })

  it('maps artist.disambiguation correctly', () => {
    expect(formatArtistCredit(artistCredit).artist.disambiguation).toBe(
      'British rock band'
    )
  })

  it('excludes extra fields from the artist object', () => {
    expect(formatArtistCredit(artistCredit).artist).not.toHaveProperty('extraField')
  })

  it('handles an empty joinphrase', () => {
    const result = formatArtistCredit({ ...artistCredit, joinphrase: '' })
    expect(result.joinphrase).toBe('')
  })

  it('handles undefined disambiguation', () => {
    const credit = {
      ...artistCredit,
      artist: { ...artistCredit.artist, disambiguation: undefined },
    }
    expect(formatArtistCredit(credit).artist.disambiguation).toBeUndefined()
  })
})
