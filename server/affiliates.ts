import express, { Request, Response } from "express";

const AFFILIATE_CONFIG = {
  amazon: {
    associateId: "ocassia-20",
    baseUrl: "https://www.amazon.com"
  },
  opentable: {
    partnerId: "remindme",
    baseUrl: "https://www.opentable.com"
  },
  expedia: {
    partnerId: "ocassia",
    baseUrl: "https://www.expedia.com"
  }
};

// Distance calculation helper
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

// City coordinates for precise restaurant recommendations
function getPreciseCityFromCoordinates(lat: number, lng: number): { name: string; state: string; region: string } {
  if (lat >= 25.0 && lat <= 31.0 && lng >= -87.6 && lng <= -80.0) {
    return { name: "Orlando", state: "Florida", region: "Southeast" };
  } else if (lat >= 40.4 && lat <= 45.0 && lng >= -74.3 && lng <= -71.7) {
    return { name: "New York", state: "New York", region: "Northeast" };
  } else if (lat >= 32.0 && lat <= 42.0 && lng >= -124.8 && lng <= -114.1) {
    return { name: "Los Angeles", state: "California", region: "West Coast" };
  } else if (lat >= 41.8 && lat <= 42.4 && lng >= -87.9 && lng <= -87.5) {
    return { name: "Chicago", state: "Illinois", region: "Midwest" };
  } else {
    return { name: "Orlando", state: "Florida", region: "Southeast" }; // Default
  }
}

