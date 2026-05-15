import { registry } from '../registry'

registry.registerPath({
  method: 'get',
  path: '/health',
  tags: ['Health'],
  responses: {
    200: { description: 'Success' }
  }
})