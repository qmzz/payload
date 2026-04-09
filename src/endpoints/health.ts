import type { Endpoint } from 'payload'

export const healthCheck: Endpoint = {
  path: '/health',
  method: 'get',
  handler: async (req): Promise<Response> => {
    return Response.json(
      {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      },
    )
  },
}