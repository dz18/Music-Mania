import { registry } from "../registry";

registry.registerPath({
  method: 'get',
  path: '/stats/landing',
  tags: ['Stats'],
  responses: {
    200: { description: 'Success' }
  }
})