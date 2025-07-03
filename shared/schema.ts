import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  date,
  boolean,
  decimal,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table - required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - required for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contacts table
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  email: varchar("email"),
  phone: varchar("phone"),
  relationship: varchar("relationship"),
  preferences: text("preferences"),
  photoUrl: varchar("photo_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Special dates table
export const specialDates = pgTable("special_dates", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  contactId: integer("contact_id").references(() => contacts.id, { onDelete: "cascade" }),
  title: varchar("title").notNull(),
  type: varchar("type").notNull(), // birthday, anniversary, holiday, etc.
  date: date("date").notNull(),
  recurring: boolean("recurring").default(true),
  reminderDays: integer("reminder_days").default(7),
  notes: text("notes"),
  shopped: boolean("shopped").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Wishlist items table
export const wishlistItems = pgTable("wishlist_items", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }),
  url: varchar("url"),
  imageUrl: varchar("image_url"),
  category: varchar("category"),
  priority: varchar("priority").default("medium"), // low, medium, high
  purchased: boolean("purchased").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Friend requests table
export const friendRequests = pgTable("friend_requests", {
  id: serial("id").primaryKey(),
  senderId: varchar("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  receiverId: varchar("receiver_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  status: varchar("status").notNull().default("pending"), // pending, accepted, declined
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Friendships table (for accepted friend relationships)
export const friendships = pgTable("friendships", {
  id: serial("id").primaryKey(),
  user1Id: varchar("user1_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  user2Id: varchar("user2_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Shared special dates table
export const sharedSpecialDates = pgTable("shared_special_dates", {
  id: serial("id").primaryKey(),
  specialDateId: integer("special_date_id").notNull().references(() => specialDates.id, { onDelete: "cascade" }),
  ownerId: varchar("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  sharedWithId: varchar("shared_with_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  canEdit: boolean("can_edit").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Shared wishlist items table
export const sharedWishlistItems = pgTable("shared_wishlist_items", {
  id: serial("id").primaryKey(),
  wishlistItemId: integer("wishlist_item_id").notNull().references(() => wishlistItems.id, { onDelete: "cascade" }),
  ownerId: varchar("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  sharedWithId: varchar("shared_with_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  canEdit: boolean("can_edit").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Collaborative wishlists table
export const collaborativeWishlists = pgTable("collaborative_wishlists", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  createdById: varchar("created_by_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Collaborative wishlist members table
export const collaborativeWishlistMembers = pgTable("collaborative_wishlist_members", {
  id: serial("id").primaryKey(),
  wishlistId: integer("wishlist_id").notNull().references(() => collaborativeWishlists.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: varchar("role").notNull().default("member"), // creator, admin, member
  canEdit: boolean("can_edit").default(true),
  canInvite: boolean("can_invite").default(false),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Collaborative wishlist items table
export const collaborativeWishlistItems = pgTable("collaborative_wishlist_items", {
  id: serial("id").primaryKey(),
  wishlistId: integer("wishlist_id").notNull().references(() => collaborativeWishlists.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }),
  url: varchar("url"),
  imageUrl: varchar("image_url"),
  category: varchar("category"),
  priority: varchar("priority").default("medium"),
  addedById: varchar("added_by_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  claimedById: varchar("claimed_by_id").references(() => users.id, { onDelete: "set null" }),
  purchased: boolean("purchased").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  contacts: many(contacts),
  specialDates: many(specialDates),
  wishlistItems: many(wishlistItems),
}));

export const contactsRelations = relations(contacts, ({ one, many }) => ({
  user: one(users, {
    fields: [contacts.userId],
    references: [users.id],
  }),
  specialDates: many(specialDates),
}));

export const specialDatesRelations = relations(specialDates, ({ one }) => ({
  user: one(users, {
    fields: [specialDates.userId],
    references: [users.id],
  }),
  contact: one(contacts, {
    fields: [specialDates.contactId],
    references: [contacts.id],
  }),
}));

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  user: one(users, {
    fields: [wishlistItems.userId],
    references: [users.id],
  }),
}));

export const friendRequestsRelations = relations(friendRequests, ({ one }) => ({
  sender: one(users, {
    fields: [friendRequests.senderId],
    references: [users.id],
  }),
  receiver: one(users, {
    fields: [friendRequests.receiverId],
    references: [users.id],
  }),
}));

export const friendshipsRelations = relations(friendships, ({ one }) => ({
  user1: one(users, {
    fields: [friendships.user1Id],
    references: [users.id],
  }),
  user2: one(users, {
    fields: [friendships.user2Id],
    references: [users.id],
  }),
}));

export const sharedSpecialDatesRelations = relations(sharedSpecialDates, ({ one }) => ({
  specialDate: one(specialDates, {
    fields: [sharedSpecialDates.specialDateId],
    references: [specialDates.id],
  }),
  owner: one(users, {
    fields: [sharedSpecialDates.ownerId],
    references: [users.id],
  }),
  sharedWith: one(users, {
    fields: [sharedSpecialDates.sharedWithId],
    references: [users.id],
  }),
}));

export const sharedWishlistItemsRelations = relations(sharedWishlistItems, ({ one }) => ({
  wishlistItem: one(wishlistItems, {
    fields: [sharedWishlistItems.wishlistItemId],
    references: [wishlistItems.id],
  }),
  owner: one(users, {
    fields: [sharedWishlistItems.ownerId],
    references: [users.id],
  }),
  sharedWith: one(users, {
    fields: [sharedWishlistItems.sharedWithId],
    references: [users.id],
  }),
}));

export const collaborativeWishlistsRelations = relations(collaborativeWishlists, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [collaborativeWishlists.createdById],
    references: [users.id],
  }),
  members: many(collaborativeWishlistMembers),
  items: many(collaborativeWishlistItems),
}));

export const collaborativeWishlistMembersRelations = relations(collaborativeWishlistMembers, ({ one }) => ({
  wishlist: one(collaborativeWishlists, {
    fields: [collaborativeWishlistMembers.wishlistId],
    references: [collaborativeWishlists.id],
  }),
  user: one(users, {
    fields: [collaborativeWishlistMembers.userId],
    references: [users.id],
  }),
}));

export const collaborativeWishlistItemsRelations = relations(collaborativeWishlistItems, ({ one }) => ({
  wishlist: one(collaborativeWishlists, {
    fields: [collaborativeWishlistItems.wishlistId],
    references: [collaborativeWishlists.id],
  }),
  addedBy: one(users, {
    fields: [collaborativeWishlistItems.addedById],
    references: [users.id],
  }),
  claimedBy: one(users, {
    fields: [collaborativeWishlistItems.claimedById],
    references: [users.id],
  }),
}));

// Zod schemas
export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSpecialDateSchema = createInsertSchema(specialDates).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWishlistItemSchema = createInsertSchema(wishlistItems).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFriendRequestSchema = createInsertSchema(friendRequests).omit({
  id: true,
  senderId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCollaborativeWishlistSchema = createInsertSchema(collaborativeWishlists).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCollaborativeWishlistItemSchema = createInsertSchema(collaborativeWishlistItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type SpecialDate = typeof specialDates.$inferSelect;
export type InsertSpecialDate = z.infer<typeof insertSpecialDateSchema>;
export type WishlistItem = typeof wishlistItems.$inferSelect;
export type InsertWishlistItem = z.infer<typeof insertWishlistItemSchema>;
export type FriendRequest = typeof friendRequests.$inferSelect;
export type InsertFriendRequest = z.infer<typeof insertFriendRequestSchema>;
export type Friendship = typeof friendships.$inferSelect;
export type SharedSpecialDate = typeof sharedSpecialDates.$inferSelect;
export type SharedWishlistItem = typeof sharedWishlistItems.$inferSelect;
export type CollaborativeWishlist = typeof collaborativeWishlists.$inferSelect;
export type InsertCollaborativeWishlist = z.infer<typeof insertCollaborativeWishlistSchema>;
export type CollaborativeWishlistMember = typeof collaborativeWishlistMembers.$inferSelect;
export type CollaborativeWishlistItem = typeof collaborativeWishlistItems.$inferSelect;
export type InsertCollaborativeWishlistItem = z.infer<typeof insertCollaborativeWishlistItemSchema>;
