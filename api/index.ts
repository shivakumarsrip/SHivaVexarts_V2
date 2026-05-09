import { handle } from "hono/vercel";
import app from "./boot";

// Vercel serverless function handler
export default handle(app);
