import { createRouteHandler } from "uploadthing/next";
import type { NextRequest } from "next/server";

import { env } from "@repo/env";
import { ourFileRouter } from "./core";

// Forcefully tell TS this matches Next's route handler type
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: env.UPLOADTHING_TOKEN,
  },
}) as {
  GET: (req: NextRequest) => Promise<Response>;
  POST: (req: NextRequest) => Promise<Response>;
};
