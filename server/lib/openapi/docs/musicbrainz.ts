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
  method: 'get',
  path: '/musicbrainz/artists',
  tags: ['MusicBrainz'],
  request: {
    query: artistsSchema
  },
  responses: {

  }
})

registry.registerPath({
  method: 'get',
  path: '/musicbrainz/releases',
  tags: ['MusicBrainz'],
  request: {
    query: releasesSchema
  },
  responses: {

  }
})

registry.registerPath({
  method: 'get',
  path: '/musicbrainz/getArtist',
  tags: ['MusicBrainz'],
  request: {
    query: getArtistsSchema
  },
  responses: {

  }
})

registry.registerPath({
  method: 'get',
  path: '/musicbrainz/getRelease',
  tags: ['MusicBrainz'],
  request: {
    query: getReleaseSchema
  },
  responses: {

  }
})

registry.registerPath({
  method: 'get',
  path: '/musicbrainz/getSong',
  tags: ['MusicBrainz'],
  request: {
    query: getSongSchema
  },
  responses: {

  }
})

registry.registerPath({
  method: 'get',
  path: '/musicbrainz/discography',
  tags: ['MusicBrainz'],
  request: {
    query: discographySchema
  },
  responses: {

  }
})

registry.registerPath({
  method: 'get',
  path: '/musicbrainz/discographySingles',
  tags: ['MusicBrainz'],
  request: {
    query: discographySinglesSchema
  },
  responses: {

  }
})

registry.registerPath({
  method: 'get',
  path: '/musicbrainz/findSingleId',
  tags: ['MusicBrainz'],
  request: {
    query: findSingleIdSchema
  },
  responses: {

  }
})