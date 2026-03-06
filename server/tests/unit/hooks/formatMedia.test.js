const { formatMedia } = require('../../../controllers/hooks/formatMedia.js')

const makeArtistCredit = (name = 'Artist') => ({
  name,
  joinphrase: '',
  artist: { id: 'artist-id-1', disambiguation: '' },
})

const makeTrack = ({ recording: recordingOverrides, ...trackOverrides } = {}) => ({
  length: 240000,
  id: 'track-id-1',
  'artist-credit': [makeArtistCredit()],
  position: 1,
  title: 'Test Song',
  ...trackOverrides,
  recording: {
    id: 'recording-id-1',
    length: 240000,
    'artist-credit': [makeArtistCredit()],
    relations: null,
    ...recordingOverrides,
  },
})

const makeMedia = (overrides = {}) => ({
  position: 1,
  title: 'CD 1',
  'track-count': 1,
  tracks: [makeTrack()],
  ...overrides,
})

describe('formatMedia', () => {
  it('maps position correctly', () => {
    expect(formatMedia(makeMedia({ position: 2 })).position).toBe(2)
  })

  it('maps title correctly', () => {
    expect(formatMedia(makeMedia({ title: 'Side A' })).title).toBe('Side A')
  })

  it('maps trackCount from track-count', () => {
    expect(formatMedia(makeMedia({ 'track-count': 12 })).trackCount).toBe(12)
  })

  it('formats all tracks', () => {
    const tracks = [makeTrack({ id: 'track-1' }), makeTrack({ id: 'track-2' })]
    const result = formatMedia(makeMedia({ tracks, 'track-count': 2 }))
    expect(result.tracks).toHaveLength(2)
  })

  it('maps track fields correctly', () => {
    const track = makeTrack({ length: 180000, position: 3, title: 'My Song', id: 'abc' })
    const t = formatMedia(makeMedia({ tracks: [track] })).tracks[0]
    expect(t.length).toBe(180000)
    expect(t.position).toBe(3)
    expect(t.title).toBe('My Song')
    expect(t.id).toBe('abc')
  })

  it('returns undefined workId when relations is null', () => {
    const track = makeTrack({ recording: { id: 'rec-123', length: 0, 'artist-credit': [], relations: null } })
    const result = formatMedia(makeMedia({ tracks: [track] }))
    expect(result.tracks[0].recording.workId).toBeUndefined()
  })

  it('uses recording.id as workId when relations array has no work', () => {
    const track = makeTrack({
      recording: { id: 'rec-123', length: 0, 'artist-credit': [], relations: [{ type: 'performance' }] },
    })
    const result = formatMedia(makeMedia({ tracks: [track] }))
    expect(result.tracks[0].recording.workId).toBe('rec-123')
  })

  it('uses work.id from relations when available', () => {
    const track = makeTrack({
      recording: {
        id: 'rec-123',
        length: 0,
        'artist-credit': [],
        relations: [{ work: { id: 'work-456' } }],
      },
    })
    const result = formatMedia(makeMedia({ tracks: [track] }))
    expect(result.tracks[0].recording.workId).toBe('work-456')
  })

  it('maps artist credits on each track', () => {
    const credit = makeArtistCredit('Kendrick Lamar')
    const track = makeTrack({ 'artist-credit': [credit] })
    const result = formatMedia(makeMedia({ tracks: [track] }))
    expect(result.tracks[0].artistCredit[0].name).toBe('Kendrick Lamar')
  })
})
