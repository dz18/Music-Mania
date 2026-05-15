import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi'
import { registry } from './registry'
import './docs/auth'
import './docs/users'
import './docs/musicbrainz'
import './docs/reviews'
import './docs/stats'
import './docs/health'

export function generateOpenApiDoc() {
  return new OpenApiGeneratorV3(registry.definitions).generateDocument({
    openapi: '3.0.0',
    info: { title: 'Music Mania API', version: '1.0.0' },
    servers: [{ url: '/api' }],
  })
}