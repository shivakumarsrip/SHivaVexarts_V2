import "dotenv/config";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { writeFileSync } from "fs";
import path from "path";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

// File upload endpoint for artwork images
app.post("/api/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }
    console.log(`Uploading file: ${file.name} (${file.type})`);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const { createClient } = await import("@supabase/supabase-js");
    console.log("Supabase Config:", { url: env.supabaseUrl, hasKey: !!env.supabaseKey });
    const supabase = createClient(env.supabaseUrl, env.supabaseKey);

    const cleanFileName = (file.name || "artwork.jpg").replace(/[^a-z0-9.]/gi, "_").toLowerCase();
    const filename = `artwork-${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${cleanFileName}`;
    console.log(`Generated filename: ${filename}`);

    const { data, error } = await supabase.storage
      .from("artworks")
      .upload(filename, buffer, {
        contentType: file.type || "image/jpeg",
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase Storage error:", error);
      return c.json({ error: `Upload failed: ${error.message}` }, 500);
    }

    const { data: { publicUrl } } = supabase.storage
      .from("artworks")
      .getPublicUrl(filename);

    console.log(`Public URL: ${publicUrl}`);
    return c.json({ url: publicUrl });
  } catch (err: any) {
    console.error("Upload error:", err);
    return c.json({ error: `Upload failed: ${err.message || "Unknown error"}` }, 500);
  }
});

app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;

// Only start Node.js server in self-hosted production (not Vercel/Netlify)
if (env.isProduction && !process.env.VERCEL && !process.env.NETLIFY) {
  (async () => {
    const { serve } = await import("@hono/node-server");
    const { serveStaticFiles } = await import("./lib/vite");
    serveStaticFiles(app);

    const port = parseInt(process.env.PORT || "3000");
    serve({ fetch: app.fetch, port }, () => {
      console.log(`Server running on http://localhost:${port}/`);
    });
  })();
}


