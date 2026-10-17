// src/db/client.ts
// Connexió a PostgreSQL via Drizzle ORM.
// Aquest fitxer s'importa des de qualsevol altre fitxer del projecte
// que necessiti accedir a la base de dades.

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.ts";

// Llegeix la URL de connexió del .env
const databaseUrl = Deno.env.get("DATABASE_URL");

if (!databaseUrl) {
  throw new Error("Falta la variable DATABASE_URL. Comprova el fitxer .env");
}

// Crea el client de PostgreSQL
const queryClient = postgres(databaseUrl);

// Crea l'objecte Drizzle, passant-li l'esquema
// perquè pugui inferir tipus automàticament
export const db = drizzle(queryClient, { schema });

// Exporta també el client de postgres per si cal tancar la connexió
export { queryClient };
