// src/db/schema.ts
// Definició de les taules de PostgreSQL mitjançant Drizzle ORM.
// Aquest fitxer és la "font de veritat" de l'estructura de la base de dades.

import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Taula `apps`: les aplicacions que el dashboard gestiona.
 *
 * Camps:
 * - id:         identificador únic, autoincremental
 * - name:       nom de l'aplicació (per exemple "Facturació")
 * - slug:       identificador curt per URL (per exemple "facturacio.nexus.cat")
 * - status:     estat actual (active, pending, inactive, degraded)
 * - type:       tipus d'app (internal, client, api)
 * - createdAt:  data de creació (s'omple automàticament)
 * - updatedAt:  data de l'última modificació (s'omple automàticament)
 */
export const apps = pgTable("apps", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  type: varchar("type", { length: 50 }).notNull().default("internal"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/**
 * Taula `usuaris`: els usuaris que tenen accés al dashboard.
 *
 * Camps:
 * - id:         identificador únic, autoincremental
 * - name:       nom complet de l'usuari
 * - email:      adreça de correu (única)
 * - role:       rol dins l'ecosistema (admin, editor, viewer, auditor)
 * - status:     estat del compte (active, invited, suspended)
 * - createdAt:  data de creació (s'omple automàticament)
 * - updatedAt:  data de l'última modificació (s'omple automàticament)
 */
export const usuaris = pgTable("usuaris", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  role: varchar("role", { length: 50 }).notNull().default("viewer"),
  status: varchar("status", { length: 50 }).notNull().default("invited"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Tipus TypeScript derivats de l'esquema (per tenir autocompletat al codi)
export type App = typeof apps.$inferSelect;
export type NewApp = typeof apps.$inferInsert;
export type Usuari = typeof usuaris.$inferSelect;
export type NewUsuari = typeof usuaris.$inferInsert;
