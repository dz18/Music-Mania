import { tagConnectOrCreate } from '../../../controllers/hooks/tagConnectOrCreate.js'

describe('tagConnectOrCreate', () => {
  it('returns undefined for null input', () => {
    expect(tagConnectOrCreate(null)).toBeUndefined()
  })

  it('returns undefined for empty array', () => {
    expect(tagConnectOrCreate([])).toBeUndefined()
  })

  it('transforms a single tag into connectOrCreate format', () => {
    const result = tagConnectOrCreate(['Rock'])
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      tag: {
        connectOrCreate: {
          where: { slug: 'rock' },
          create: { name: 'Rock', slug: 'rock' },
        },
      },
    })
  })

  it('lowercases the slug', () => {
    const result = tagConnectOrCreate(['HeavyMetal'])
    expect(result[0].tag.connectOrCreate.where.slug).toBe('heavymetal')
  })

  it('replaces spaces with hyphens in the slug', () => {
    const result = tagConnectOrCreate(['Hip Hop'])
    expect(result[0].tag.connectOrCreate.where.slug).toBe('hip-hop')
    expect(result[0].tag.connectOrCreate.create.slug).toBe('hip-hop')
  })

  it('collapses multiple spaces into a single hyphen', () => {
    const result = tagConnectOrCreate(['indie  pop'])
    expect(result[0].tag.connectOrCreate.where.slug).toBe('indie-pop')
  })

  it('preserves the original casing in create.name', () => {
    const result = tagConnectOrCreate(['Heavy Metal'])
    expect(result[0].tag.connectOrCreate.create.name).toBe('Heavy Metal')
  })

  it('handles multiple tags', () => {
    const result = tagConnectOrCreate(['Rock', 'Jazz', 'Blues'])
    expect(result).toHaveLength(3)
    expect(result[0].tag.connectOrCreate.where.slug).toBe('rock')
    expect(result[1].tag.connectOrCreate.where.slug).toBe('jazz')
    expect(result[2].tag.connectOrCreate.where.slug).toBe('blues')
  })
})
