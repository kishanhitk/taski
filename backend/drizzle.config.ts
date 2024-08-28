import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./src/models/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DRIZZLE_DATABASE_URL!,
  },
  migrations: {},
});
