// src/main.ts
// Punt d'entrada del servidor Hono.
// Arrenca el servidor HTTP i munta totes les rutes de l'API.

import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import appsRouter from "./routes/apps.ts";

const app = new Hono();

// Middleware: logging de peticions (útil per veure què arriba)
app.use("*", logger());

// Middleware: CORS (perquè el dashboard Fresh pugui cridar l'API)
app.use(
  "*",
  cors({
    origin: ["http://localhost:5173", "http://localhost:8000"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

// Ruta arrel de l'API (útil per comprovar que el servidor funciona)
app.get("/", (c) => {
  return c.json({
    name: "Nexus API",
    version: "0.1.0",
    status: "ok",
  });
});

// Muntem el router d'apps a /api/apps
app.route("/api/apps", appsRouter);

// Llegeix el port del .env
const port = Number(Deno.env.get("PORT") ?? "8000");

console.log(`🚀 Servidor Hono arrencant al port ${port}...`);
console.log(`📍 API: http://localhost:${port}`);
console.log(`📍 Apps: http://localhost:${port}/api/apps`);

// Arrenca el servidor
Deno.serve({ port }, app.fetch);
