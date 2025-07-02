import {
  users,
  contacts,
  specialDates,
  wishlistItems,
  type User,
  type UpsertUser,
  type Contact,
  type InsertContact,
  type SpecialDate,
  type InsertSpecialDate,
  type WishlistItem,
  type InsertWishlistItem,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Contact operations
  getContacts(userId: string): Promise<Contact[]>;
  createContact(userId: string, contact: InsertContact): Promise<Contact>;
  updateContact(id: number, contact: Partial<InsertContact>): Promise<Contact>;
  deleteContact(id: number): Promise<void>;
  getContact(id: number): Promise<Contact | undefined>;
  
  // Special dates operations
  getSpecialDates(userId: string): Promise<SpecialDate[]>;
  getUpcomingDates(userId: string, limit?: number): Promise<SpecialDate[]>;
  createSpecialDate(userId: string, date: InsertSpecialDate): Promise<SpecialDate>;
  updateSpecialDate(id: number, date: Partial<InsertSpecialDate>): Promise<SpecialDate>;
  deleteSpecialDate(id: number): Promise<void>;
  
  // Wishlist operations
  getWishlistItems(userId: string): Promise<WishlistItem[]>;
  createWishlistItem(userId: string, item: InsertWishlistItem): Promise<WishlistItem>;
  updateWishlistItem(id: number, item: Partial<InsertWishlistItem>): Promise<WishlistItem>;
  deleteWishlistItem(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Contact operations
  async getContacts(userId: string): Promise<Contact[]> {
    return await db
      .select()
      .from(contacts)
      .where(eq(contacts.userId, userId))
      .orderBy(asc(contacts.name));
  }

  async createContact(userId: string, contact: InsertContact): Promise<Contact> {
    const [newContact] = await db
      .insert(contacts)
      .values({ ...contact, userId })
      .returning();
    return newContact;
  }

  async updateContact(id: number, contact: Partial<InsertContact>): Promise<Contact> {
    const [updatedContact] = await db
      .update(contacts)
      .set({ ...contact, updatedAt: new Date() })
      .where(eq(contacts.id, id))
      .returning();
    return updatedContact;
  }

  async deleteContact(id: number): Promise<void> {
    await db.delete(contacts).where(eq(contacts.id, id));
  }

  async getContact(id: number): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
    return contact;
  }

  // Special dates operations
  async getSpecialDates(userId: string): Promise<SpecialDate[]> {
    return await db
      .select()
      .from(specialDates)
      .where(eq(specialDates.userId, userId))
      .orderBy(asc(specialDates.date));
  }

  async getUpcomingDates(userId: string, limit = 10): Promise<SpecialDate[]> {
    const today = new Date().toISOString().split('T')[0];
    return await db
      .select()
      .from(specialDates)
      .where(
        and(
          eq(specialDates.userId, userId),
          sql`${specialDates.date} >= ${today}`
        )
      )
      .orderBy(asc(specialDates.date))
      .limit(limit);
  }

  async createSpecialDate(userId: string, date: InsertSpecialDate): Promise<SpecialDate> {
    const [newDate] = await db
      .insert(specialDates)
      .values({ ...date, userId })
      .returning();
    return newDate;
  }

  async updateSpecialDate(id: number, date: Partial<InsertSpecialDate>): Promise<SpecialDate> {
    const [updatedDate] = await db
      .update(specialDates)
      .set({ ...date, updatedAt: new Date() })
      .where(eq(specialDates.id, id))
      .returning();
    return updatedDate;
  }

  async deleteSpecialDate(id: number): Promise<void> {
    await db.delete(specialDates).where(eq(specialDates.id, id));
  }

  // Wishlist operations
  async getWishlistItems(userId: string): Promise<WishlistItem[]> {
    return await db
      .select()
      .from(wishlistItems)
      .where(eq(wishlistItems.userId, userId))
      .orderBy(desc(wishlistItems.createdAt));
  }

  async createWishlistItem(userId: string, item: InsertWishlistItem): Promise<WishlistItem> {
    const [newItem] = await db
      .insert(wishlistItems)
      .values({ ...item, userId })
      .returning();
    return newItem;
  }

  async updateWishlistItem(id: number, item: Partial<InsertWishlistItem>): Promise<WishlistItem> {
    const [updatedItem] = await db
      .update(wishlistItems)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(wishlistItems.id, id))
      .returning();
    return updatedItem;
  }

  async deleteWishlistItem(id: number): Promise<void> {
    await db.delete(wishlistItems).where(eq(wishlistItems.id, id));
  }
}

export const storage = new DatabaseStorage();
