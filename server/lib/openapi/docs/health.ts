import { registry } from '../registry'

registry.registerPath({
  description: "Check if the server is running",
  method: 'get',
  path: '/health',
  tags: ['Health'],
  responses: {
    200: { description: 'Success' },
    400: { description: 'Request Error' }
  }
})