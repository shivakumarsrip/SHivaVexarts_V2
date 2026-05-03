import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  console.log(`Checking env ${name}: ${value ? "Found" : "NOT FOUND"}`);
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value ?? "";
}

export const env = {
  sessionSecret: required("SESSION_SECRET"),
  adminEmail: required("ADMIN_EMAIL").toLowerCase(),
  adminPassword: required("ADMIN_PASSWORD"),
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: required("DATABASE_URL"),
  supabaseUrl: required("SUPABASE_URL"),
  supabaseKey: required("SUPABASE_SERVICE_ROLE_KEY"),
};
