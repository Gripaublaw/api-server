// src/routes/usuaris.ts
// Rutes API per gestionar els usuaris (taula `usuaris`).

import { Hono } from "hono";
import { desc, eq } from "drizzle-orm";
import { db } from "../db/client.ts";
import { usuaris } from "../db/schema.ts";

const app = new Hono();

// GET /api/usuaris — Llista tots els usuaris
app.get("/", async (c) => {
  const allUsuaris = await db.select().from(usuaris).orderBy(
    desc(usuaris.createdAt),
  );
  return c.json(allUsuaris);
});

// GET /api/usuaris/:id — Obté un usuari concret
app.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (Number.isNaN(id)) {
    return c.json({ error: "ID invàlid" }, 400);
  }

  const [usuari] = await db.select().from(usuaris).where(eq(usuaris.id, id));
  if (!usuari) {
    return c.json({ error: "Usuari no trobat" }, 404);
  }

  return c.json(usuari);
});

// POST /api/usuaris — Crea un usuari nou
app.post("/", async (c) => {
  const body = await c.req.json();

  // Validació bàsica
  if (!body.name || !body.email) {
    return c.json({ error: "Els camps 'name' i 'email' són obligatoris" }, 400);
  }

  try {
    const [newUsuari] = await db
      .insert(usuaris)
      .values({
        name: body.name,
        email: body.email,
        role: body.role ?? "viewer",
        status: body.status ?? "invited",
      })
      .returning();

    return c.json(newUsuari, 201);
  } catch (err) {
    // Error típic: email duplicat (violació de UNIQUE)
    if (err instanceof Error && err.message.includes("duplicate key")) {
      return c.json({ error: "Ja existeix un usuari amb aquest email" }, 409);
    }
    throw err;
  }
});

// PATCH /api/usuaris/:id — Actualitza un usuari existent
app.patch("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (Number.isNaN(id)) {
    return c.json({ error: "ID invàlid" }, 400);
  }

  const body = await c.req.json();

  try {
    const [updated] = await db
      .update(usuaris)
      .set({
        name: body.name,
        email: body.email,
        role: body.role,
        updatedAt: new Date(),
      })
      .where(eq(usuaris.id, id))
      .returning();

    if (!updated) {
      return c.json({ error: "Usuari no trobat" }, 404);
    }

    return c.json(updated);
  } catch (err) {
    // Error típic: email duplicat (violació de UNIQUE)
    if (err instanceof Error && err.message.includes("duplicate key")) {
      return c.json({ error: "Ja existeix un usuari amb aquest email" }, 409);
    }
    throw err;
  }
});

// DELETE /api/usuaris/:id — Esborra un usuari
app.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (Number.isNaN(id)) {
    return c.json({ error: "ID invàlid" }, 400);
  }

  const [deleted] = await db.delete(usuaris).where(eq(usuaris.id, id))
    .returning();
  if (!deleted) {
    return c.json({ error: "Usuari no trobat" }, 404);
  }

  return c.json({ message: "Usuari esborrat", usuari: deleted });
});

export default app;
