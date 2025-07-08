import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ProductSearchIntent {
  category: string;
  subcategory: string;
  keywords: string[];
  priceRange?: string;
  brand?: string;
  features?: string[];
}

export async function analyzeSearchIntent(query: string): Promise<ProductSearchIntent> {
  try {
    const prompt = `Analyze this product search query and extract structured information to help find the best matching products across Amazon, Target, and Best Buy.

Search query: "${query}"

Please respond with JSON containing:
- category: Main product category (electronics, clothing, home, books, toys, beauty, sports, automotive, etc.)
- subcategory: More specific category (laptop, smartphone, camera, backpack, etc.)
- keywords: Array of relevant search terms and synonyms
- priceRange: budget/mid-range/premium (if implied in query)
- brand: Any mentioned brand names
- features: Specific features or requirements mentioned

Focus on understanding the user's intent. For example:
- "back pack for camera" → category: "electronics", subcategory: "camera bag", keywords: ["camera bag", "photography backpack", "camera case"]
- "wireless headphones" → category: "electronics", subcategory: "headphones", keywords: ["wireless headphones", "bluetooth headphones", "earbuds"]
- "kitchen knife" → category: "home", subcategory: "kitchen tools", keywords: ["chef knife", "kitchen knife", "cooking knife"]

Response format:
{
  "category": "string",
  "subcategory": "string", 
  "keywords": ["array", "of", "strings"],
  "priceRange": "string or null",
  "brand": "string or null",
  "features": ["array", "of", "features"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a product search expert. Analyze user queries and extract structured information to help find the best matching products across multiple retailers."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      category: result.category || "general",
      subcategory: result.subcategory || result.category || "general",
      keywords: result.keywords || [query],
      priceRange: result.priceRange || undefined,
      brand: result.brand || undefined,
      features: result.features || []
    };
  } catch (error) {
    console.error("Error analyzing search intent:", error);
    // Fallback to basic keyword analysis
    return {
      category: "general",
      subcategory: "general",
      keywords: [query],
      priceRange: undefined,
      brand: undefined,
      features: []
    };
  }
}

export async function enhanceProductMatching(products: any[], searchIntent: ProductSearchIntent): Promise<any[]> {
  if (!products.length) return products;

  try {
    const prompt = `Given this search intent and product list, rank and enhance the products based on relevance to the user's query.

Search Intent:
- Category: ${searchIntent.category}
- Subcategory: ${searchIntent.subcategory}
- Keywords: ${searchIntent.keywords.join(", ")}
- Features: ${searchIntent.features.join(", ")}

Products:
${products.map((p, i) => `${i + 1}. ${p.name} - ${p.description} (${p.source}) - $${p.price}`).join("\n")}

Please respond with JSON containing:
- rankings: Array of product indices (0-based) ordered by relevance (most relevant first)
- enhanced: Array of enhanced product objects with added relevanceScore (0-100) and matchReason

Focus on:
1. How well the product matches the search intent
2. Price competitiveness across sources
3. Feature alignment with user needs
4. Brand reputation and quality indicators

Response format:
{
  "rankings": [0, 2, 1, ...],
  "enhanced": [
    {
      "index": 0,
      "relevanceScore": 95,
      "matchReason": "Perfect match for camera backpack with weather protection"
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a product recommendation expert. Analyze and rank products based on how well they match user search intent."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    if (result.rankings && result.enhanced) {
      // Reorder products based on AI rankings and add enhancement data
      const enhancedProducts = result.rankings.map((originalIndex: number) => {
        const product = products[originalIndex];
        const enhancement = result.enhanced.find((e: any) => e.index === originalIndex);
        
        return {
          ...product,
          relevanceScore: enhancement?.relevanceScore || 50,
          matchReason: enhancement?.matchReason || "Good match for your search",
          aiEnhanced: true
        };
      });
      
      return enhancedProducts;
    }
  } catch (error) {
    console.error("Error enhancing product matching:", error);
  }

  // Fallback: return original products with basic relevance scoring
  return products.map(product => ({
    ...product,
    relevanceScore: 50,
    matchReason: "Matches your search criteria",
    aiEnhanced: false
  }));
}