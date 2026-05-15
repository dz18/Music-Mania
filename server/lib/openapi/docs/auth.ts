import { registry } from '../registry'
import { 
  changePasswordSchema,
  confirmPasswordSchema,
  registerSchema, 
  signInSchema 
} from '../../../schemas/auth.schema'

registry.registerPath({
  description: "Sign in with email and password",
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
    400: { description: 'Request Error' },
    401: { description: 'Invalid Password'},
    404: { description: 'User not found' },
    500: { description: 'Server Error'}
  }
})

registry.registerPath({
  description: "Register a user with email and password.",
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
    201: { description: 'User created' },
    400: { description: 'Request Error' },
    409: { description: 'Email or Username already in use' },
    500: { description: 'Server Error' }
  }
})

registry.registerPath({
  description: "Confirm input matches users password.",
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
    200: { description: 'Password confirmed' },
    400: { description: 'Request Error' },
    401: { description: 'Invalid password' },
    404: { description: 'User not found' },
    500: { description: 'Server Error' }
  }
})

registry.registerPath({
  description: "Change a users passwords.",
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
    200: { description: 'Password changed' },
    400: { description: 'Missing fields or passwords do not match' },
    500: { description: 'Server Error' }
  }
})