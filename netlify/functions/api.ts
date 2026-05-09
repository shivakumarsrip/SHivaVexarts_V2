import app from "../../api/boot";

// Netlify Functions v2 handler (Web API compatible)
export default async (request: Request) => {
  return app.fetch(request);
};
