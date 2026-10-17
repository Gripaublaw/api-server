// drizzle.config.ts
// Configuració de Drizzle Kit: on és l'esquema, on es guarden les migracions,
// i com connectar-se a PostgreSQL.

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: Deno.env.get("DATABASE_URL")!,
  },
});
