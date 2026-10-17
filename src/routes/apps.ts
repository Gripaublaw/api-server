// src/routes/apps.ts
// Rutes API per gestionar les aplicacions (taula `apps`).

import { Hono } from "hono";
import { desc, eq } from "drizzle-orm";
import { db } from "../db/client.ts";
import { apps } from "../db/schema.ts";

const app = new Hono();

// GET /api/apps — Llista totes les apps
app.get("/", async (c) => {
  const allApps = await db.select().from(apps).orderBy(desc(apps.createdAt));
  return c.json(allApps);
});

// GET /api/apps/:id — Obté una app concreta
app.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (Number.isNaN(id)) {
    return c.json({ error: "ID invàlid" }, 400);
  }

  const [app] = await db.select().from(apps).where(eq(apps.id, id));
  if (!app) {
    return c.json({ error: "App no trobada" }, 404);
  }

  return c.json(app);
});

// POST /api/apps — Crea una app nova
app.post("/", async (c) => {
  const body = await c.req.json();

  // Validació bàsica
  if (!body.name || !body.slug) {
    return c.json({ error: "Els camps 'name' i 'slug' són obligatoris" }, 400);
  }

  try {
    const [newApp] = await db
      .insert(apps)
      .values({
        name: body.name,
        slug: body.slug,
        status: body.status ?? "pending",
        type: body.type ?? "internal",
      })
      .returning();

    return c.json(newApp, 201);
  } catch (err) {
    // Error típic: slug duplicat (violació de UNIQUE)
    if (err instanceof Error && err.message.includes("duplicate key")) {
      return c.json({ error: "Ja existeix una app amb aquest slug" }, 409);
    }
    throw err;
  }
});

// DELETE /api/apps/:id — Esborra una app
app.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (Number.isNaN(id)) {
    return c.json({ error: "ID invàlid" }, 400);
  }

  const [deleted] = await db.delete(apps).where(eq(apps.id, id)).returning();
  if (!deleted) {
    return c.json({ error: "App no trobada" }, 404);
  }

  return c.json({ message: "App esborrada", app: deleted });
});

export default app;
