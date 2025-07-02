import {
  users,
  contacts,
  specialDates,
  wishlistItems,
  friendRequests,
  friendships,
  sharedSpecialDates,
  sharedWishlistItems,
  collaborativeWishlists,
  collaborativeWishlistMembers,
  collaborativeWishlistItems,
  type User,
  type UpsertUser,
  type Contact,
  type InsertContact,
  type SpecialDate,
  type InsertSpecialDate,
  type WishlistItem,
  type InsertWishlistItem,
  type FriendRequest,
  type InsertFriendRequest,
  type Friendship,
  type SharedSpecialDate,
  type SharedWishlistItem,
  type CollaborativeWishlist,
  type InsertCollaborativeWishlist,
  type CollaborativeWishlistMember,
  type CollaborativeWishlistItem,
  type InsertCollaborativeWishlistItem,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, sql, or, ilike, ne } from "drizzle-orm";

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
  
  // Friend operations
  sendFriendRequest(senderId: string, receiverEmail: string): Promise<FriendRequest>;
  getFriendRequests(userId: string): Promise<FriendRequest[]>;
  getSentFriendRequests(userId: string): Promise<FriendRequest[]>;
  acceptFriendRequest(requestId: number): Promise<Friendship>;
  declineFriendRequest(requestId: number): Promise<void>;
  getFriends(userId: string): Promise<User[]>;
  removeFriend(userId: string, friendId: string): Promise<void>;
  searchUsers(query: string, excludeUserId: string): Promise<User[]>;
  
  // Sharing operations
  shareSpecialDate(ownerId: string, dateId: number, sharedWithId: string, canEdit?: boolean): Promise<SharedSpecialDate>;
  shareWishlistItem(ownerId: string, itemId: number, sharedWithId: string, canEdit?: boolean): Promise<SharedWishlistItem>;
  getSharedSpecialDates(userId: string): Promise<(SharedSpecialDate & { specialDate: SpecialDate; owner: User })[]>;
  getSharedWishlistItems(userId: string): Promise<(SharedWishlistItem & { wishlistItem: WishlistItem; owner: User })[]>;
  unshareSpecialDate(shareId: number): Promise<void>;
  unshareWishlistItem(shareId: number): Promise<void>;
  
  // Collaborative wishlist operations
  createCollaborativeWishlist(userId: string, wishlist: InsertCollaborativeWishlist): Promise<CollaborativeWishlist>;
  getCollaborativeWishlists(userId: string): Promise<CollaborativeWishlist[]>;
  getCollaborativeWishlist(wishlistId: number): Promise<(CollaborativeWishlist & { members: (CollaborativeWishlistMember & { user: User })[]; items: (CollaborativeWishlistItem & { addedBy: User; claimedBy?: User })[] }) | undefined>;
  addCollaborativeWishlistMember(wishlistId: number, userId: string, role?: string): Promise<CollaborativeWishlistMember>;
  removeCollaborativeWishlistMember(wishlistId: number, userId: string): Promise<void>;
  addCollaborativeWishlistItem(userId: string, wishlistId: number, item: InsertCollaborativeWishlistItem): Promise<CollaborativeWishlistItem>;
  updateCollaborativeWishlistItem(itemId: number, item: Partial<InsertCollaborativeWishlistItem>): Promise<CollaborativeWishlistItem>;
  deleteCollaborativeWishlistItem(itemId: number): Promise<void>;
  claimCollaborativeWishlistItem(itemId: number, userId: string): Promise<CollaborativeWishlistItem>;
  unclaimCollaborativeWishlistItem(itemId: number): Promise<CollaborativeWishlistItem>;
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

  // Friend operations
  async sendFriendRequest(senderId: string, receiverEmail: string): Promise<FriendRequest> {
    // First find the receiver by email
    const [receiver] = await db.select().from(users).where(eq(users.email, receiverEmail));
    if (!receiver) {
      throw new Error("User not found with that email");
    }

    if (receiver.id === senderId) {
      throw new Error("Cannot send friend request to yourself");
    }

    // Check if request already exists
    const [existingRequest] = await db.select().from(friendRequests).where(
      and(
        eq(friendRequests.senderId, senderId),
        eq(friendRequests.receiverId, receiver.id)
      )
    );

    if (existingRequest) {
      throw new Error("Friend request already sent");
    }

    // Check if they're already friends
    const [existingFriendship] = await db.select().from(friendships).where(
      or(
        and(eq(friendships.user1Id, senderId), eq(friendships.user2Id, receiver.id)),
        and(eq(friendships.user1Id, receiver.id), eq(friendships.user2Id, senderId))
      )
    );

    if (existingFriendship) {
      throw new Error("Already friends with this user");
    }

    const [friendRequest] = await db
      .insert(friendRequests)
      .values({
        senderId,
        receiverId: receiver.id,
        status: "pending",
      })
      .returning();

    return friendRequest;
  }

  async getFriendRequests(userId: string): Promise<FriendRequest[]> {
    return await db
      .select({
        id: friendRequests.id,
        senderId: friendRequests.senderId,
        receiverId: friendRequests.receiverId,
        status: friendRequests.status,
        createdAt: friendRequests.createdAt,
        updatedAt: friendRequests.updatedAt,
        sender: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
        },
      })
      .from(friendRequests)
      .leftJoin(users, eq(friendRequests.senderId, users.id))
      .where(
        and(
          eq(friendRequests.receiverId, userId),
          eq(friendRequests.status, "pending")
        )
      )
      .orderBy(desc(friendRequests.createdAt));
  }

  async getSentFriendRequests(userId: string): Promise<FriendRequest[]> {
    return await db
      .select({
        id: friendRequests.id,
        senderId: friendRequests.senderId,
        receiverId: friendRequests.receiverId,
        status: friendRequests.status,
        createdAt: friendRequests.createdAt,
        updatedAt: friendRequests.updatedAt,
        receiver: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
        },
      })
      .from(friendRequests)
      .leftJoin(users, eq(friendRequests.receiverId, users.id))
      .where(eq(friendRequests.senderId, userId))
      .orderBy(desc(friendRequests.createdAt));
  }

  async acceptFriendRequest(requestId: number): Promise<Friendship> {
    // Get the friend request
    const [friendRequest] = await db
      .select()
      .from(friendRequests)
      .where(eq(friendRequests.id, requestId));

    if (!friendRequest) {
      throw new Error("Friend request not found");
    }

    if (friendRequest.status !== "pending") {
      throw new Error("Friend request is not pending");
    }

    // Update the request status
    await db
      .update(friendRequests)
      .set({ status: "accepted", updatedAt: new Date() })
      .where(eq(friendRequests.id, requestId));

    // Create friendship (ensure consistent ordering: smaller ID first)
    const user1Id = friendRequest.senderId < friendRequest.receiverId ? friendRequest.senderId : friendRequest.receiverId;
    const user2Id = friendRequest.senderId < friendRequest.receiverId ? friendRequest.receiverId : friendRequest.senderId;

    const [friendship] = await db
      .insert(friendships)
      .values({
        user1Id,
        user2Id,
      })
      .returning();

    return friendship;
  }

  async declineFriendRequest(requestId: number): Promise<void> {
    await db
      .update(friendRequests)
      .set({ status: "declined", updatedAt: new Date() })
      .where(eq(friendRequests.id, requestId));
  }

  async getFriends(userId: string): Promise<User[]> {
    const friendsData = await db
      .select({
        friend: users,
      })
      .from(friendships)
      .leftJoin(users, or(
        and(eq(friendships.user1Id, userId), eq(users.id, friendships.user2Id)),
        and(eq(friendships.user2Id, userId), eq(users.id, friendships.user1Id))
      ))
      .where(or(
        eq(friendships.user1Id, userId),
        eq(friendships.user2Id, userId)
      ));

    return friendsData.map(row => row.friend).filter((friend): friend is User => friend !== null);
  }

  async removeFriend(userId: string, friendId: string): Promise<void> {
    await db
      .delete(friendships)
      .where(or(
        and(eq(friendships.user1Id, userId), eq(friendships.user2Id, friendId)),
        and(eq(friendships.user1Id, friendId), eq(friendships.user2Id, userId))
      ));
  }

  async searchUsers(query: string, excludeUserId: string): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(
        and(
          ne(users.id, excludeUserId),
          or(
            ilike(users.firstName, `%${query}%`),
            ilike(users.lastName, `%${query}%`),
            ilike(users.email, `%${query}%`)
          )
        )
      )
      .limit(10);
  }

  // Sharing operations
  async shareSpecialDate(ownerId: string, dateId: number, sharedWithId: string, canEdit = false): Promise<SharedSpecialDate> {
    const [sharedDate] = await db
      .insert(sharedSpecialDates)
      .values({
        specialDateId: dateId,
        ownerId,
        sharedWithId,
        canEdit,
      })
      .returning();
    return sharedDate;
  }

  async shareWishlistItem(ownerId: string, itemId: number, sharedWithId: string, canEdit = false): Promise<SharedWishlistItem> {
    const [sharedItem] = await db
      .insert(sharedWishlistItems)
      .values({
        wishlistItemId: itemId,
        ownerId,
        sharedWithId,
        canEdit,
      })
      .returning();
    return sharedItem;
  }

  async getSharedSpecialDates(userId: string): Promise<(SharedSpecialDate & { specialDate: SpecialDate; owner: User })[]> {
    const results = await db
      .select()
      .from(sharedSpecialDates)
      .where(eq(sharedSpecialDates.sharedWithId, userId))
      .leftJoin(specialDates, eq(sharedSpecialDates.specialDateId, specialDates.id))
      .leftJoin(users, eq(sharedSpecialDates.ownerId, users.id));

    return results.map(row => ({
      ...row.shared_special_dates,
      specialDate: row.special_dates!,
      owner: row.users!,
    }));
  }

  async getSharedWishlistItems(userId: string): Promise<(SharedWishlistItem & { wishlistItem: WishlistItem; owner: User })[]> {
    const results = await db
      .select()
      .from(sharedWishlistItems)
      .where(eq(sharedWishlistItems.sharedWithId, userId))
      .leftJoin(wishlistItems, eq(sharedWishlistItems.wishlistItemId, wishlistItems.id))
      .leftJoin(users, eq(sharedWishlistItems.ownerId, users.id));

    return results.map(row => ({
      ...row.shared_wishlist_items,
      wishlistItem: row.wishlist_items!,
      owner: row.users!,
    }));
  }

  async unshareSpecialDate(shareId: number): Promise<void> {
    await db.delete(sharedSpecialDates).where(eq(sharedSpecialDates.id, shareId));
  }

  async unshareWishlistItem(shareId: number): Promise<void> {
    await db.delete(sharedWishlistItems).where(eq(sharedWishlistItems.id, shareId));
  }

  // Collaborative wishlist operations
  async createCollaborativeWishlist(userId: string, wishlist: InsertCollaborativeWishlist): Promise<CollaborativeWishlist> {
    const [newWishlist] = await db
      .insert(collaborativeWishlists)
      .values({
        ...wishlist,
        createdById: userId,
      })
      .returning();

    // Add the creator as an admin member
    await db
      .insert(collaborativeWishlistMembers)
      .values({
        wishlistId: newWishlist.id,
        userId,
        role: "creator",
        canEdit: true,
        canInvite: true,
      });

    return newWishlist;
  }

  async getCollaborativeWishlists(userId: string): Promise<CollaborativeWishlist[]> {
    const results = await db
      .select({
        wishlist: collaborativeWishlists,
      })
      .from(collaborativeWishlistMembers)
      .where(eq(collaborativeWishlistMembers.userId, userId))
      .leftJoin(collaborativeWishlists, eq(collaborativeWishlistMembers.wishlistId, collaborativeWishlists.id));

    return results.map(row => row.wishlist!);
  }

  async getCollaborativeWishlist(wishlistId: number): Promise<(CollaborativeWishlist & { members: (CollaborativeWishlistMember & { user: User })[]; items: (CollaborativeWishlistItem & { addedBy: User; claimedBy?: User })[] }) | undefined> {
    const [wishlist] = await db
      .select()
      .from(collaborativeWishlists)
      .where(eq(collaborativeWishlists.id, wishlistId));

    if (!wishlist) return undefined;

    // Get members
    const membersResult = await db
      .select()
      .from(collaborativeWishlistMembers)
      .where(eq(collaborativeWishlistMembers.wishlistId, wishlistId))
      .leftJoin(users, eq(collaborativeWishlistMembers.userId, users.id));

    const members = membersResult.map(row => ({
      ...row.collaborative_wishlist_members,
      user: row.users!,
    }));

    // Get items
    const itemsResult = await db
      .select()
      .from(collaborativeWishlistItems)
      .where(eq(collaborativeWishlistItems.wishlistId, wishlistId))
      .leftJoin(users, eq(collaborativeWishlistItems.addedById, users.id))
      .leftJoin(users, eq(collaborativeWishlistItems.claimedById, users.id));

    const items = itemsResult.map(row => ({
      ...row.collaborative_wishlist_items,
      addedBy: row.users!,
      claimedBy: row.users || undefined,
    }));

    return {
      ...wishlist,
      members,
      items,
    };
  }

  async addCollaborativeWishlistMember(wishlistId: number, userId: string, role = "member"): Promise<CollaborativeWishlistMember> {
    const [member] = await db
      .insert(collaborativeWishlistMembers)
      .values({
        wishlistId,
        userId,
        role,
        canEdit: role !== "viewer",
        canInvite: role === "admin" || role === "creator",
      })
      .returning();
    return member;
  }

  async removeCollaborativeWishlistMember(wishlistId: number, userId: string): Promise<void> {
    await db
      .delete(collaborativeWishlistMembers)
      .where(
        and(
          eq(collaborativeWishlistMembers.wishlistId, wishlistId),
          eq(collaborativeWishlistMembers.userId, userId)
        )
      );
  }

  async addCollaborativeWishlistItem(userId: string, wishlistId: number, item: InsertCollaborativeWishlistItem): Promise<CollaborativeWishlistItem> {
    const [newItem] = await db
      .insert(collaborativeWishlistItems)
      .values({
        ...item,
        wishlistId,
        addedById: userId,
      })
      .returning();
    return newItem;
  }

  async updateCollaborativeWishlistItem(itemId: number, item: Partial<InsertCollaborativeWishlistItem>): Promise<CollaborativeWishlistItem> {
    const [updatedItem] = await db
      .update(collaborativeWishlistItems)
      .set({
        ...item,
        updatedAt: new Date(),
      })
      .where(eq(collaborativeWishlistItems.id, itemId))
      .returning();
    return updatedItem;
  }

  async deleteCollaborativeWishlistItem(itemId: number): Promise<void> {
    await db.delete(collaborativeWishlistItems).where(eq(collaborativeWishlistItems.id, itemId));
  }

  async claimCollaborativeWishlistItem(itemId: number, userId: string): Promise<CollaborativeWishlistItem> {
    const [claimedItem] = await db
      .update(collaborativeWishlistItems)
      .set({
        claimedById: userId,
        updatedAt: new Date(),
      })
      .where(eq(collaborativeWishlistItems.id, itemId))
      .returning();
    return claimedItem;
  }

  async unclaimCollaborativeWishlistItem(itemId: number): Promise<CollaborativeWishlistItem> {
    const [unclaimedItem] = await db
      .update(collaborativeWishlistItems)
      .set({
        claimedById: null,
        updatedAt: new Date(),
      })
      .where(eq(collaborativeWishlistItems.id, itemId))
      .returning();
    return unclaimedItem;
  }
}

export const storage = new DatabaseStorage();
