import { createRouteHandler } from 'uploadthing/next';

import { env } from '@repo/env';
import { ourFileRouter } from './core';

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,

  config: {
    token: env.UPLOADTHING_TOKEN,
  },
});
