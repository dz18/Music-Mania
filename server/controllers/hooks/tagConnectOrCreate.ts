export const tagConnectOrCreate = (tags) => {
  if (!tags || tags.length === 0) return undefined

  return tags.map(tagName => ({
    tag: {
      connectOrCreate: {
        where: { slug: tagName.toLowerCase().replace(/\s+/g, '-') },
        create: {
          name: tagName,
          slug: tagName.toLowerCase().replace(/\s+/g, '-')
        }
      }
    }
  }))
}
