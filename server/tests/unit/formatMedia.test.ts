import { formatArtistCredit } from "../../controllers/hooks/formatArtistCredit"

it('maps artist credit fields correctly', () => {
  const result = formatArtistCredit({ name: 'Kendrick', joinphrase: '&', artist: { id: '123', disambiguation: 'rapper' } })
  expect(result.name).toBe('Kendrick')
  expect(result.joinphrase).toBe('&')
  expect(result.artist.id).toBe('123')
  expect(result.artist.disambiguation).toBe('rapper')
})