// Amazon product search with makeup products
export async function searchAmazonProducts(query: string, category?: string) {
  try {
    const queryLower = query.toLowerCase();
    let products = [];

    if (queryLower.includes('makeup') || queryLower.includes('make up') || queryLower.includes('cosmetic') || queryLower.includes('beauty')) {
      products = [
        {
          id: `amazon_${Date.now()}_1`,
          title: "ELF Pure Skin Super Serum Starter Kit",
          price: "$18.00",
          image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300",
          rating: 4.5,
          reviewCount: 1247,
          affiliateUrl: generateAmazonAffiliateLink(`/dp/B08ELF12345`, query),
          description: "Teen-friendly skincare starter set with gentle serums and moisturizers",
          category: "Beauty & Personal Care",
          isPrime: true,
        },
        {
          id: `amazon_${Date.now()}_2`,
          title: "Milani Color Statement Lipstick Set",
          price: "$24.99",
          image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300",
          rating: 4.4,
          reviewCount: 856,
          affiliateUrl: generateAmazonAffiliateLink(`/dp/B07MILANI456`, query),
          description: "Vibrant lip colors perfect for teens, long-lasting formula",
          category: "Beauty & Personal Care",
          isPrime: true,
        },
        {
          id: `amazon_${Date.now()}_3`,
          title: "Real Techniques Makeup Brush Set",
          price: "$12.99",
          image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300",
          rating: 4.7,
          reviewCount: 2134,
          affiliateUrl: generateAmazonAffiliateLink(`/dp/B08REALTECH`, query),
          description: "Professional makeup brushes for flawless application",
          category: "Beauty & Personal Care",
          isPrime: true,
        },
        {
          id: `amazon_${Date.now()}_4`,
          title: "NYX Professional Makeup Ultimate Shadow Palette",
          price: "$16.00",
          image: "https://images.unsplash.com/photo-1515688594390-b649af70d282?w=300",
          rating: 4.6,
          reviewCount: 1678,
          affiliateUrl: generateAmazonAffiliateLink(`/dp/B08NYX78912`, query),
          description: "16 versatile eyeshadow shades for creative looks",
          category: "Beauty & Personal Care",
          isPrime: true,
        },
        {
          id: `amazon_${Date.now()}_5`,
          title: "CeraVe Foaming Facial Cleanser for Teens",
          price: "$8.97",
          image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300",
          rating: 4.8,
          reviewCount: 3245,
          affiliateUrl: generateAmazonAffiliateLink(`/dp/B08CERAVE34`, query),
          description: "Gentle daily cleanser designed for young skin",
          category: "Beauty & Personal Care",
          isPrime: true,
        }
      ];
    } else {
      // Default generic products for other searches
      products = [
        {
          id: `amazon_${Date.now()}_1`,
          title: `Premium ${query} Collection`,
          price: "$89.99",
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300",
          rating: 4.5,
          reviewCount: 1234,
          affiliateUrl: generateAmazonAffiliateLink(`/dp/B08GENERIC1`, query),
          description: `High-quality ${query} for everyday use`,
          category: category || "General",
          isPrime: true,
        },
        {
          id: `amazon_${Date.now()}_2`,
          title: `Professional ${query} Kit`,
          price: "$299.99",
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300",
          rating: 4.3,
          reviewCount: 856,
          affiliateUrl: generateAmazonAffiliateLink(`/dp/B08GENERIC2`, query),
          description: `Complete ${query} solution for professionals`,
          category: category || "General",
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
        {
          id: `amazon_${Date.now()}_4`,
          title: `Kindle E-Reader - ${query}`,
          price: "$139.99",
          image: "https://images.unsplash.com/photo-1481487196290-c152efe083f5?w=300",
          rating: 4.6,
          reviewCount: 2847,
          affiliateUrl: generateAmazonAffiliateLink(`/dp/B08KTZ8249`, query),
          description: "Lightweight e-reader with adjustable warm light",
          category: category || "Electronics",
          isPrime: true,
        },
        {
          id: `amazon_${Date.now()}_5`,
          title: `Premium Coffee Set - ${query}`,
          price: "$79.99",
          image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300",
          rating: 4.4,
          reviewCount: 967,
          affiliateUrl: generateAmazonAffiliateLink(`/dp/B09HJKLM34`, query),
          description: "Artisan coffee collection with brewing accessories",
          category: category || "Food & Beverage",
          isPrime: true,
        },
      ];
    }

    return products;
  } catch (error) {
    console.error("Amazon API error:", error);
    throw new Error("Failed to fetch Amazon products");
  }
}

// Generate Amazon affiliate links
function generateAmazonAffiliateLink(productPath: string, searchTerm: string): string {
  const baseUrl = AFFILIATE_CONFIG.amazon.baseUrl;
  const associateId = AFFILIATE_CONFIG.amazon.associateId;
  
  const params = new URLSearchParams({
    tag: associateId,
    linkCode: "as2",
    camp: "1789",
    creative: "9325",
    creativeASIN: productPath.split("/").pop() || "",
  });

  return `${baseUrl}${productPath}?${params.toString()}`;
}

// OpenTable restaurant search
export async function searchOpenTableRestaurants(location: string, cuisine?: string, coordinates?: string) {
  try {
    console.log("Restaurant search params:", { location, cuisine, coordinates });

    let lat: number | undefined;
    let lng: number | undefined;

    if (coordinates) {
      const [latStr, lngStr] = coordinates.split(',');
      lat = parseFloat(latStr);
      lng = parseFloat(lngStr);
    }

    const cityInfo = lat && lng ? getPreciseCityFromCoordinates(lat, lng) : { name: "Orlando", state: "Florida", region: "Southeast" };

    const restaurantDatabase: { [key: string]: any[] } = {
      "Orlando": [
        { name: "Kissimmee Lakefront Grill", desc: "Waterfront dining with fresh seafood and Florida charm", type: "Seafood", lat: 28.242000, lng: -81.285600 },
        { name: "Old Town Tavern", desc: "Historic tavern with comfort food and craft beer", type: "American", lat: 28.250300, lng: -81.289000 },
        { name: "Central Florida Steakhouse", desc: "Premium steaks and wine in elegant setting", type: "Steakhouse", lat: 28.245500, lng: -81.274500 },
        { name: "Cypress Creek Café", desc: "Cozy café with local ingredients and outdoor seating", type: "Café", lat: 28.238000, lng: -81.292000 },
        { name: "Florida Sunset Grill", desc: "Contemporary dining with beautiful sunset views", type: "Contemporary", lat: 28.250000, lng: -81.280000 }
      ]
    };

    const locationRestaurants = restaurantDatabase[cityInfo.name] || restaurantDatabase["Orlando"];
    
    const restaurants = locationRestaurants.map((restaurant: any, index: number) => {
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
        image: `https://images.unsplash.com/photo-${
          index === 0 ? '1517248135467-4c7edcad34c4' : 
          index === 1 ? '1414235077428-338989a2e8c0' : 
          index === 2 ? '1559329007-40df8bfbd4a6' : 
          index === 3 ? '1544148103-0773bf10c69e' : 
          '1551218808-fbd613d8b798'
        }?w=300`,
        description: restaurant.desc,
        distance: distance,
        bookingUrl: generateOpenTableAffiliateLink(restaurant.name, `${cityInfo.name}, ${cityInfo.state}`, { lat: restaurant.lat, lng: restaurant.lng }),
        availableTimeSlots: ["6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM"]
      };
    });

    return restaurants;
  } catch (error) {
    console.error("OpenTable API error:", error);
    throw new Error("Failed to fetch restaurant recommendations");
  }
}

