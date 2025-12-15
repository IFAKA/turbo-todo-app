import { createAppHandler } from "@repo/api/handler";
import { auth } from "@repo/auth";

const handler = createAppHandler({
  getSession: auth,
});

export const { GET, POST } = handler;
