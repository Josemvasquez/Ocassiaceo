import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertContactSchema, insertSpecialDateSchema, insertWishlistItemSchema } from "@shared/schema";
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

  // Mock recommendation endpoints
  app.get('/api/recommendations/gifts', isAuthenticated, async (req: any, res) => {
    // Mock gift recommendations
    const mockGifts = [
      {
        id: 1,
        name: "Premium Wireless Headphones",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        description: "Perfect for music lovers",
        affiliateUrl: "https://example.com/affiliate/headphones",
        category: "Electronics"
      },
      {
        id: 2,
        name: "Artisan Coffee Collection",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        description: "Premium beans from around the world",
        affiliateUrl: "https://example.com/affiliate/coffee",
        category: "Food & Beverage"
      }
    ];
    res.json(mockGifts);
  });

  app.get('/api/recommendations/restaurants', isAuthenticated, async (req: any, res) => {
    // Mock restaurant recommendations
    const mockRestaurants = [
      {
        id: 1,
        name: "The Garden Bistro",
        rating: 4.8,
        reviews: 324,
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        description: "Romantic Italian cuisine downtown",
        cuisine: "Italian",
        priceRange: "$$$",
        openTableUrl: "https://example.com/opentable/garden-bistro"
      }
    ];
    res.json(mockRestaurants);
  });

  app.get('/api/recommendations/travel', isAuthenticated, async (req: any, res) => {
    // Mock travel recommendations
    const mockTravel = [
      {
        id: 1,
        name: "Lake View Cabin",
        price: 299,
        image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        description: "Perfect anniversary escape",
        location: "Mountain Lakes, CA",
        type: "Weekend Getaway",
        expediaUrl: "https://example.com/expedia/lake-cabin"
      }
    ];
    res.json(mockTravel);
  });

  const httpServer = createServer(app);
  return httpServer;
}
