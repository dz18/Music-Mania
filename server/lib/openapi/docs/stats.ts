import { registry } from "../registry";

registry.registerPath({
  description: "Get stats displayed on the landing page",
  method: 'get',
  path: '/stats/landing',
  tags: ['Stats'],
  responses: {
    200: { description: 'Landing stats returned' },
    400: { description: 'Request Error' },
    500: { description: 'Server error' }
  }
})