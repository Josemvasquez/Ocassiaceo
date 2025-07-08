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
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a product search expert. Analyze user queries and extract structured information to help find the best matching products across multiple retailers. Respond with JSON format only."
        },
        {
          role: "user",
          content: `Analyze "${query}" and return JSON with: category, subcategory, keywords array, priceRange, brand, features. Example: {"category": "electronics", "subcategory": "camera bag", "keywords": ["camera bag", "photography backpack"]}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 200
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
    // Enhanced fallback with smart keyword analysis
    return smartFallbackAnalysis(query);
  }
}

// Smart fallback when AI is unavailable
function smartFallbackAnalysis(query: string): ProductSearchIntent {
  const queryLower = query.toLowerCase();
  
  // Smart category detection
  const categoryMap: { [key: string]: { category: string; subcategory: string; keywords: string[] } } = {
    'camera': { category: 'electronics', subcategory: 'camera', keywords: ['camera', 'photography', 'lens', 'digital camera'] },
    'backpack': { category: 'electronics', subcategory: 'camera bag', keywords: ['backpack', 'bag', 'camera bag', 'photography backpack'] },
    'bag': { category: 'electronics', subcategory: 'camera bag', keywords: ['bag', 'camera bag', 'photography bag', 'case'] },
    'headphones': { category: 'electronics', subcategory: 'headphones', keywords: ['headphones', 'earbuds', 'audio', 'wireless headphones'] },
    'laptop': { category: 'electronics', subcategory: 'laptop', keywords: ['laptop', 'computer', 'notebook', 'portable computer'] },
    'phone': { category: 'electronics', subcategory: 'smartphone', keywords: ['phone', 'smartphone', 'mobile phone', 'cell phone'] },
    'kitchen': { category: 'home', subcategory: 'kitchen', keywords: ['kitchen', 'cooking', 'culinary', 'chef'] },
    'knife': { category: 'home', subcategory: 'kitchen tools', keywords: ['knife', 'chef knife', 'kitchen knife', 'cooking knife'] },
    'book': { category: 'books', subcategory: 'books', keywords: ['book', 'novel', 'reading', 'literature'] },
    'clothing': { category: 'clothing', subcategory: 'clothing', keywords: ['clothing', 'apparel', 'fashion', 'wear'] },
    'shoes': { category: 'clothing', subcategory: 'footwear', keywords: ['shoes', 'footwear', 'sneakers', 'boots'] }
  };

  // Find best match
  for (const [key, value] of Object.entries(categoryMap)) {
    if (queryLower.includes(key)) {
      return {
        category: value.category,
        subcategory: value.subcategory,
        keywords: value.keywords,
        priceRange: undefined,
        brand: undefined,
        features: []
      };
    }
  }

  // Special case combinations
  if (queryLower.includes('back') && queryLower.includes('camera')) {
    return {
      category: 'electronics',
      subcategory: 'camera bag',
      keywords: ['camera backpack', 'photography bag', 'camera case', 'photo gear bag'],
      priceRange: undefined,
      brand: undefined,
      features: ['waterproof', 'padded', 'compartments']
    };
  }

  if (queryLower.includes('wireless') && queryLower.includes('headphones')) {
    return {
      category: 'electronics',
      subcategory: 'headphones',
      keywords: ['wireless headphones', 'bluetooth headphones', 'earbuds', 'cordless headphones'],
      priceRange: undefined,
      brand: undefined,
      features: ['bluetooth', 'wireless', 'noise canceling']
    };
  }

  // Default fallback
  return {
    category: 'general',
    subcategory: 'general',
    keywords: [query, ...query.split(' ')],
    priceRange: undefined,
    brand: undefined,
    features: []
  };
}

export async function enhanceProductMatching(products: any[], searchIntent: ProductSearchIntent): Promise<any[]> {
  if (!products.length) return products;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a product ranking expert. Analyze products and rank them by relevance to search intent. Respond only with JSON."
        },
        {
          role: "user",
          content: `Rank these products for search: "${searchIntent.keywords.join(' ')}"\n\nProducts: ${products.map((p, i) => `${i}: ${p.title || p.name} - ${p.description}`).join('\n')}\n\nReturn JSON with rankings array (indices) and enhanced array with relevanceScore/matchReason.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 500
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    if (result.rankings && result.enhanced) {
      // Apply AI ranking and enhancement
      const rankedProducts = result.rankings.map((index: number) => {
        const product = products[index];
        const enhancement = result.enhanced.find((e: any) => e.index === index);
        
        return {
          ...product,
          relevanceScore: enhancement?.relevanceScore || 50,
          matchReason: enhancement?.matchReason || "Good match for search criteria",
          aiRanked: true
        };
      });
      
      return rankedProducts;
    }
    
    // Fallback if AI response is malformed
    return smartFallbackRanking(products, searchIntent);
    
  } catch (error) {
    console.error("Error enhancing product matching:", error);
    // Enhanced fallback ranking when AI is unavailable
    return smartFallbackRanking(products, searchIntent);
  }
}

// Smart fallback ranking system
function smartFallbackRanking(products: any[], searchIntent: ProductSearchIntent): any[] {
  const searchTerms = searchIntent.keywords.map(k => k.toLowerCase());
  const category = searchIntent.category.toLowerCase();
  const subcategory = searchIntent.subcategory.toLowerCase();
  
  return products.map(product => {
    let relevanceScore = 0;
    let matchReason = "";
    
    const title = (product.title || product.name || "").toLowerCase();
    const description = (product.description || "").toLowerCase();
    const productCategory = (product.category || "").toLowerCase();
    
    // Category matching (40 points)
    if (productCategory.includes(category) || productCategory.includes(subcategory)) {
      relevanceScore += 40;
      matchReason = "Category match";
    }
    
    // Title keyword matching (30 points)
    const titleMatches = searchTerms.filter(term => title.includes(term)).length;
    if (titleMatches > 0) {
      relevanceScore += Math.min(30, titleMatches * 15);
      matchReason = matchReason ? `${matchReason}, title match` : "Title keyword match";
    }
    
    // Description keyword matching (20 points)
    const descMatches = searchTerms.filter(term => description.includes(term)).length;
    if (descMatches > 0) {
      relevanceScore += Math.min(20, descMatches * 10);
      matchReason = matchReason ? `${matchReason}, description match` : "Description keyword match";
    }
    
    // Source preference (10 points) - prefer Amazon and Best Buy for electronics
    if (category === 'electronics') {
      if (product.source === 'Amazon' || product.source === 'Best Buy') {
        relevanceScore += 10;
      }
    }
    
    // Special case boosts
    if (searchTerms.some(term => ['camera', 'backpack', 'bag'].includes(term))) {
      if (title.includes('camera') && (title.includes('backpack') || title.includes('bag'))) {
        relevanceScore += 20;
        matchReason = "Perfect camera bag match";
      }
    }
    
    // Ensure minimum score
    relevanceScore = Math.max(relevanceScore, 25);
    
    return {
      ...product,
      relevanceScore: Math.min(relevanceScore, 100),
      matchReason: matchReason || "General relevance match",
      aiRanked: false
    };
  }).sort((a, b) => b.relevanceScore - a.relevanceScore); // Sort by relevance score
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