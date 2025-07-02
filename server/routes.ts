import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  handleAmazonSearch, 
  handleOpenTableSearch, 
  handleExpediaSearch 
} from "./affiliates";
import { insertContactSchema, insertSpecialDateSchema, insertWishlistItemSchema, insertFriendRequestSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Contact routes
  app.get('/api/contacts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const contacts = await storage.getContacts(userId);
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  app.post('/api/contacts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(userId, contactData);
      res.json(contact);
    } catch (error) {
      console.error("Error creating contact:", error);
      res.status(500).json({ message: "Failed to create contact" });
    }
  });

  app.put('/api/contacts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const contactData = insertContactSchema.partial().parse(req.body);
      const contact = await storage.updateContact(id, contactData);
      res.json(contact);
    } catch (error) {
      console.error("Error updating contact:", error);
      res.status(500).json({ message: "Failed to update contact" });
    }
  });

  app.delete('/api/contacts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteContact(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting contact:", error);
      res.status(500).json({ message: "Failed to delete contact" });
    }
  });

  // Special dates routes
  app.get('/api/dates', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const dates = await storage.getSpecialDates(userId);
      res.json(dates);
    } catch (error) {
      console.error("Error fetching dates:", error);
      res.status(500).json({ message: "Failed to fetch dates" });
    }
  });

  app.get('/api/dates/upcoming', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const dates = await storage.getUpcomingDates(userId, limit);
      res.json(dates);
    } catch (error) {
      console.error("Error fetching upcoming dates:", error);
      res.status(500).json({ message: "Failed to fetch upcoming dates" });
    }
  });

  app.post('/api/dates', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const dateData = insertSpecialDateSchema.parse(req.body);
      const date = await storage.createSpecialDate(userId, dateData);
      res.json(date);
    } catch (error) {
      console.error("Error creating date:", error);
      res.status(500).json({ message: "Failed to create date" });
    }
  });

  app.put('/api/dates/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const dateData = insertSpecialDateSchema.partial().parse(req.body);
      const date = await storage.updateSpecialDate(id, dateData);
      res.json(date);
    } catch (error) {
      console.error("Error updating date:", error);
      res.status(500).json({ message: "Failed to update date" });
    }
  });

  app.delete('/api/dates/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSpecialDate(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting date:", error);
      res.status(500).json({ message: "Failed to delete date" });
    }
  });

  // Wishlist routes
  app.get('/api/wishlist', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const items = await storage.getWishlistItems(userId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      res.status(500).json({ message: "Failed to fetch wishlist" });
    }
  });

  app.post('/api/wishlist', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const itemData = insertWishlistItemSchema.parse(req.body);
      const item = await storage.createWishlistItem(userId, itemData);
      res.json(item);
    } catch (error) {
      console.error("Error creating wishlist item:", error);
      res.status(500).json({ message: "Failed to create wishlist item" });
    }
  });

  app.put('/api/wishlist/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const itemData = insertWishlistItemSchema.partial().parse(req.body);
      const item = await storage.updateWishlistItem(id, itemData);
      res.json(item);
    } catch (error) {
      console.error("Error updating wishlist item:", error);
      res.status(500).json({ message: "Failed to update wishlist item" });
    }
  });

  app.delete('/api/wishlist/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteWishlistItem(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting wishlist item:", error);
      res.status(500).json({ message: "Failed to delete wishlist item" });
    }
  });

  // Affiliate marketing endpoints
  app.get('/api/affiliate/amazon/search', isAuthenticated, handleAmazonSearch);
  
  // Gift recommendations using Amazon affiliate
  app.get('/api/recommendations/gifts', isAuthenticated, async (req: any, res) => {
    try {
      const { query = "gift", category } = req.query;
      const products = await import('./affiliates').then(module => 
        module.searchAmazonProducts(query as string, category as string)
      );
      res.json(products);
    } catch (error) {
      console.error("Error fetching gift recommendations:", error);
      res.status(500).json({ message: "Failed to fetch gift recommendations" });
    }
  });

  app.get('/api/affiliate/opentable/search', isAuthenticated, handleOpenTableSearch);
  
  // Restaurant recommendations using OpenTable affiliate
  app.get('/api/recommendations/restaurants', isAuthenticated, async (req: any, res) => {
    try {
      const { location = "New York", cuisine, coordinates } = req.query;
      const restaurants = await import('./affiliates').then(module => 
        module.searchOpenTableRestaurants(location as string, cuisine as string, coordinates as string)
      );
      res.json(restaurants);
    } catch (error) {
      console.error("Error fetching restaurant recommendations:", error);
      res.status(500).json({ message: "Failed to fetch restaurant recommendations" });
    }
  });

  app.get('/api/affiliate/expedia/search', isAuthenticated, handleExpediaSearch);
  
  // Travel recommendations using Expedia affiliate
  app.get('/api/recommendations/travel', isAuthenticated, async (req: any, res) => {
    try {
      const { destination = "Las Vegas", type = "hotels" } = req.query;
      const travelOptions = await import('./affiliates').then(module => 
        module.searchExpediaTravel(destination as string, type as "hotels" | "flights" | "packages")
      );
      res.json(travelOptions);
    } catch (error) {
      console.error("Error fetching travel recommendations:", error);
      res.status(500).json({ message: "Failed to fetch travel recommendations" });
    }
  });

  // Friend routes
  app.post('/api/friends/request', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { receiverEmail } = req.body;
      
      if (!receiverEmail) {
        return res.status(400).json({ message: "Receiver email is required" });
      }
      
      const friendRequest = await storage.sendFriendRequest(userId, receiverEmail);
      res.json(friendRequest);
    } catch (error: any) {
      console.error("Error sending friend request:", error);
      res.status(400).json({ message: error.message || "Failed to send friend request" });
    }
  });

  app.get('/api/friends/requests', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const requests = await storage.getFriendRequests(userId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      res.status(500).json({ message: "Failed to fetch friend requests" });
    }
  });

  app.get('/api/friends/requests/sent', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const requests = await storage.getSentFriendRequests(userId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching sent friend requests:", error);
      res.status(500).json({ message: "Failed to fetch sent friend requests" });
    }
  });

  app.post('/api/friends/requests/:id/accept', isAuthenticated, async (req: any, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const friendship = await storage.acceptFriendRequest(requestId);
      res.json(friendship);
    } catch (error: any) {
      console.error("Error accepting friend request:", error);
      res.status(400).json({ message: error.message || "Failed to accept friend request" });
    }
  });

  app.post('/api/friends/requests/:id/decline', isAuthenticated, async (req: any, res) => {
    try {
      const requestId = parseInt(req.params.id);
      await storage.declineFriendRequest(requestId);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error declining friend request:", error);
      res.status(400).json({ message: error.message || "Failed to decline friend request" });
    }
  });

  app.get('/api/friends', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const friends = await storage.getFriends(userId);
      res.json(friends);
    } catch (error) {
      console.error("Error fetching friends:", error);
      res.status(500).json({ message: "Failed to fetch friends" });
    }
  });

  app.delete('/api/friends/:friendId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const friendId = req.params.friendId;
      await storage.removeFriend(userId, friendId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing friend:", error);
      res.status(500).json({ message: "Failed to remove friend" });
    }
  });

  app.get('/api/users/search', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const query = req.query.q as string;
      
      if (!query) {
        return res.json([]);
      }
      
      const users = await storage.searchUsers(query, userId);
      res.json(users);
    } catch (error) {
      console.error("Error searching users:", error);
      res.status(500).json({ message: "Failed to search users" });
    }
  });

  // Sharing routes
  app.post("/api/sharing/special-dates", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { dateId, sharedWithId, canEdit } = req.body;

      const sharedDate = await storage.shareSpecialDate(userId, dateId, sharedWithId, canEdit);
      res.json(sharedDate);
    } catch (error) {
      console.error("Error sharing special date:", error);
      res.status(500).json({ message: "Failed to share special date" });
    }
  });

  app.post("/api/sharing/wishlist-items", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { itemId, sharedWithId, canEdit } = req.body;

      const sharedItem = await storage.shareWishlistItem(userId, itemId, sharedWithId, canEdit);
      res.json(sharedItem);
    } catch (error) {
      console.error("Error sharing wishlist item:", error);
      res.status(500).json({ message: "Failed to share wishlist item" });
    }
  });

  app.get("/api/sharing/special-dates", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sharedDates = await storage.getSharedSpecialDates(userId);
      res.json(sharedDates);
    } catch (error) {
      console.error("Error fetching shared special dates:", error);
      res.status(500).json({ message: "Failed to fetch shared special dates" });
    }
  });

  app.get("/api/sharing/wishlist-items", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sharedItems = await storage.getSharedWishlistItems(userId);
      res.json(sharedItems);
    } catch (error) {
      console.error("Error fetching shared wishlist items:", error);
      res.status(500).json({ message: "Failed to fetch shared wishlist items" });
    }
  });

  // Collaborative wishlist routes
  app.post("/api/collaborative-wishlists", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const wishlistData = req.body;

      const wishlist = await storage.createCollaborativeWishlist(userId, wishlistData);
      res.json(wishlist);
    } catch (error) {
      console.error("Error creating collaborative wishlist:", error);
      res.status(500).json({ message: "Failed to create collaborative wishlist" });
    }
  });

  app.get("/api/collaborative-wishlists", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const wishlists = await storage.getCollaborativeWishlists(userId);
      res.json(wishlists);
    } catch (error) {
      console.error("Error fetching collaborative wishlists:", error);
      res.status(500).json({ message: "Failed to fetch collaborative wishlists" });
    }
  });

  app.get("/api/collaborative-wishlists/:wishlistId", isAuthenticated, async (req: any, res) => {
    try {
      const { wishlistId } = req.params;
      const wishlist = await storage.getCollaborativeWishlist(parseInt(wishlistId));
      
      if (!wishlist) {
        return res.status(404).json({ message: "Collaborative wishlist not found" });
      }

      res.json(wishlist);
    } catch (error) {
      console.error("Error fetching collaborative wishlist:", error);
      res.status(500).json({ message: "Failed to fetch collaborative wishlist" });
    }
  });

  app.post("/api/collaborative-wishlists/:wishlistId/members", isAuthenticated, async (req: any, res) => {
    try {
      const { wishlistId } = req.params;
      const { userId, role } = req.body;

      const member = await storage.addCollaborativeWishlistMember(parseInt(wishlistId), userId, role);
      res.json(member);
    } catch (error) {
      console.error("Error adding collaborative wishlist member:", error);
      res.status(500).json({ message: "Failed to add collaborative wishlist member" });
    }
  });

  app.post("/api/collaborative-wishlists/:wishlistId/items", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { wishlistId } = req.params;
      const itemData = req.body;

      const item = await storage.addCollaborativeWishlistItem(userId, parseInt(wishlistId), itemData);
      res.json(item);
    } catch (error) {
      console.error("Error adding collaborative wishlist item:", error);
      res.status(500).json({ message: "Failed to add collaborative wishlist item" });
    }
  });

  app.patch("/api/collaborative-wishlists/items/:itemId/claim", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { itemId } = req.params;

      const item = await storage.claimCollaborativeWishlistItem(parseInt(itemId), userId);
      res.json(item);
    } catch (error) {
      console.error("Error claiming collaborative wishlist item:", error);
      res.status(500).json({ message: "Failed to claim collaborative wishlist item" });
    }
  });

  app.patch("/api/collaborative-wishlists/items/:itemId/unclaim", isAuthenticated, async (req: any, res) => {
    try {
      const { itemId } = req.params;
      const item = await storage.unclaimCollaborativeWishlistItem(parseInt(itemId));
      res.json(item);
    } catch (error) {
      console.error("Error unclaiming collaborative wishlist item:", error);
      res.status(500).json({ message: "Failed to unclaim collaborative wishlist item" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
