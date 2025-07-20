import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMusicPatternSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all music patterns
  app.get("/api/patterns", async (req, res) => {
    try {
      const patterns = await storage.getMusicPatterns();
      res.json(patterns);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch patterns" });
    }
  });

  // Create a new music pattern
  app.post("/api/patterns", async (req, res) => {
    try {
      const validatedData = insertMusicPatternSchema.parse(req.body);
      const pattern = await storage.createMusicPattern(validatedData);
      res.json(pattern);
    } catch (error) {
      res.status(400).json({ message: "Invalid pattern data" });
    }
  });

  // Delete a music pattern
  app.delete("/api/patterns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteMusicPattern(id);
      if (success) {
        res.json({ message: "Pattern deleted successfully" });
      } else {
        res.status(404).json({ message: "Pattern not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete pattern" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
