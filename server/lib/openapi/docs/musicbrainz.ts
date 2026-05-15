import { registry } from '../registry'
import { 
  artistsSchema, 
  discographySchema, 
  discographySinglesSchema, 
  findSingleIdSchema, 
  getArtistsSchema, 
  getReleaseSchema, 
  getSongSchema, 
  releasesSchema 
} from '../../../schemas/musicbrainz.schema'

registry.registerPath({
  description: 'Search for artists by name using the MusicBrainz API. Supports filtering by type and pagination.',
  method: 'get',
  path: '/musicbrainz/artists',
  tags: ['MusicBrainz'],
  request: {
    query: artistsSchema
  },
  responses: {
    200: { description: 'Artist suggestions returned' },
    400: { description: 'Request Error' },
    500: { description: 'MusicBrainz server error' }
  }
})

registry.registerPath({
  description: 'Search for albums and EPs by title using the MusicBrainz API. Supports filtering by release type and pagination.',
  method: 'get',
  path: '/musicbrainz/releases',
  tags: ['MusicBrainz'],
  request: {
    query: releasesSchema
  },
  responses: {
    200: { description: 'Release suggestions returned' },
    400: { description: 'Request Error' },
    500: { description: 'MusicBrainz server error' }
  }
})

registry.registerPath({
  description: 'Fetch detailed information for a specific artist by their MusicBrainz ID, including genres, aliases, members, and external URLs.',
  method: 'get',
  path: '/musicbrainz/getArtist',
  tags: ['MusicBrainz'],
  request: {
    query: getArtistsSchema
  },
  responses: {
    200: { description: 'Artist data returned' },
    400: { description: 'Request Error' },
    500: { description: 'MusicBrainz server error' }
  }
})

registry.registerPath({
  description: 'Fetch full release details for a release group by ID, including tracklist, cover art, and per-track review stats.',
  method: 'get',
  path: '/musicbrainz/getRelease',
  tags: ['MusicBrainz'],
  request: {
    query: getReleaseSchema
  },
  responses: {
    200: { description: 'Release data returned' },
    400: { description: 'Request Error' },
    502: { description: 'Upstream MusicBrainz connection reset' },
    500: { description: 'MusicBrainz server error' }
  }
})

registry.registerPath({
  description: 'Fetch details for a specific song by its MusicBrainz recording ID, including artist credits, genres, and cover art.',
  method: 'get',
  path: '/musicbrainz/getSong',
  tags: ['MusicBrainz'],
  request: {
    query: getSongSchema
  },
  responses: {
    200: { description: 'Song data returned' },
    400: { description: 'Request Error' },
    502: { description: 'Upstream MusicBrainz connection reset' },
    500: { description: 'MusicBrainz server error' }
  }
})

registry.registerPath({
  description: "Fetch a paginated discography for an artist by type (album, single, or ep), including each release group's average rating and review count.",
  method: 'get',
  path: '/musicbrainz/discography',
  tags: ['MusicBrainz'],
  request: {
    query: discographySchema
  },
  responses: {
    200: { description: 'Discography data returned' },
    400: { description: 'Invalid type or page number' },
    502: { description: 'Upstream MusicBrainz connection reset' },
    500: { description: 'MusicBrainz server error' }
  }
})

registry.registerPath({
  description: "Fetch a paginated list of an artist's singles, resolving each to its canonical work ID for review lookups.",
  method: 'get',
  path: '/musicbrainz/discographySingles',
  tags: ['MusicBrainz'],
  request: {
    query: discographySinglesSchema
  },
  responses: {
    200: { description: 'Singles discography data returned' },
    400: { description: 'Request Error' },
    502: { description: 'Upstream MusicBrainz connection reset' },
    500: { description: 'MusicBrainz server error' }
  }
})

registry.registerPath({
  description: 'Resolve a single release group ID to its canonical MusicBrainz recording ID, used to link singles to song reviews.',
  method: 'get',
  path: '/musicbrainz/findSingleId',
  tags: ['MusicBrainz'],
  request: {
    query: findSingleIdSchema
  },
  responses: {
    200: { description: 'Recording ID returned' },
    400: { description: 'Request Error' },
    404: { description: 'No recordings found' },
    500: { description: 'MusicBrainz server error' }
  }
})