// Generate OpenTable affiliate links
function generateOpenTableAffiliateLink(restaurantName: string, location: string, coordinates?: { lat: number; lng: number }): string {
  const baseUrl = AFFILIATE_CONFIG.opentable.baseUrl;
  const partnerId = AFFILIATE_CONFIG.opentable.partnerId;
  
  const [city, state] = location.split(', ');
  
  const params = new URLSearchParams({
    restref: partnerId,
    covers: "2",
    dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    utm_source: partnerId,
    utm_medium: "affiliate",
    utm_campaign: "restaurant_recommendations",
    term: restaurantName,
    location: location
  });

  if (coordinates) {
    params.append('latitude', coordinates.lat.toString());
    params.append('longitude', coordinates.lng.toString());
    params.append('metroId', '33'); // Orlando metro area
  }

  const affiliateUrl = `${baseUrl}/s/?${params.toString()}`;
  console.log(`Generated OpenTable URL for ${restaurantName} in ${location}:`, affiliateUrl);
  
  return affiliateUrl;
}

// Expedia travel search
export async function searchExpediaTravel(destination: string, type: "hotels" | "flights" | "packages" = "hotels") {
  try {
    const travelOptions = [
      {
        id: `expedia_${Date.now()}_1`,
        name: `Luxury Hotel - ${destination}`,
        type: "hotel",
        location: destination,
        price: "$199/night",
        rating: 4.5,
        reviewCount: 245,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300",
        affiliateUrl: generateExpediaAffiliateLink(`hotel/${destination.toLowerCase()}-luxury`, destination),
        description: "Elegant hotel with modern amenities and city views",
        amenities: ["Free WiFi", "Pool", "Gym", "Restaurant", "Parking"],
      },
      {
        id: `expedia_${Date.now()}_2`,
        name: `Budget-Friendly Hotel - ${destination}`,
        type: "hotel",
        location: destination,
        price: "$89/night",
        rating: 4.2,
        reviewCount: 567,
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300",
        affiliateUrl: generateExpediaAffiliateLink(`hotel/${destination.toLowerCase()}-budget`, destination),
        description: "Comfortable accommodations with essential amenities",
        amenities: ["Free WiFi", "Breakfast", "24/7 Front Desk"],
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
      {
        id: `expedia_${Date.now()}_4`,
        name: `Beachfront Resort - ${destination}`,
        type: "hotel",
        location: destination,
        price: "$249/night",
        rating: 4.8,
        reviewCount: 892,
        image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=300",
        affiliateUrl: generateExpediaAffiliateLink(`hotel/${destination.toLowerCase()}-beachfront`, destination),
        description: "Luxury beachfront resort with all amenities",
        amenities: ["Beach Access", "Pool", "Spa", "Restaurant", "Bar"],
      },
      {
        id: `expedia_${Date.now()}_5`,
        name: `Mountain Lodge - ${destination}`,
        type: "hotel",
        location: destination,
        price: "$159/night",
        rating: 4.6,
        reviewCount: 467,
        image: "https://images.unsplash.com/photo-1549294413-26f195200c16?w=300",
        affiliateUrl: generateExpediaAffiliateLink(`hotel/${destination.toLowerCase()}-mountain`, destination),
        description: "Cozy mountain lodge with scenic views",
        amenities: ["Mountain View", "Fireplace", "Hiking", "WiFi"],
      },
    ];

    return travelOptions;
  } catch (error) {
    console.error("Expedia API error:", error);
    throw new Error("Failed to fetch Expedia travel options");
  }
}

// Generate Expedia affiliate links
function generateExpediaAffiliateLink(travelPath: string, destination: string): string {
  const baseUrl = AFFILIATE_CONFIG.expedia.baseUrl;
  const partnerId = AFFILIATE_CONFIG.expedia.partnerId;
  
  const params = new URLSearchParams({
    affiliate: partnerId,
    utm_source: partnerId,
    utm_medium: "affiliate",
    utm_campaign: "travel_recommendations",
    destination: destination
  });

  return `${baseUrl}/${travelPath}?${params.toString()}`;
}

// Flowers search
export async function searchFlowers(occasion?: string, recipient?: string) {
  const flowerDatabase = [
    {
      name: "Premium Red Roses Bouquet",
      description: "Classic dozen red roses with premium greenery",
      price: "89.99",
      image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300",
      occasions: ["Anniversary", "Birthday", "Just Because"],
      rating: 4.8,
      reviews: 1247,
      delivery: "Same Day Available"
    },
    {
      name: "Sunshine Mixed Bouquet",
      description: "Bright yellow and orange flowers to brighten any day",
      price: "64.99", 
      image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=300",
      occasions: ["Birthday", "Get Well", "Congratulations"],
      rating: 4.7,
      reviews: 856,
      delivery: "Next Day"
    },
    {
      name: "Elegant White Lilies",
      description: "Pure white lilies with soft greenery",
      price: "79.99",
      image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300", 
      occasions: ["Sympathy", "Thank You", "Just Because"],
      rating: 4.9,
      reviews: 634,
      delivery: "Same Day Available"
    },
    {
      name: "Garden Fresh Mixed",
      description: "Seasonal mix of garden-fresh flowers",
      price: "54.99",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300",
      occasions: ["Birthday", "Thank You", "Just Because"],
      rating: 4.6,
      reviews: 923,
      delivery: "Next Day"
    },
    {
      name: "Pink Rose & Lily Combo",
      description: "Soft pink roses with white lilies",
      price: "69.99",
      image: "https://images.unsplash.com/photo-1460803060062-5d8c2a616e0c?w=300",
      occasions: ["Birthday", "Anniversary", "Congratulations"],
      rating: 4.8,
      reviews: 1156,
      delivery: "Same Day Available"
    }
  ];

  return flowerDatabase.map((flower, index) => ({
    id: `flowers_${Date.now()}_${index + 1}`,
    title: flower.name,
    description: flower.description,
    price: `$${flower.price}`,
    rating: flower.rating,
    reviewCount: flower.reviews,
    image: flower.image,
    deliveryOptions: flower.delivery,
    affiliateUrl: generateFlowersAffiliateLink(`flowers/${flower.name.toLowerCase().replace(/\s+/g, '-')}`, flower.name),
    occasions: flower.occasions
  }));
}

// Generate Flowers affiliate links
function generateFlowersAffiliateLink(flowerPath: string, flowerName: string): string {
  const params = new URLSearchParams({
    affiliate: "ocassia",
    utm_source: "ocassia",
    utm_medium: "affiliate",
    utm_campaign: "flower_recommendations",
    product: flowerName
  });

  return `https://www.flowers.com/${flowerPath}?${params.toString()}`;
}

// Best Buy search
export async function searchBestBuy(category?: string, priceRange?: string) {
  const categoryLower = (category || '').toLowerCase();
  let relevantProducts = [];

  if (categoryLower.includes('beauty') || categoryLower.includes('makeup') || categoryLower.includes('cosmetic')) {
    relevantProducts = [
      {
        name: "LED Makeup Mirror with Touch Control",
        description: "Tri-fold vanity mirror with 21 LED lights and 3x magnification",
        price: "39.99",
        originalPrice: "59.99",
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300",
        category: "Beauty Tools",
        rating: 4.7,
        reviews: 2847,
        sku: "6543210"
      },
      {
        name: "Professional Hair Dryer with Ionic Technology",
        description: "Fast-drying salon-quality hair dryer with multiple heat settings",
        price: "89.99",
        originalPrice: "119.99",
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300",
        category: "Hair Care",
        rating: 4.6,
        reviews: 1523,
        sku: "6654321"
      }
    ];
  } else {
    // Default electronics
    relevantProducts = [
      {
        name: "Apple iPad Air 10.9-inch",
        description: "M1 chip, 64GB, Wi-Fi model with stunning Liquid Retina display",
        price: "599.00",
        originalPrice: "649.00",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300",
        category: "Tablets",
        rating: 4.8,
        reviews: 15643,
        sku: "6418724"
      }
    ];
  }

  return relevantProducts.map((product, index) => {
    const productSku = product.sku;
    const affiliateLink = generateBestBuyAffiliateLink(productSku, product.name);
    
    return {
      id: `bestbuy_${Date.now()}_${index + 1}`,
      title: product.name,
      description: product.description,
      price: `$${product.price}`,
      originalPrice: product.originalPrice !== product.price ? `$${product.originalPrice}` : null,
      rating: product.rating,
      reviews: `${product.reviews.toLocaleString()} reviews`,
      image: product.image,
      affiliateUrl: affiliateLink,
      category: product.category
    };
  });
}

// Generate Best Buy affiliate links
function generateBestBuyAffiliateLink(sku: string, productName: string): string {
  const params = new URLSearchParams({
    affiliate: "ocassia",
    utm_source: "ocassia",
    utm_medium: "affiliate",
    utm_campaign: "tech_recommendations"
  });

  return `https://www.bestbuy.com/site/searchpage.jsp?st=${encodeURIComponent(productName)}&${params.toString()}`;
}

// Target search
export async function searchTarget(category?: string, department?: string) {
  const categoryLower = (category || '').toLowerCase();
  const departmentLower = (department || '').toLowerCase();
  let relevantProducts = [];

  if (categoryLower.includes('beauty') || categoryLower.includes('makeup') || categoryLower.includes('cosmetic') || departmentLower.includes('beauty')) {
    relevantProducts = [
      {
        name: "e.l.f. Cosmetics Pure Skin Collection",
        description: "Complete skincare and makeup set for teens and young adults",
        price: "22.99",
        originalPrice: "29.99",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300",
        category: "Beauty",
        department: "Beauty",
        rating: 4.5,
        reviews: 1547,
        tcin: "87654567"
      },
      {
        name: "CeraVe Daily Face Care Routine Set",
        description: "Gentle cleanser and moisturizer perfect for sensitive young skin",
        price: "18.49",
        originalPrice: "24.99",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300",
        category: "Beauty",
        department: "Beauty",
        rating: 4.8,
        reviews: 2847,
        tcin: "12345678"
      },
      {
        name: "NYX Professional Makeup Beginner Set",
        description: "Essential makeup kit with eyeshadows, lipstick, and brushes",
        price: "34.99",
        originalPrice: "44.99",
        image: "https://images.unsplash.com/photo-1515688594390-b649af70d282?w=300",
        category: "Beauty",
        department: "Beauty",
        rating: 4.6,
        reviews: 1923,
        tcin: "98765432"
      }
    ];
  } else {
    // Default products
    relevantProducts = [
      {
        name: "Good & Gather™ Gift Basket",
        description: "Gourmet snack and coffee gift basket",
        price: "34.99",
        originalPrice: "44.99",
        image: "https://images.unsplash.com/photo-1544737151-6e4b9d7b6413?w=300",
        category: "Food",
        department: "Grocery",
        rating: 4.5,
        reviews: 967,
        tcin: "23456789"
      }
    ];
  }

  return relevantProducts.map((product, index) => {
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
      image: product.image,
      affiliateUrl: affiliateLink,
      category: product.category,
      department: product.department
    };
  });
}

