import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'

const registry = new OpenAPIRegistry()

// JWT Security Check middleware
registry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT'
})

export default registry