import { registry } from '../registry'
import { 
  artistReviewsSchema, 
  deleteReviewSchema, 
  publishOrDraftSchema, 
  releaseReviewsSchema, 
  songReviewsSchema, 
  userArtistsSchema, 
  userReleasesSchema, 
  userReviewSchema, 
  userSongsSchema
} from '../../../schemas/reviews.schema'

registry.registerPath({
  method: 'put',
  path: '/reviews',
  tags: ['Reviews'],
  request: {
    query: publishOrDraftSchema
  },
  responses: {

  }
})

registry.registerPath({
  method: 'delete',
  path: '/reviews',
  tags: ['Reviews'],
  request: {
    query: deleteReviewSchema
  },
  responses: {

  }
})

registry.registerPath({
  method: 'get',
  path: '/reviews/artist',
  tags: ['Reviews'],
  request: {
    query: artistReviewsSchema
  },
  responses: {

  }
})

registry.registerPath({
  method: 'get',
  path: '/reviews/release',
  tags: ['Reviews'],
  request: {
    query: releaseReviewsSchema
  },
  responses: {

  }
})

registry.registerPath({
  method: 'get',
  path: '/reviews/song',
  tags: ['Reviews'],
  request: {
    query: songReviewsSchema
  },
  responses: {

  }
})

registry.registerPath({
  method: 'get',
  path: '/reviews/user',
  tags: ['Reviews'],
  request: {
    query: userReviewSchema
  },
  responses: {

  }
})

registry.registerPath({
  method: 'get',
  path: '/reviews/user/artists',
  tags: ['Reviews'],
  request: {
    query: userArtistsSchema
  },
  responses: {

  }
})

registry.registerPath({
  method: 'get',
  path: '/reviews/user/releases',
  tags: ['Reviews'],
  request: {
    query: userReleasesSchema
  },
  responses: {

  }
})

registry.registerPath({
  method: 'get',
  path: '/reviews/user/songs',
  tags: ['Reviews'],
  request: {
    query: userSongsSchema
  },
  responses: {

  }
})