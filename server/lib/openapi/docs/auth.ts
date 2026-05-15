import { registry } from '../registry'
import { 
  changePasswordSchema,
  confirmPasswordSchema,
  registerSchema, 
  signInSchema 
} from '../../../schemas/auth.schema'

registry.registerPath({
  method: 'post',
  path: '/auth/sign-in',
  tags: ['Auth'],
  request: { 
    body: { 
      content: { 
        'application/json': { schema: signInSchema } 
      } 
    } 
  },
  responses: { 
    200: { description: 'Success' }, 
    400: { description: 'Validation error' } 
  }
})

registry.registerPath({
  method: 'post',
  path: '/auth/register',
  tags: ['Auth'],
  request: {
    body: {
      content: {
        'application/json' : { schema: registerSchema }
      }
    }
  },
  responses: {

  }
})

registry.registerPath({
  method: 'post',
  path: '/auth/confirmPassword',
  tags: ['Auth'],
  request: {
    body: {
      content: {
        'application/json' : { schema: confirmPasswordSchema }
      }
    }
  },
  responses: {

  }
})

registry.registerPath({
  method: 'post',
  path: '/auth/changePassword',
  tags: ['Auth'],
  request: {
    body: {
      content: {
        'application/json' : { schema: changePasswordSchema }
      }
    }
  },
  responses: {

  }
})