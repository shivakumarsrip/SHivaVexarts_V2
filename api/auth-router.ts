import * as cookie from "cookie";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { createRouter, authedQuery, publicQuery } from "./middleware";
import { env } from "./lib/env";
import { signSessionToken } from "./auth/session";
import { upsertUser } from "./queries/users";

const loginInput = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export const authRouter = createRouter({
  me: authedQuery.query((opts) => opts.ctx.user),
  login: publicQuery.input(loginInput).mutation(async ({ input, ctx }) => {
    const email = normalizeEmail(input.email);

    if (email !== env.adminEmail || input.password !== env.adminPassword) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid email or password",
      });
    }

    const unionId = `email:${email}`;
    await upsertUser({
      unionId,
      email,
      name: "Admin",
      role: "admin",
      lastSignInAt: new Date(),
    });

    const token = await signSessionToken({ unionId });
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, token, {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
        secure: opts.secure,
        maxAge: Session.maxAgeMs / 1000,
      }),
    );

    return { success: true };
  }),
  logout: authedQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
        secure: opts.secure,
        maxAge: 0,
      }),
    );
    return { success: true };
  }),
});
