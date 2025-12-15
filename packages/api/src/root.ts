import { router } from "./trpc";
import { todoRouter } from "./routers";

export const appRouter = router({
  todo: todoRouter,
  // Add more routers here:
  // user: userRouter,
  // project: projectRouter,
});

export type AppRouter = typeof appRouter;
