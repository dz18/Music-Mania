import { registerSchema } from '../../../schemas/auth.schema'
import registry from '../registry'

registry.registerPath({
  description: "Check if the server is running",
  method: 'get',
  path: '/health',
  tags: ['Health'],
  responses: {
    200: { description: 'Success' },
    400: { description: 'Request Error' },
    500: { description: 'Server Error' }
  }
})

registry.registerPath({
    description: 'Check if the server is connected to the database',
    method: 'get',
    path: '/health/database',
    tags: ['Health'],
    responses: {
        200: { description: 'Success'},
        400: { description: 'Request Error' },
        500: { description: 'Server Error' },
        503: { description: 'Service Unavailable' },
    }
})