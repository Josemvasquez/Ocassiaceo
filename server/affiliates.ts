import { Request, Response } from "express";

// Affiliate configuration
const AFFILIATE_CONFIG = {
  amazon: {
    associateId: process.env.AMAZON_ASSOCIATE_ID || "remindme-20",
    baseUrl: "https://www.amazon.com",
    searchUrl: "https://www.amazon.com/s",
  },
  opentable: {
    partnerId: process.env.OPENTABLE_PARTNER_ID || "remindme",
    baseUrl: "https://www.opentable.com",
    searchUrl: "https://www.opentable.com/s",
  },
  expedia: {
    partnerId: process.env.EXPEDIA_PARTNER_ID || "remindme",
    baseUrl: "https://www.expedia.com",
    searchUrl: "https://www.expedia.com/Hotel-Search",
  },
};

// Amazon Product Search API (using Amazon Product Advertising API 5.0 structure)
export async function searchAmazonProducts(query: string, category?: string) {
  // For production, you would use the actual Amazon Product Advertising API
  // This requires AWS credentials and proper API setup
  
  try {
    // Mock response structure based on real Amazon API
    const products = [
      {
        id: `amazon_${Date.now()}_1`,
        title: `Premium Wireless Headphones - ${query}`,
        price: "$199.99",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300",
        rating: 4.5,
        reviewCount: 1243,
        affiliateUrl: generateAmazonAffiliateLink(`/dp/B08N5WRWNW`, query),
        description: "High-quality wireless headphones with noise cancellation",
        category: category || "Electronics",
        isPrime: true,
      },
      {
        id: `amazon_${Date.now()}_2`,
        title: `Smart Watch Collection - ${query}`,
        price: "$299.99",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300",
        rating: 4.3,
        reviewCount: 856,
        affiliateUrl: generateAmazonAffiliateLink(`/dp/B07XJ8C8F5`, query),
        description: "Advanced smartwatch with health monitoring",
        category: category || "Electronics",
        isPrime: true,
      },
      {
        id: `amazon_${Date.now()}_3`,
        title: `${query} Gift Set`,
        price: "$49.99",
        image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300",
        rating: 4.7,
        reviewCount: 432,
        affiliateUrl: generateAmazonAffiliateLink(`/dp/B09JFHG3K2`, query),
        description: "Perfect gift set for any occasion",
        category: category || "Gifts",
        isPrime: false,
      },
    ];

    return products;
  } catch (error) {
    console.error("Amazon API error:", error);
    throw new Error("Failed to fetch Amazon products");
  }
}

// OpenTable Restaurant Search
export async function searchOpenTableRestaurants(location: string, cuisine?: string) {
  try {
    // Mock response structure based on real OpenTable API
    const restaurants = [
      {
        id: `opentable_${Date.now()}_1`,
        name: `The Garden Restaurant - ${location}`,
        cuisine: cuisine || "American",
        location: location,
        priceRange: "$$$",
        rating: 4.6,
        reviewCount: 234,
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300",
        affiliateUrl: generateOpenTableAffiliateLink(`restaurant/${location.toLowerCase()}-garden`, location),
        description: "Farm-to-table dining with seasonal ingredients",
        availability: "Available tonight",
      },
      {
        id: `opentable_${Date.now()}_2`,
        name: `Bistro Central - ${location}`,
        cuisine: cuisine || "French",
        location: location,
        priceRange: "$$",
        rating: 4.4,
        reviewCount: 456,
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300",
        affiliateUrl: generateOpenTableAffiliateLink(`restaurant/${location.toLowerCase()}-bistro`, location),
        description: "Cozy French bistro with authentic cuisine",
        availability: "Book for tomorrow",
      },
      {
        id: `opentable_${Date.now()}_3`,
        name: `Rooftop Dining - ${location}`,
        cuisine: cuisine || "Contemporary",
        location: location,
        priceRange: "$$$$",
        rating: 4.8,
        reviewCount: 189,
        image: "https://images.unsplash.com/photo-1559329007-40df8bfbf4a6?w=300",
        affiliateUrl: generateOpenTableAffiliateLink(`restaurant/${location.toLowerCase()}-rooftop`, location),
        description: "Stunning city views with modern cuisine",
        availability: "Weekend availability",
      },
    ];

    return restaurants;
  } catch (error) {
    console.error("OpenTable API error:", error);
    throw new Error("Failed to fetch OpenTable restaurants");
  }
}

