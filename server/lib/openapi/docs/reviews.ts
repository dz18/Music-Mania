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
  description: 'Create or update a review for an artist, release, or song. Supports publishing immediately or saving as a draft. Upserts on repeat submissions.',
  method: 'put',
  path: '/reviews',
  tags: ['Reviews'],
  request: {
    body: {
      content: {
        'application/json': { schema: publishOrDraftSchema }
      }
    }
  },
  responses: {
    200: { description: 'Review published or saved as draft' },
    400: { description: 'Request Error' },
    401: { description: 'Unauthorized' },
    500: { description: 'Server error' }
  }
})

registry.registerPath({
  description: 'Delete a user\'s review for an artist, release, or song. Returns the updated average rating and star stats after deletion.',
  method: 'delete',
  path: '/reviews',
  tags: ['Reviews'],
  request: {
    query: deleteReviewSchema
  },
  responses: {
    200: { description: 'Review deleted' },
    400: { description: 'Request Error' },
    500: { description: 'Server error' }
  }
})

registry.registerPath({
  description: 'Fetch paginated published reviews for a specific artist. Returns reviews, average rating, and star distribution. Supports filtering by star rating.',
  method: 'get',
  path: '/reviews/artist',
  tags: ['Reviews'],
  request: {
    query: artistReviewsSchema
  },
  responses: {
    200: { description: 'Artist reviews returned' },
    400: { description: 'Request Error' },
    500: { description: 'Server error' }
  }
})

registry.registerPath({
  description: 'Fetch paginated published reviews for a specific release. Returns reviews, average rating, and star distribution. Supports filtering by star rating.',
  method: 'get',
  path: '/reviews/release',
  tags: ['Reviews'],
  request: {
    query: releaseReviewsSchema
  },
  responses: {
    200: { description: 'Release reviews returned' },
    400: { description: 'Request Error' },
    500: { description: 'Server error' }
  }
})

registry.registerPath({
  description: 'Fetch paginated published reviews for a specific song. Resolves to work ID when provided for accurate review aggregation. Supports filtering by star rating.',
  method: 'get',
  path: '/reviews/song',
  tags: ['Reviews'],
  request: {
    query: songReviewsSchema
  },
  responses: {
    200: { description: 'Song reviews returned' },
    400: { description: 'Request Error' },
    500: { description: 'Server error' }
  }
})

registry.registerPath({
  description: "Fetch a single user's review for a specific artist, release, or song. Returns null if the user has not reviewed the item.",
  method: 'get',
  path: '/reviews/user',
  tags: ['Reviews'],
  request: {
    query: userReviewSchema
  },
  responses: {
    200: { description: "User's review for an item returned" },
    400: { description: 'Request Error' },
    500: { description: 'Server error' }
  }
})

registry.registerPath({
  description: "Fetch a paginated list of a user's published artist reviews, including star distribution stats. Supports filtering by star rating.",
  method: 'get',
  path: '/reviews/user/artists',
  tags: ['Reviews'],
  request: {
    query: userArtistsSchema
  },
  responses: {
    200: { description: "User's artist reviews returned" },
    400: { description: 'Request Error' },
    500: { description: 'Server error' }
  }
})

registry.registerPath({
  description: "Fetch a paginated list of a user's published release reviews, including star distribution stats. Supports filtering by star rating.",
  method: 'get',
  path: '/reviews/user/releases',
  tags: ['Reviews'],
  request: {
    query: userReleasesSchema
  },
  responses: {
    200: { description: "User's release reviews returned" },
    400: { description: 'Request Error' },
    500: { description: 'Server error' }
  }
})

registry.registerPath({
  description: "Fetch a paginated list of a user's published song reviews, including star distribution stats. Supports filtering by star rating.",
  method: 'get',
  path: '/reviews/user/songs',
  tags: ['Reviews'],
  request: {
    query: userSongsSchema
  },
  responses: {
    200: { description: "User's song reviews returned" },
    400: { description: 'Request Error' },
    500: { description: 'Server error' }
  }
})