// Generate Target affiliate links
function generateTargetAffiliateLink(tcin: string, productName: string): string {
  const params = new URLSearchParams({
    affiliate: "ocassia",
    utm_source: "ocassia",
    utm_medium: "affiliate",
    utm_campaign: "lifestyle_recommendations"
  });

  return `https://www.target.com/s?searchTerm=${encodeURIComponent(productName)}&${params.toString()}`;
}

// Route handlers
export async function handleAmazonSearch(req: Request, res: Response) {
  try {
    const { query, category } = req.query;
    
    const products = await searchAmazonProducts(
      query as string,
      category as string
    );
    res.json(products);
  } catch (error) {
    console.error("Amazon search error:", error);
    res.status(500).json({ error: "Failed to search Amazon products" });
  }
}

export async function handleOpenTableSearch(req: Request, res: Response) {
  try {
    const { location, cuisine, coordinates } = req.query;
    
    const restaurants = await searchOpenTableRestaurants(
      location as string,
      cuisine as string,
      coordinates as string
    );
    res.json(restaurants);
  } catch (error) {
    console.error("OpenTable search error:", error);
    res.status(500).json({ error: "Failed to search restaurant recommendations" });
  }
}

export async function handleExpediaSearch(req: Request, res: Response) {
  try {
    const { destination, type } = req.query;
    
    const travelOptions = await searchExpediaTravel(
      destination as string,
      type as "hotels" | "flights" | "packages"
    );
    res.json(travelOptions);
  } catch (error) {
    console.error("Expedia search error:", error);
    res.status(500).json({ error: "Failed to search travel recommendations" });
  }
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
    res.status(500).json({ error: "Failed to search Best Buy recommendations" });
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
    res.status(500).json({ error: "Failed to search Target recommendations" });
  }
}