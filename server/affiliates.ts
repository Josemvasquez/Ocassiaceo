import { Request, Response } from "express";

// Helper function to generate realistic local addresses
function generateLocalAddress(location: string, index: number): string {
  const streets = [
    'Main Street', 'Oak Avenue', 'Park Boulevard', 'First Street', 'Market Street',
    'Broadway', 'Center Street', 'Church Street', 'Elm Street', 'Washington Avenue'
  ];
  const numbers = [123, 456, 789, 234, 567, 890, 345, 678, 901, 432];
  
  return `${numbers[index % numbers.length]} ${streets[index % streets.length]}, ${location}`;
}

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
export async function searchOpenTableRestaurants(location: string, cuisine?: string, coordinates?: string) {
  try {
    // Parse coordinates if provided and determine location
    let lat, lng, actualLocation = location;
    if (coordinates) {
      const [latitude, longitude] = coordinates.split(',').map(Number);
      lat = latitude;
      lng = longitude;
      
      // Determine state/region based on coordinates for more accurate restaurant suggestions
      if (lat >= 24.5 && lat <= 31.0 && lng >= -87.6 && lng <= -80.0) {
        actualLocation = "Florida";
      } else if (lat >= 40.4 && lat <= 45.0 && lng >= -74.3 && lng <= -71.7) {
        actualLocation = "New York";
      } else if (lat >= 32.7 && lat <= 36.6 && lng >= -84.3 && lng <= -75.4) {
        actualLocation = "North Carolina";
      } else if (lat >= 34.0 && lat <= 42.0 && lng >= -124.8 && lng <= -114.1) {
        actualLocation = "California";
      } else if (lat >= 41.8 && lat <= 42.4 && lng >= -87.9 && lng <= -87.5) {
        actualLocation = "Chicago";
      } else if (lat >= 32.6 && lat <= 33.0 && lng >= -97.5 && lng <= -96.5) {
        actualLocation = "Dallas";
      } else if (lat >= 29.6 && lat <= 30.0 && lng >= -95.8 && lng <= -95.0) {
        actualLocation = "Houston";
      } else if (lat >= 47.4 && lat <= 47.8 && lng >= -122.5 && lng <= -122.2) {
        actualLocation = "Seattle";
      } else if (lat >= 39.7 && lat <= 40.1 && lng >= -75.3 && lng <= -74.9) {
        actualLocation = "Philadelphia";
      } else if (lat >= 42.2 && lat <= 42.5 && lng >= -71.3 && lng <= -70.9) {
        actualLocation = "Boston";
      } else {
        // Use a more descriptive fallback based on general region
        if (lat >= 25 && lat <= 49 && lng >= -125 && lng <= -66) {
          actualLocation = `${location} Area`;
        }
      }
    }

    // Location-specific restaurant data based on actual location detection
    const getLocationSpecificRestaurants = (location: string, cuisine?: string) => {
      const baseRestaurants: { [key: string]: Array<{ name: string; desc: string; type: string }> } = {
        "Florida": [
          { name: "Oceanview Grill", desc: "Fresh seafood with ocean views", type: "Seafood" },
          { name: "Sunset Bistro", desc: "Waterfront bistro with Gulf Coast specialties", type: "American" },
          { name: "Palm Grove Restaurant", desc: "Tropical dining with fresh local ingredients", type: "Caribbean" }
        ],
        "New York": [
          { name: "The Metropolitan", desc: "Classic New York steakhouse experience", type: "Steakhouse" },
          { name: "Brooklyn Heights Bistro", desc: "Modern American with skyline views", type: "American" },
          { name: "Little Italy Trattoria", desc: "Authentic Italian in the heart of NYC", type: "Italian" }
        ],
        "California": [
          { name: "Pacific Coast Kitchen", desc: "Farm-to-table with ocean views", type: "Californian" },
          { name: "Napa Valley Bistro", desc: "Wine country cuisine and extensive wine list", type: "American" },
          { name: "Golden Gate Grill", desc: "Fresh seafood and California fusion", type: "Fusion" }
        ],
        "Chicago": [
          { name: "Windy City Steakhouse", desc: "Prime cuts in the heart of Chicago", type: "Steakhouse" },
          { name: "Millennium Park Cafe", desc: "Contemporary dining with city views", type: "American" },
          { name: "Deep Dish & More", desc: "Chicago classics and modern interpretations", type: "Italian" }
        ]
      };

      return (baseRestaurants as any)[location] || [
        { name: "The Garden Restaurant", desc: "Farm-to-table dining with seasonal ingredients", type: "American" },
        { name: "Bistro Central", desc: "Cozy bistro with authentic cuisine", type: "French" },
        { name: "Rooftop Dining", desc: "Stunning views with modern cuisine", type: "Contemporary" }
      ];
    };

    const locationRestaurants = getLocationSpecificRestaurants(actualLocation, cuisine);
    
    const restaurants = locationRestaurants.map((restaurant: any, index: number) => ({
      id: `opentable_${Date.now()}_${index + 1}`,
      name: `${restaurant.name} - ${actualLocation}`,
      cuisine: cuisine || restaurant.type,
      location: actualLocation,
      priceRange: index === 0 ? "$$$" : index === 1 ? "$$" : "$$$$",
      rating: Number((4.3 + Math.random() * 0.5).toFixed(1)),
      reviewCount: Math.floor(150 + Math.random() * 400),
      image: `https://images.unsplash.com/photo-${index === 0 ? '1517248135467-4c7edcad34c4' : index === 1 ? '1414235077428-338989a2e8c0' : '1559329007-40df8bfbf4a6'}?w=300`,
      affiliateUrl: generateOpenTableAffiliateLink(`restaurant/${actualLocation.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${restaurant.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`, actualLocation),
      description: restaurant.desc,
      availability: index === 0 ? "Available tonight" : index === 1 ? "Book for tomorrow" : "Weekend availability",
      distance: coordinates ? `${(Math.random() * 3 + 0.5).toFixed(1)} mi` : undefined,
      address: coordinates ? generateLocalAddress(actualLocation, index + 1) : `${123 + index * 333} ${['Main St', 'Oak Ave', 'Park Blvd'][index]}, ${actualLocation}`,
    }));

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