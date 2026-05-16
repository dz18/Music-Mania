import registry from '../registry'
import { 
  allFollowersSchema,
  checkLikeSchema,
  deleteLikeSchema,
  editSchema,
  followSchema,
  isFollowingSchema,
  likeSchema,
  likesSchema, 
  profileSchema, 
  querySchema, 
  reviewPanelSchema,
  unfollowSchema
} from "../../../schemas/user.schema";

registry.registerPath({
  description: 'Return the total number of users on the platform.',
  method: 'get',
  path: '/users/total',
  tags: ['Users'],
  responses: {
    200: { description: 'Total user count returned' },
    400: { description: 'Request Error' },
    500: { description: 'Server error' }
  }
})

registry.registerPath({
  description: 'Searches up a number of users in a query.',
  method: 'get',
  path: '/users/query',
  tags: ['Users'],
  request: {
    query: querySchema
  },
  responses: {
    200: { description: 'User suggestions returned' },
    400: { description: 'Request Error' },
    500: { description: 'Server error' }
  }
})

registry.registerPath({
  description: 'Return all of the users liked items.',
  method: 'get',
  path: '/users/likes',
  tags: ['Users'],
  request: {
    query: likesSchema
  },
  responses: {
    200: { description: "User's liked items returned" },
    400: { description: "Request Error" },
    500: { description: 'Server error' }
  }
})

registry.registerPath({
  description: 'Returns profile page details for a specific userId.',
  method: 'get',
  path: '/users/profile',
  tags: ['Users'],
  request: {
    query: profileSchema
  },
  responses: {
    200: { description: 'User profile returned' },
    400: { description: 'Request Error' },
    404: { description: 'User not found' },
    500: { description: 'Server error' }
  }
})

registry.registerPath({
  description: "Returns a query of users that are either a follower or following a user.",
  method: 'get',
  path: '/users/allFollowers',
  tags: ['Users'],
  request: {
    query: allFollowersSchema
  },
  responses: {
    200: { description: 'Followers or following list returned' },
    400: { description: 'Request Error' },
    404: { description: 'Profile not found' },
    500: { description: 'Server error' }
  }
})

registry.registerPath({
  description: "Check if a user is following a user.",
  method: 'get',
  path: '/users/follow',
  tags: ['Users'],
  request: {
    query: isFollowingSchema
  },
  responses: {
    200: { description: 'Follow status returned' },
    400: { description: 'Request Error' },
    500: { description: 'Server error' }
  }
})

registry.registerPath({
  description: "Find a user by userId.",
  method: 'get',
  path: '/users/find',
  tags: ['Users'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: { description: 'Authenticated user returned' },
    400: { description: 'User does not exist' },
    401: { description: 'Unauthorized' },
    500: { description: 'Server error' }
  }
})

registry.registerPath({
  description: "Fetches the current user's profile data to pre-populate the edit form.",
  method: 'get',
  path: '/users/edit',
  tags: ['Users'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: { description: 'User edit info returned' },
    400: { description: 'Request Error' },
    401: { description: 'Unauthorized' },
    500: { description: 'Server error' }
  }
})

registry.registerPath({
  description: "fetches the current user's review for a specific item to pre-populate the review panel.",
  method: 'get',
  path: '/users/review',
  tags: ['Users'],
  request: {
    query: reviewPanelSchema
  },
  security: [{ bearerAuth: [] }],
  responses: {
    200: { description: "User's review for item returned" },
    400: { description: 'Request Error' },
    401: { description: 'Unauthorized' },
    500: { description: 'Server error' }
  }
})

registry.registerPath({
  description: "Checks if the current user has liked a specific item.",
  method: 'get',
  path: '/users/like',
  tags: ['Users'],
  request: {
    query: checkLikeSchema
  },
  security: [{ bearerAuth: [] }],
  responses: {
    200: { description: 'Like status returned' },
    400: { description: 'Missing required query parameter' },
    401: { description: 'Unauthorized' },
    500: { description: 'Server error' }
  }
})

registry.registerPath({
  description: "Updates the current user's profile information and avatar.",
  method: 'patch',
  path: '/users/edit',
  tags: ['Users'],
  request: {
    body: {
      content: {
        'application/json' : { schema: editSchema }
      }
    }
  },
  security: [{ bearerAuth: [] }],
  responses: {
    200: { description: 'Profile updated' },
    400: { description: 'Request Error' },
    401: { description: 'Unauthorized' },
    409: { description: 'Username taken or avatar upload failed' },
    500: { description: 'Server error' }
  }
})

registry.registerPath({
  description: "Follow a user.",
  method: 'post',
  path: '/users/follow',
  tags: ['Users'],
  request: {
    body: {
      content: {
        'application/json' : { schema: followSchema }
      }
    }
  },
  security: [{ bearerAuth: [] }],
  responses: {
    200: { description: 'User followed' },
    400: { description: 'Request Error' },
    401: { description: 'Unauthorized' },
    500: { description: 'Server error' }
  }
})

registry.registerPath({
  description: "Like an artist, release, or song, creating the item in the database if it does not exist.",
  method: 'post',
  path: '/users/like',
  tags: ['Users'],
  request: {
    body: {
      content: {
        'application/json' : { schema: likeSchema }
      }
    }
  },
  security: [{ bearerAuth: [] }],
  responses: {
    200: { description: 'Item liked' },
    400: { description: 'Missing itemId or type' },
    401: { description: 'Unauthorized' },
    500: { description: 'Server error' }
  }
})

registry.registerPath({
  description: "Unfollow a user.",
  method: 'delete',
  path: '/users/unfollow',
  tags: ['Users'],
  request: {
    body: {
      content: {
        'application/json' : { schema: unfollowSchema }
      }
    }
  },
  security: [{ bearerAuth: [] }],
  responses: {
    200: { description: 'User unfollowed' },
    400: { description: 'Request Error' },
    401: { description: 'Unauthorized' },
    500: { description: 'Server error' }
  }
})

registry.registerPath({
  description: "Remove a liked artist, release, or song from a user's library.",
  method: 'delete',
  path: '/users/like',
  tags: ['Users'],
  request: {
    body: {
      content: {
        'application/json' : { schema: deleteLikeSchema }
      }
    }
  },
  security: [{ bearerAuth: [] }],
  responses: {
    200: { description: 'Like removed' },
    400: { description: 'Request Error' },
    401: { description: 'Unauthorized' },
    500: { description: 'Server error' }
  }
})