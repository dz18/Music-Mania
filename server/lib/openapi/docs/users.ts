import { registry } from "../registry";
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
  method: 'get',
  path: '/users/total',
  tags: ['Users'],
  responses: {
    200: { description: 'Success' }
  }
})

registry.registerPath({
  method: 'get',
  path: '/users/query',
  tags: ['Users'],
  request: {
    query: querySchema
  },
  responses: {
    200: { description: 'Success' }
  }
})

registry.registerPath({
  method: 'get',
  path: '/users/likes',
  tags: ['Users'],
  request: {
    query: likesSchema
  },
  responses: {
    200: { description: 'Success' }
  }
})

registry.registerPath({
  method: 'get',
  path: '/users/profile',
  tags: ['Users'],
  request: {
    query: profileSchema
  },
  responses: {
    200: { description: 'Success' }
  }
})

registry.registerPath({
  method: 'get',
  path: '/users/allFollowers',
  tags: ['Users'],
  request: {
    query: allFollowersSchema
  },
  responses: {
    200: { description: 'Success' }
  }
})

registry.registerPath({
  method: 'get',
  path: '/users/follow',
  tags: ['Users'],
  request: {
    query: isFollowingSchema
  },
  responses: {
    200: { description: 'Success' }
  }
})

registry.registerPath({
  method: 'get',
  path: '/users/find',
  tags: ['Users'],
  responses: {
    200: { description: 'Success' }
  }
})

registry.registerPath({
  method: 'get',
  path: '/users/edit',
  tags: ['Users'],
  responses: {
    200: { description: 'Success' }
  }
})

registry.registerPath({
  method: 'get',
  path: '/users/review',
  tags: ['Users'],
  request: {
    query: reviewPanelSchema
  },
  responses: {
    200: { description: 'Success' }
  }
})

registry.registerPath({
  method: 'get',
  path: '/users/like',
  tags: ['Users'],
  request: {
    query: checkLikeSchema
  },
  responses: {
    200: { description: 'Success' }
  }
})

registry.registerPath({
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
  responses: {
    200: { description: 'Success' }
  }
})

registry.registerPath({
  method: 'post',
  path: '/users/edit',
  tags: ['Users'],
  request: {
    body: {
      content: {
        'application/json' : { schema: followSchema }
      }
    }
  },
  responses: {
    200: { description: 'Success' }
  }
})

registry.registerPath({
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
  responses: {
    200: { description: 'Success' }
  }
})

registry.registerPath({
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
  responses: {
    200: { description: 'Success' }
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
  responses: {
    200: { description: 'Success' }
  }
})