// Expedia Travel Search
export async function searchExpediaTravel(destination: string, type: "hotels" | "flights" | "packages" = "hotels") {
  try {
    // Mock response structure based on real Expedia API
    const travelOptions = [
      {
        id: `expedia_${Date.now()}_1`,
        name: `Lake View Resort - ${destination}`,
        type: "hotel",
        location: destination,
        price: "$189/night",
        rating: 4.5,
        reviewCount: 678,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300",
        affiliateUrl: generateExpediaAffiliateLink(`hotel/${destination.toLowerCase()}-lake-view`, destination),
        description: "Luxury resort with lake views and spa",
        amenities: ["Pool", "Spa", "WiFi", "Restaurant"],
      },
      {
        id: `expedia_${Date.now()}_2`,
        name: `City Center Hotel - ${destination}`,
        type: "hotel",
        location: destination,
        price: "$129/night",
        rating: 4.2,
        reviewCount: 345,
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300",
        affiliateUrl: generateExpediaAffiliateLink(`hotel/${destination.toLowerCase()}-city-center`, destination),
        description: "Modern hotel in the heart of the city",
        amenities: ["WiFi", "Gym", "Business Center"],
      },
      {
        id: `expedia_${Date.now()}_3`,
        name: `Vacation Package - ${destination}`,
        type: "package",
        location: destination,
        price: "$899/person",
        rating: 4.7,
        reviewCount: 123,
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300",
        affiliateUrl: generateExpediaAffiliateLink(`package/${destination.toLowerCase()}-vacation`, destination),
        description: "Complete vacation package with flights and hotel",
        amenities: ["Flight included", "Hotel", "Tours", "Meals"],
      },
    ];

    return travelOptions;
  } catch (error) {
    console.error("Expedia API error:", error);
    throw new Error("Failed to fetch Expedia travel options");
  }
}

// Generate Amazon affiliate links
function generateAmazonAffiliateLink(productPath: string, searchTerm: string): string {
  const baseUrl = AFFILIATE_CONFIG.amazon.baseUrl;
  const associateId = AFFILIATE_CONFIG.amazon.associateId;
  
  // Add affiliate parameters
  const params = new URLSearchParams({
    tag: associateId,
    linkCode: "as2",
    camp: "1789",
    creative: "9325",
    creativeASIN: productPath.split("/").pop() || "",
  });

  return `${baseUrl}${productPath}?${params.toString()}`;
}

// Generate OpenTable affiliate links
function generateOpenTableAffiliateLink(restaurantPath: string, location: string): string {
  const baseUrl = AFFILIATE_CONFIG.opentable.baseUrl;
  const partnerId = AFFILIATE_CONFIG.opentable.partnerId;
  
  const params = new URLSearchParams({
    ref: partnerId,
    utm_source: "remindme",
    utm_medium: "affiliate",
    utm_campaign: "gift_recommendations",
  });

  return `${baseUrl}/${restaurantPath}?${params.toString()}`;
}

// Generate Expedia affiliate links
function generateExpediaAffiliateLink(travelPath: string, destination: string): string {
  const baseUrl = AFFILIATE_CONFIG.expedia.baseUrl;
  const partnerId = AFFILIATE_CONFIG.expedia.partnerId;
  
  const params = new URLSearchParams({
    SEMCID: partnerId,
    utm_source: "remindme",
    utm_medium: "affiliate",
    utm_campaign: "travel_recommendations",
  });

  return `${baseUrl}/${travelPath}?${params.toString()}`;
}

// API endpoint handlers
export async function handleAmazonSearch(req: Request, res: Response) {
  try {
    const { query, category } = req.query;
    
    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const products = await searchAmazonProducts(query, category as string);
    res.json(products);
  } catch (error) {
    console.error("Amazon search error:", error);
    res.status(500).json({ error: "Failed to search Amazon products" });
  }
}

export async function handleOpenTableSearch(req: Request, res: Response) {
  try {
    const { location, cuisine } = req.query;
    
    if (!location || typeof location !== "string") {
      return res.status(400).json({ error: "Location parameter is required" });
    }

    const restaurants = await searchOpenTableRestaurants(location, cuisine as string);
    res.json(restaurants);
  } catch (error) {
    console.error("OpenTable search error:", error);
    res.status(500).json({ error: "Failed to search OpenTable restaurants" });
  }
}

export async function handleExpediaSearch(req: Request, res: Response) {
  try {
    const { destination, type } = req.query;
    
    if (!destination || typeof destination !== "string") {
      return res.status(400).json({ error: "Destination parameter is required" });
    }

    const travelOptions = await searchExpediaTravel(
      destination, 
      type as "hotels" | "flights" | "packages"
    );
    res.json(travelOptions);
  } catch (error) {
    console.error("Expedia search error:", error);
    res.status(500).json({ error: "Failed to search Expedia travel options" });
  }
}