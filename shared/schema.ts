import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const musicPatterns = pgTable("music_patterns", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  mode: text("mode").notNull(), // 'scales', 'intervals', 'chords', etc.
  pattern: jsonb("pattern").notNull(), // stores the musical pattern data
  createdAt: text("created_at").notNull().default("now()"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMusicPatternSchema = createInsertSchema(musicPatterns).pick({
  name: true,
  mode: true,
  pattern: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMusicPattern = z.infer<typeof insertMusicPatternSchema>;
export type MusicPattern = typeof musicPatterns.$inferSelect;
