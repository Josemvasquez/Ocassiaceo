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
  
  // Create base search parameters
  const searchParams = new URLSearchParams({
    restref: partnerId,
    covers: "2",
    dateTime: new Date().toISOString().split('T')[0] + "T19:00",
    utm_source: "remindme",
    utm_medium: "affiliate",
    utm_campaign: "restaurant_recommendations"
  });
  
  // For Florida locations, be very explicit to avoid confusion with other states
  let locationQuery;
  if (state === 'FL' || location.toLowerCase().includes('florida')) {
    // Use full state name and specific formatting for Florida locations
    locationQuery = `${city}, Florida`;
    
    // Add specific metro area identifiers for major Florida cities
    if (city === 'Saint Cloud' || city === 'St Cloud') {
      locationQuery = 'Orlando, Florida'; // Saint Cloud is part of greater Orlando area
    } else if (city === 'Kissimmee') {
      locationQuery = 'Orlando, Florida'; // Kissimmee is also part of Orlando metro
    }
  } else {
    locationQuery = location;
  }
  
  // Create the search URL with explicit location targeting
  const searchUrl = new URLSearchParams(searchParams);
  searchUrl.append('term', restaurantName);
  searchUrl.append('location', locationQuery);
  
  // Add precise coordinates for Florida locations to ensure accuracy
  if (coordinates && (state === 'FL' || location.toLowerCase().includes('florida'))) {
    searchUrl.append('latitude', coordinates.lat.toFixed(6));
    searchUrl.append('longitude', coordinates.lng.toFixed(6));
    // Add metro area identifier for better location matching
    searchUrl.append('metroId', '33'); // Orlando metro area ID
  }
  
  // Test different OpenTable URL formats for better compatibility
  // Try the main search endpoint first, then fallback to restaurant-list
  const primarySearchUrl = `${baseUrl}/s/?${searchUrl.toString()}`;
  
  // Log the generated URL for debugging
  console.log(`Generated OpenTable URL for ${restaurantName} in ${locationQuery}:`, primarySearchUrl);
  
  return primarySearchUrl;
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

// Flowers.com AI-curated flower recommendations
export async function searchFlowers(occasion?: string, recipient?: string) {
  const AFFILIATE_CONFIG = {
    flowers: {
      partnerId: "ocassia",
      baseUrl: "https://www.flowers.com"
    }
  };

  const occasions = [
    { name: "Birthday", suggestions: ["birthday", "celebration", "bright", "cheerful"] },
    { name: "Anniversary", suggestions: ["romantic", "red roses", "elegant", "love"] },
    { name: "Sympathy", suggestions: ["sympathy", "white", "peaceful", "remembrance"] },
    { name: "Congratulations", suggestions: ["congratulations", "bright", "festive", "achievement"] },
    { name: "Get Well", suggestions: ["get well", "bright", "uplifting", "healing"] },
    { name: "Thank You", suggestions: ["gratitude", "appreciation", "beautiful", "thoughtful"] },
    { name: "Just Because", suggestions: ["surprise", "beautiful", "mixed", "spontaneous"] }
  ];

  const flowerDatabase = [
    {
      name: "Premium Red Roses Bouquet",
      description: "Classic dozen red roses with premium greenery",
      price: "89.99",
      image: "red-roses-premium.jpg",
      occasions: ["Anniversary", "Birthday", "Just Because"],
      rating: 4.8,
      reviews: 1247,
      delivery: "Same Day Available"
    },
    {
      name: "Sunshine Mixed Bouquet",
      description: "Bright yellow and orange flowers to brighten any day",
      price: "64.99", 
      image: "sunshine-mixed.jpg",
      occasions: ["Birthday", "Get Well", "Congratulations"],
      rating: 4.7,
      reviews: 856,
      delivery: "Next Day"
    },
    {
      name: "Elegant White Lilies",
      description: "Pure white lilies with soft greenery",
      price: "79.99",
      image: "white-lilies.jpg", 
      occasions: ["Sympathy", "Thank You", "Just Because"],
      rating: 4.9,
      reviews: 634,
      delivery: "Same Day Available"
    },
    {
      name: "Garden Fresh Mixed",
      description: "Seasonal mix of garden-fresh flowers",
      price: "54.99",
      image: "garden-mixed.jpg",
      occasions: ["Birthday", "Thank You", "Just Because"],
      rating: 4.6,
      reviews: 923,
      delivery: "Next Day"
    },
    {
      name: "Pink Rose & Lily Combo",
      description: "Soft pink roses with white lilies",
      price: "74.99",
      image: "pink-lily-combo.jpg",
      occasions: ["Anniversary", "Birthday", "Congratulations"],
      rating: 4.8,
      reviews: 712,
      delivery: "Same Day Available"
    },
    {
      name: "Tropical Paradise Bouquet", 
      description: "Exotic tropical flowers with vibrant colors",
      price: "94.99",
      image: "tropical-paradise.jpg",
      occasions: ["Birthday", "Congratulations", "Just Because"],
      rating: 4.7,
      reviews: 445,
      delivery: "Next Day"
    }
  ];

  // Filter by occasion if specified
  let filteredFlowers = flowerDatabase;
  if (occasion) {
    const matchingOccasion = occasions.find(occ => 
      occ.name.toLowerCase().includes(occasion.toLowerCase()) ||
      occ.suggestions.some(s => s.toLowerCase().includes(occasion.toLowerCase()))
    );
    
    if (matchingOccasion) {
      filteredFlowers = flowerDatabase.filter(flower => 
        flower.occasions.includes(matchingOccasion.name)
      );
    }
  }

  // Generate affiliate links
  return filteredFlowers.map((flower, index) => {
    const flowerPath = flower.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    const affiliateLink = generateFlowersAffiliateLink(flowerPath, flower.name);
    
    return {
      id: `flowers_${Date.now()}_${index + 1}`,
      title: flower.name,
      description: flower.description,
      price: `$${flower.price}`,
      rating: flower.rating,
      reviews: `${flower.reviews} reviews`,
      image: `https://images.flowers.com/bouquets/${flower.image}`,
      partner: "Flowers.com",
      affiliate_url: affiliateLink,
      delivery: flower.delivery,
      occasions: flower.occasions,
      cta: "Send Flowers"
    };
  });
}

