// utils/musicbrainz/classifyUrl.ts
const socialNetworks: Record<string, string> = {
  instagram: 'instagram',
  twitter: 'twitter',
  myspace: 'myspace',
  google: 'google',
  tiktok: 'tiktok',
  snapchat: 'snapchat',
  facebook: 'facebook',
  threads: 'threads',
  weibo: 'weibo',
  vk: 'vk',
}

const streamingServices: Record<string, string> = {
  spotify: 'spotify',
  apple: 'apple',
  amazon: 'amazon',
  tidal: 'tidal',
  napster: 'napster',
}

const videoChannels: Record<string, string> = {
  dailymotion: 'dailymotion',
  vimeo: 'vimeo',
}

const lyricsSites: Record<string, string> = {
  genius: 'genius',
}

const classifyByDomain = (url: string, map: Record<string, string>, fallback: string) => {
  const match = Object.keys(map).find(key => url.includes(key))
  return match ? map[match] : fallback
}

export const classifyUrl = (relation: any): { type: string; url: string } | null => {
  if (!relation.url) return null
  const resource = relation.url.resource

  switch (relation.type) {
    case 'social network':
      return { type: classifyByDomain(resource, socialNetworks, 'social network'), url: resource }
    case 'streaming':
      return { type: classifyByDomain(resource, streamingServices, 'streaming'), url: resource }
    case 'video channel':
      return { type: classifyByDomain(resource, videoChannels, 'video channel'), url: resource }
    case 'lyrics':
      return { type: classifyByDomain(resource, lyricsSites, 'lyrics'), url: resource }
    default:
      return { type: relation.type, url: resource }
  }
}