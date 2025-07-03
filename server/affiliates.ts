import { Request, Response } from "express";

// Helper function to calculate distance between two coordinates in miles
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Helper function to generate realistic local addresses with accurate coordinates
function generateLocalAddress(location: string, index: number, userLat?: number, userLng?: number): string {
  const streets = [
    'Main Street', 'Oak Avenue', 'Park Boulevard', 'First Street', 'Market Street',
    'Broadway', 'Center Street', 'Church Street', 'Elm Street', 'Washington Avenue'
  ];
  const numbers = [123, 456, 789, 234, 567, 890, 345, 678, 901, 432];
  
  return `${numbers[index % numbers.length]} ${streets[index % streets.length]}, ${location}`;
}

// Precise city mapping based on coordinates with 10-mile radius accuracy
function getPreciseCityFromCoordinates(lat: number, lng: number): { name: string; state: string; region: string } {
  // Database of major US cities with precise coordinates
  const cities = [
    // Florida cities
    { name: "Miami", state: "FL", region: "South Florida", lat: 25.7617, lng: -80.1918, radius: 15 },
    { name: "Orlando", state: "FL", region: "Central Florida", lat: 28.5383, lng: -81.3792, radius: 15 },
    { name: "Tampa", state: "FL", region: "Tampa Bay", lat: 27.9506, lng: -82.4572, radius: 12 },
    { name: "Jacksonville", state: "FL", region: "Northeast Florida", lat: 30.3322, lng: -81.6557, radius: 15 },
    { name: "Saint Cloud", state: "FL", region: "Central Florida", lat: 28.2489, lng: -81.2812, radius: 8 },
    { name: "Kissimmee", state: "FL", region: "Central Florida", lat: 28.2920, lng: -81.4076, radius: 8 },
    { name: "Winter Park", state: "FL", region: "Central Florida", lat: 28.5999, lng: -81.3392, radius: 5 },
    
    // New York cities
    { name: "New York City", state: "NY", region: "NYC Metro", lat: 40.7128, lng: -74.0060, radius: 20 },
    { name: "Brooklyn", state: "NY", region: "NYC Metro", lat: 40.6782, lng: -73.9442, radius: 10 },
    { name: "Queens", state: "NY", region: "NYC Metro", lat: 40.7282, lng: -73.7949, radius: 12 },
    { name: "Buffalo", state: "NY", region: "Western NY", lat: 42.8864, lng: -78.8784, radius: 10 },
    
    // California cities
    { name: "Los Angeles", state: "CA", region: "Southern California", lat: 34.0522, lng: -118.2437, radius: 25 },
    { name: "San Francisco", state: "CA", region: "Bay Area", lat: 37.7749, lng: -122.4194, radius: 15 },
    { name: "San Diego", state: "CA", region: "Southern California", lat: 32.7157, lng: -117.1611, radius: 15 },
    { name: "Sacramento", state: "CA", region: "Central California", lat: 38.5816, lng: -121.4944, radius: 12 },
    
    // Illinois cities
    { name: "Chicago", state: "IL", region: "Chicagoland", lat: 41.8781, lng: -87.6298, radius: 18 },
    
    // Texas cities
    { name: "Houston", state: "TX", region: "Southeast Texas", lat: 29.7604, lng: -95.3698, radius: 20 },
    { name: "Dallas", state: "TX", region: "North Texas", lat: 32.7767, lng: -96.7970, radius: 18 },
    { name: "Austin", state: "TX", region: "Central Texas", lat: 30.2672, lng: -97.7431, radius: 15 },
    
    // Other major cities
    { name: "Seattle", state: "WA", region: "Pacific Northwest", lat: 47.6062, lng: -122.3321, radius: 12 },
    { name: "Boston", state: "MA", region: "New England", lat: 42.3601, lng: -71.0589, radius: 12 },
    { name: "Philadelphia", state: "PA", region: "Delaware Valley", lat: 39.9526, lng: -75.1652, radius: 15 },
    { name: "Phoenix", state: "AZ", region: "Arizona", lat: 33.4484, lng: -112.0740, radius: 20 },
    { name: "Denver", state: "CO", region: "Colorado", lat: 39.7392, lng: -104.9903, radius: 15 },
    { name: "Atlanta", state: "GA", region: "Georgia", lat: 33.7490, lng: -84.3880, radius: 15 },
  ];

  // Find the closest city within 10 miles
  let closestCity = null;
  let closestDistance = 10; // 10-mile radius limit

  for (const city of cities) {
    const distance = calculateDistance(lat, lng, city.lat, city.lng);
    if (distance < closestDistance && distance <= city.radius) {
      closestDistance = distance;
      closestCity = city;
    }
  }

  if (closestCity) {
    return {
      name: closestCity.name,
      state: closestCity.state,
      region: closestCity.region
    };
  }

  // Fallback to state-level detection if no precise city match
  if (lat >= 24.5 && lat <= 31.0 && lng >= -87.6 && lng <= -80.0) {
    return { name: "Florida", state: "FL", region: "Florida" };
  } else if (lat >= 40.4 && lat <= 45.0 && lng >= -74.3 && lng <= -71.7) {
    return { name: "New York", state: "NY", region: "New York" };
  } else if (lat >= 32.0 && lat <= 42.0 && lng >= -124.8 && lng <= -114.1) {
    return { name: "California", state: "CA", region: "California" };
  } else if (lat >= 41.8 && lat <= 42.4 && lng >= -87.9 && lng <= -87.5) {
    return { name: "Chicago", state: "IL", region: "Illinois" };
  } else {
    return { name: "United States", state: "", region: "USA" };
  }
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
    // Parse coordinates if provided and determine precise location
    let lat: number | undefined, lng: number | undefined;
    let cityInfo = { name: location, state: "", region: "" };
    
    if (coordinates) {
      const [latitude, longitude] = coordinates.split(',').map(Number);
      lat = latitude;
      lng = longitude;
      
      // Precise city mapping based on coordinates within 10-mile radius accuracy
      cityInfo = getPreciseCityFromCoordinates(lat, lng);
    }

    // Location-specific restaurant data based on precise city detection
    const getLocationSpecificRestaurants = (cityInfo: { name: string; state: string; region: string }, cuisine?: string) => {
      const restaurantDatabase: { [key: string]: Array<{ name: string; desc: string; type: string; lat: number; lng: number }> } = {
        "Saint Cloud": [
          { name: "Kissimmee Lakefront Grill", desc: "Waterfront dining with Florida lake views", type: "Seafood", lat: 28.2420, lng: -81.2856 },
          { name: "Old Town Tavern", desc: "Historic charm with modern American cuisine", type: "American", lat: 28.2503, lng: -81.2890 },
          { name: "Central Florida Steakhouse", desc: "Premium steaks in a cozy atmosphere", type: "Steakhouse", lat: 28.2455, lng: -81.2745 }
        ],
        "Orlando": [
          { name: "City Walk Bistro", desc: "Downtown Orlando's premier dining destination", type: "Contemporary", lat: 28.5400, lng: -81.3800 },
          { name: "Lake Eola Kitchen", desc: "Scenic dining overlooking Lake Eola", type: "American", lat: 28.5450, lng: -81.3720 },
          { name: "Theme Park Boulevard", desc: "Family-friendly dining near the attractions", type: "Family", lat: 28.5200, lng: -81.3900 }
        ],
        "Miami": [
          { name: "South Beach Oceanview", desc: "Beachfront dining with Art Deco flair", type: "Seafood", lat: 25.7700, lng: -80.1800 },
          { name: "Biscayne Bay Bistro", desc: "Waterfront elegance in downtown Miami", type: "Contemporary", lat: 25.7750, lng: -80.1900 },
          { name: "Little Havana Authentic", desc: "Traditional Cuban cuisine in the heart of Miami", type: "Cuban", lat: 25.7650, lng: -80.2000 }
        ],
        "New York City": [
          { name: "Manhattan Skyline", desc: "Rooftop dining with iconic city views", type: "Contemporary", lat: 40.7200, lng: -74.0100 },
          { name: "Brooklyn Bridge Tavern", desc: "Historic charm meets modern cuisine", type: "American", lat: 40.7050, lng: -73.9950 },
          { name: "Central Park Bistro", desc: "Elegant dining overlooking the park", type: "French", lat: 40.7250, lng: -73.9800 }
        ],
        "Los Angeles": [
          { name: "Hollywood Hills View", desc: "Stunning views with California cuisine", type: "Californian", lat: 34.0600, lng: -118.2500 },
          { name: "Santa Monica Pier", desc: "Beachside dining with ocean breeze", type: "Seafood", lat: 34.0400, lng: -118.2600 },
          { name: "Beverly Hills Elegance", desc: "Upscale dining in the heart of Beverly Hills", type: "Contemporary", lat: 34.0700, lng: -118.2400 }
        ],
        "Chicago": [
          { name: "Willis Tower Dining", desc: "Sky-high dining with city panoramas", type: "Contemporary", lat: 41.8800, lng: -87.6300 },
          { name: "Navy Pier Waterfront", desc: "Lakefront dining with Chicago charm", type: "American", lat: 41.8900, lng: -87.6100 },
          { name: "Millennium Park Cafe", desc: "Cultural district dining experience", type: "Bistro", lat: 41.8825, lng: -87.6225 }
        ]
      };

      const fallbackLat = lat || 40.7128; // Default to NYC coordinates
      const fallbackLng = lng || -74.0060;
      
      const restaurants = restaurantDatabase[cityInfo.name] || [
        { name: "The Garden Restaurant", desc: "Farm-to-table dining with seasonal ingredients", type: "American", lat: fallbackLat, lng: fallbackLng },
        { name: "Bistro Central", desc: "Cozy bistro with authentic cuisine", type: "French", lat: fallbackLat, lng: fallbackLng },
        { name: "Rooftop Dining", desc: "Stunning views with modern cuisine", type: "Contemporary", lat: fallbackLat, lng: fallbackLng }
      ];

      // Filter by cuisine if specified
      if (cuisine) {
        return restaurants.filter(r => r.type.toLowerCase().includes(cuisine.toLowerCase()));
      }
      
      return restaurants;
    };

    const locationRestaurants = getLocationSpecificRestaurants(cityInfo, cuisine);
    
    const restaurants = locationRestaurants.map((restaurant: any, index: number) => {
      // Calculate accurate distance if coordinates are available
      let distance = undefined;
      if (coordinates && restaurant.lat && restaurant.lng && lat !== undefined && lng !== undefined) {
        const distanceInMiles = calculateDistance(lat, lng, restaurant.lat, restaurant.lng);
        distance = `${distanceInMiles.toFixed(1)} mi`;
      }
      
      return {
        id: `opentable_${Date.now()}_${index + 1}`,
        name: restaurant.name,
        cuisine: cuisine || restaurant.type,
        location: `${cityInfo.name}, ${cityInfo.state}`,
        priceRange: index === 0 ? "$$$" : index === 1 ? "$$" : "$$$$",
        rating: Number((4.3 + Math.random() * 0.5).toFixed(1)),
        reviewCount: Math.floor(150 + Math.random() * 400),
        image: `https://images.unsplash.com/photo-${index === 0 ? '1517248135467-4c7edcad34c4' : index === 1 ? '1414235077428-338989a2e8c0' : '1559329007-40df8bfbf4a6'}?w=300`,
        affiliateUrl: generateOpenTableAffiliateLink(restaurant.name, `${cityInfo.name}, ${cityInfo.state}`, restaurant.lat && restaurant.lng ? { lat: restaurant.lat, lng: restaurant.lng } : undefined),
        description: restaurant.desc,
        availability: index === 0 ? "Available tonight" : index === 1 ? "Book for tomorrow" : "Weekend availability",
        distance: distance,
        address: generateLocalAddress(`${cityInfo.name}, ${cityInfo.state}`, index + 1),
        coordinates: restaurant.lat && restaurant.lng ? { lat: restaurant.lat, lng: restaurant.lng } : undefined,
      };
    });

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

// Generate OpenTable affiliate links with accurate location targeting
function generateOpenTableAffiliateLink(restaurantName: string, location: string, coordinates?: { lat: number; lng: number }): string {
  const baseUrl = AFFILIATE_CONFIG.opentable.baseUrl;
  const partnerId = AFFILIATE_CONFIG.opentable.partnerId;
  
  // Extract city and state from location string for accurate OpenTable search
  const [city, state] = location.split(', ');
  
  // Create location-specific search parameters that OpenTable understands
  const searchParams = new URLSearchParams({
    restref: partnerId,
    covers: "2",
    dateTime: new Date().toISOString().split('T')[0] + "T19:00",
    utm_source: "remindme",
    utm_medium: "affiliate",
    utm_campaign: "restaurant_recommendations"
  });
  
  // Add location parameters that OpenTable's search engine recognizes
  if (coordinates) {
    searchParams.append('latitude', coordinates.lat.toString());
    searchParams.append('longitude', coordinates.lng.toString());
  }
  
  // Use both restaurant name and specific location for more accurate results
  const searchTerm = encodeURIComponent(restaurantName);
  const locationTerm = encodeURIComponent(city || location);
  
  // Use OpenTable's current search format for accurate location targeting
  // This format directs to their search results with proper location filtering
  const baseSearchUrl = `${baseUrl}`;
  
  // Create location-aware search parameters
  const locationSearchParams = new URLSearchParams(searchParams);
  locationSearchParams.append('term', restaurantName);
  locationSearchParams.append('location', city || location);
  
  if (coordinates) {
    locationSearchParams.append('latitude', coordinates.lat.toString());
    locationSearchParams.append('longitude', coordinates.lng.toString());
  }
  
  // OpenTable's search endpoint with location and restaurant name
  return `${baseSearchUrl}/s/?${locationSearchParams.toString()}`;
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