import { users, musicPatterns, type User, type InsertUser, type MusicPattern, type InsertMusicPattern } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getMusicPatterns(userId?: number): Promise<MusicPattern[]>;
  createMusicPattern(pattern: InsertMusicPattern & { userId?: number }): Promise<MusicPattern>;
  deleteMusicPattern(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private musicPatterns: Map<number, MusicPattern>;
  private currentUserId: number;
  private currentPatternId: number;

  constructor() {
    this.users = new Map();
    this.musicPatterns = new Map();
    this.currentUserId = 1;
    this.currentPatternId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getMusicPatterns(userId?: number): Promise<MusicPattern[]> {
    const patterns = Array.from(this.musicPatterns.values());
    if (userId) {
      return patterns.filter(pattern => pattern.userId === userId);
    }
    return patterns;
  }

  async createMusicPattern(patternData: InsertMusicPattern & { userId?: number }): Promise<MusicPattern> {
    const id = this.currentPatternId++;
    const pattern: MusicPattern = {
      id,
      userId: patternData.userId || null,
      name: patternData.name,
      mode: patternData.mode,
      pattern: patternData.pattern,
      createdAt: new Date().toISOString(),
    };
    this.musicPatterns.set(id, pattern);
    return pattern;
  }

  async deleteMusicPattern(id: number): Promise<boolean> {
    return this.musicPatterns.delete(id);
  }
}

export const storage = new MemStorage();
