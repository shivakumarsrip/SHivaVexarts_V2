import { authRouter } from "./auth-router";
import { artworkRouter } from "./artwork-router";
import { orderRouter } from "./order-router";
import { contactRouter } from "./contact-router";
import { settingsRouter } from "./settings-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  artwork: artworkRouter,
  order: orderRouter,
  contact: contactRouter,
  settings: settingsRouter,
});

export type AppRouter = typeof appRouter;