function generateFlowersAffiliateLink(flowerPath: string, flowerName: string): string {
  const AFFILIATE_CONFIG = {
    flowers: {
      partnerId: "ocassia",
      baseUrl: "https://www.flowers.com"
    }
  };

  const { baseUrl, partnerId } = AFFILIATE_CONFIG.flowers;
  
  const params = new URLSearchParams({
    ref: partnerId,
    utm_source: "ocassia",
    utm_medium: "affiliate", 
    utm_campaign: "flower_recommendations",
    utm_content: flowerName.replace(/\s+/g, '_').toLowerCase()
  });

  return `${baseUrl}/flowers/${flowerPath}?${params.toString()}`;
}

export async function handleFlowersSearch(req: Request, res: Response) {
  try {
    const { occasion, recipient } = req.query;
    
    const flowers = await searchFlowers(
      occasion as string,
      recipient as string
    );
    res.json(flowers);
  } catch (error) {
    console.error("Flowers search error:", error);
    res.status(500).json({ error: "Failed to search flower recommendations" });
  }
}

// Best Buy electronics and tech gift recommendations
export async function searchBestBuy(category?: string, priceRange?: string) {
  const AFFILIATE_CONFIG = {
    bestbuy: {
      partnerId: "ocassia",
      baseUrl: "https://www.bestbuy.com"
    }
  };

  const productDatabase = [
    {
      name: "Apple AirPods Pro (2nd Gen)",
      description: "Active Noise Cancellation, Transparency Mode, Personalized Spatial Audio",
      price: "249.99",
      originalPrice: "279.99",
      image: "airpods-pro-2nd-gen.jpg",
      category: "Audio",
      rating: 4.8,
      reviews: 12847,
      sku: "6418599"
    },
    {
      name: "iPad (10th Generation)",
      description: "10.9-inch Liquid Retina Display, A14 Bionic chip, Touch ID",
      price: "349.99",
      originalPrice: "449.99", 
      image: "ipad-10th-gen.jpg",
      category: "Tablets",
      rating: 4.7,
      reviews: 8934,
      sku: "6418298"
    },
    {
      name: "Sony WH-1000XM5 Headphones",
      description: "Industry Leading Noise Canceling Bluetooth Headphones",
      price: "329.99",
      originalPrice: "399.99",
      image: "sony-wh1000xm5.jpg",
      category: "Audio",
      rating: 4.9,
      reviews: 5672,
      sku: "6505727"
    },
    {
      name: "Nintendo Switch OLED Model",
      description: "7-inch OLED screen, enhanced audio, 64GB internal storage",
      price: "349.99",
      originalPrice: "349.99",
      image: "nintendo-switch-oled.jpg",
      category: "Gaming",
      rating: 4.8,
      reviews: 9823,
      sku: "6464255"
    },
    {
      name: "Apple Watch Series 9",
      description: "GPS + Cellular, Always-On Retina Display, Health & Fitness tracking",
      price: "429.99",
      originalPrice: "499.99",
      image: "apple-watch-series9.jpg",
      category: "Wearables",
      rating: 4.7,
      reviews: 6734,
      sku: "6574567"
    },
    {
      name: "Samsung 65\" 4K Smart TV",
      description: "Crystal UHD, HDR, Smart TV with Alexa Built-in",
      price: "597.99",
      originalPrice: "749.99",
      image: "samsung-65-4k-tv.jpg",
      category: "TVs",
      rating: 4.6,
      reviews: 4532,
      sku: "6501737"
    }
  ];

  // Filter by category if specified
  let filteredProducts = productDatabase;
  if (category) {
    filteredProducts = productDatabase.filter(product => 
      product.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  // Filter by price range if specified
  if (priceRange) {
    const ranges = {
      "under-100": [0, 100],
      "100-300": [100, 300],
      "300-500": [300, 500],
      "over-500": [500, 9999]
    };
    
    const range = ranges[priceRange as keyof typeof ranges];
    if (range) {
      filteredProducts = filteredProducts.filter(product => {
        const price = parseFloat(product.price);
        return price >= range[0] && price <= range[1];
      });
    }
  }

  return filteredProducts.map((product, index) => {
    const productPath = product.sku;
    const affiliateLink = generateBestBuyAffiliateLink(productPath, product.name);
    
    return {
      id: `bestbuy_${Date.now()}_${index + 1}`,
      title: product.name,
      description: product.description,
      price: `$${product.price}`,
      originalPrice: product.originalPrice !== product.price ? `$${product.originalPrice}` : null,
      rating: product.rating,
      reviews: `${product.reviews.toLocaleString()} reviews`,
      image: `https://pisces.bbystatic.com/image2/BestBuy_US/images/products/${product.sku}/${product.image}`,
      partner: "Best Buy",
      affiliate_url: affiliateLink,
      category: product.category,
      cta: "Shop Now"
    };
  });
}

function generateBestBuyAffiliateLink(sku: string, productName: string): string {
  const AFFILIATE_CONFIG = {
    bestbuy: {
      partnerId: "ocassia",
      baseUrl: "https://www.bestbuy.com"
    }
  };

  const { baseUrl, partnerId } = AFFILIATE_CONFIG.bestbuy;
  
  const params = new URLSearchParams({
    ref: partnerId,
    utm_source: "ocassia",
    utm_medium: "affiliate",
    utm_campaign: "tech_recommendations",
    utm_content: productName.replace(/\s+/g, '_').toLowerCase()
  });

  return `${baseUrl}/site/searchpage.jsp?st=${encodeURIComponent(productName)}&${params.toString()}`;
}

// Target home goods and lifestyle recommendations  
export async function searchTarget(category?: string, department?: string) {
  const AFFILIATE_CONFIG = {
    target: {
      partnerId: "ocassia",
      baseUrl: "https://www.target.com"
    }
  };

  const productDatabase = [
    {
      name: "Threshold™ Cozy Throw Blanket",
      description: "Ultra-soft fleece throw blanket perfect for any room",
      price: "24.99",
      originalPrice: "34.99",
      image: "threshold-throw-blanket.jpg",
      category: "Home",
      department: "Home Decor",
      rating: 4.6,
      reviews: 3247,
      tcin: "54321098"
    },
    {
      name: "Opalhouse™ Ceramic Vase Set",
      description: "Set of 3 decorative ceramic vases in neutral tones",
      price: "39.99",
      originalPrice: "49.99",
      image: "opalhouse-vase-set.jpg",
      category: "Home",
      department: "Home Decor",
      rating: 4.7,
      reviews: 1892,
      tcin: "87654321"
    },
    {
      name: "Good & Gather™ Gift Basket",
      description: "Gourmet snack and coffee gift basket",
      price: "34.99",
      originalPrice: "44.99",
      image: "good-gather-gift-basket.jpg",
      category: "Food",
      department: "Grocery",
      rating: 4.5,
      reviews: 967,
      tcin: "23456789"
    },
    {
      name: "Universal Thread™ Oversized Sweater",
      description: "Cozy oversized pullover sweater in multiple colors",
      price: "29.99",
      originalPrice: "39.99",
      image: "universal-thread-sweater.jpg",
      category: "Clothing",
      department: "Women's",
      rating: 4.4,
      reviews: 2834,
      tcin: "98765432"
    },
    {
      name: "Project 62™ Picture Frame Set",
      description: "Set of 5 modern picture frames in various sizes",
      price: "19.99",
      originalPrice: "29.99",
      image: "project62-frame-set.jpg",
      category: "Home",
      department: "Home Decor",
      rating: 4.6,
      reviews: 1534,
      tcin: "56789012"
    },
    {
      name: "Brightroom™ Storage Basket",
      description: "Woven storage basket with handles, perfect for organization",
      price: "16.99",
      originalPrice: "24.99",
      image: "brightroom-storage-basket.jpg",
      category: "Home",
      department: "Storage & Organization",
      rating: 4.7,
      reviews: 2156,
      tcin: "34567890"
    }
  ];

  // Filter by category or department if specified
  let filteredProducts = productDatabase;
  if (category) {
    filteredProducts = filteredProducts.filter(product => 
      product.category.toLowerCase().includes(category.toLowerCase())
    );
  }
  if (department) {
    filteredProducts = filteredProducts.filter(product => 
      product.department.toLowerCase().includes(department.toLowerCase())
    );
  }

  return filteredProducts.map((product, index) => {
    const productPath = product.tcin;
    const affiliateLink = generateTargetAffiliateLink(productPath, product.name);
    
    return {
      id: `target_${Date.now()}_${index + 1}`,
      title: product.name,
      description: product.description,
      price: `$${product.price}`,
      originalPrice: product.originalPrice !== product.price ? `$${product.originalPrice}` : null,
      rating: product.rating,
      reviews: `${product.reviews.toLocaleString()} reviews`,
      image: `https://target.scene7.com/is/image/Target/${product.image}`,
      partner: "Target",
      affiliate_url: affiliateLink,
      category: product.category,
      department: product.department,
      cta: "Shop Target"
    };
  });
}

function generateTargetAffiliateLink(tcin: string, productName: string): string {
  const AFFILIATE_CONFIG = {
    target: {
      partnerId: "ocassia",
      baseUrl: "https://www.target.com"
    }
  };

  const { baseUrl, partnerId } = AFFILIATE_CONFIG.target;
  
  const params = new URLSearchParams({
    ref: partnerId,
    utm_source: "ocassia",
    utm_medium: "affiliate",
    utm_campaign: "lifestyle_recommendations",
    utm_content: productName.replace(/\s+/g, '_').toLowerCase()
  });

  return `${baseUrl}/s?searchTerm=${encodeURIComponent(productName)}&${params.toString()}`;
}

export async function handleBestBuySearch(req: Request, res: Response) {
  try {
    const { category, priceRange } = req.query;
    
    const products = await searchBestBuy(
      category as string,
      priceRange as string
    );
    res.json(products);
  } catch (error) {
    console.error("Best Buy search error:", error);
    res.status(500).json({ error: "Failed to search Best Buy products" });
  }
}

export async function handleTargetSearch(req: Request, res: Response) {
  try {
    const { category, department } = req.query;
    
    const products = await searchTarget(
      category as string,
      department as string
    );
    res.json(products);
  } catch (error) {
    console.error("Target search error:", error);
    res.status(500).json({ error: "Failed to search Target products" });
  }
}