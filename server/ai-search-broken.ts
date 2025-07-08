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
  
  // Enhanced patterns for better age/relationship detection
  const agePatterns = {
    child: /\b(?:child|kid|toddler|baby|infant|little|young)\b/,
    teen: /\b(?:teen|teenager|adolescent|13|14|15|16|17|18|years?\s+old)\b/,
    adult: /\b(?:adult|grown|man|woman|parent|mom|dad)\b/,
  };
  
  const relationshipPatterns = {
    family: /\b(?:mom|mother|dad|father|sister|brother|aunt|uncle|cousin|niece|nephew|grandma|grandmother|grandpa|grandfather)\b/,
    friend: /\b(?:friend|buddy|pal|colleague|coworker)\b/,
    romantic: /\b(?:girlfriend|boyfriend|wife|husband|partner|spouse)\b/,
  };
  
  const interestPatterns = {
    books: /\b(?:book|reading|novel|literature|story|library|bookworm)\b/,
    tech: /\b(?:tech|technology|gadget|electronic|computer|phone|laptop)\b/,
    fashion: /\b(?:fashion|clothes|clothing|style|dress|shirt|jewelry)\b/,
    sports: /\b(?:sport|athletic|exercise|fitness|gym|running|basketball|football)\b/,
    art: /\b(?:art|creative|painting|drawing|craft|music|instrument)\b/,
    gaming: /\b(?:game|gaming|video\s+game|console|nintendo|playstation|xbox)\b/,
  };
  
  // Detect age group
  let ageGroup = 'adult';
  if (agePatterns.child.test(queryLower)) ageGroup = 'child';
  else if (agePatterns.teen.test(queryLower)) ageGroup = 'teen';
  
  // Detect interests
  let category = 'general';
  let subcategory = 'general';
  let keywords = [query];
  
  if (interestPatterns.books.test(queryLower)) {
    category = 'books';
    subcategory = ageGroup === 'teen' ? 'young adult books' : ageGroup === 'child' ? 'children books' : 'adult books';
    keywords = ['books', 'reading', subcategory];
  } else if (interestPatterns.tech.test(queryLower)) {
    category = 'electronics';
    subcategory = ageGroup === 'teen' ? 'teen tech' : 'electronics';
    keywords = ['electronics', 'technology', 'gadgets'];
  } else if (interestPatterns.fashion.test(queryLower)) {
    category = 'fashion';
    subcategory = ageGroup === 'teen' ? 'teen fashion' : 'clothing';
    keywords = ['clothing', 'fashion', 'style'];
  } else if (interestPatterns.gaming.test(queryLower)) {
    category = 'gaming';
    subcategory = 'video games';
    keywords = ['games', 'gaming', 'video games'];
  } else if (interestPatterns.art.test(queryLower)) {
    category = 'arts and crafts';
    subcategory = 'creative supplies';
    keywords = ['art supplies', 'creative', 'craft'];
  }
  
  return {
    category,
    subcategory,
    keywords,
    priceRange: undefined,
    brand: undefined,
    features: []
  };
}

export async function enhanceProductMatching(products: any[], searchIntent: ProductSearchIntent): Promise<any[]> {
  // Enhanced fallback that doesn't require OpenAI
  return smartFallbackRanking(products, searchIntent);
}

function smartFallbackRanking(products: any[], searchIntent: ProductSearchIntent): any[] {
  const searchTerms = searchIntent.keywords.map(k => k.toLowerCase());
  const category = searchIntent.category.toLowerCase();
  
  return products.map(product => {
    let relevanceScore = 25; // base score
    const title = (product.title || product.name || "").toLowerCase();
    const description = (product.description || "").toLowerCase();
    const productCategory = (product.category || "").toLowerCase();
    
    // Category matching
    if (productCategory.includes(category)) {
      relevanceScore += 40;
    }
    
    // Title keyword matching
    const titleMatches = searchTerms.filter(term => title.includes(term)).length;
    relevanceScore += titleMatches * 15;
    
    // Description keyword matching
    const descMatches = searchTerms.filter(term => description.includes(term)).length;
    relevanceScore += descMatches * 10;
    
    return {
      ...product,
      relevanceScore: Math.min(relevanceScore, 100),
      aiEnhanced: false
    };
  }).sort((a, b) => b.relevanceScore - a.relevanceScore);
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
          content: `Rank these products for search: ${searchIntent.keywords.join(' ')}\n\nProducts: ${products.map((p, i) => `${i}: ${p.title || p.name} - ${p.description}`).join('\n')}\n\nReturn JSON with rankings array (indices) and enhanced array with relevanceScore/matchReason.`
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
}

// Enhanced AI product matching with OpenAI integration
async function aiEnhancedProductMatching(products: any[], searchIntent: ProductSearchIntent): Promise<any[]> {
  try {
    const prompt = `Analyze and rank products for search: "${searchIntent.keywords.join(' ')}"

Products to rank:
${products.map((p, i) => `${i}: ${p.title || p.name} - ${p.description || ''}`).join('\n')}

Respond with JSON containing:
- rankings: array of product indices ordered by relevance
- enhanced: array with {index, relevanceScore (0-100), matchReason}`;

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
    console.error("Error in AI product matching:", error);
  }

  // Fallback: return original products with basic relevance scoring
  return products.map(product => ({
    ...product,
    relevanceScore: 50,
    matchReason: "Matches your search criteria",
    aiEnhanced: false
  }));
}

export async function enhanceProductMatching(products: any[], searchIntent: ProductSearchIntent): Promise<any[]> {
  if (!products.length) return products;

  // Try AI enhancement first, fall back to smart ranking if OpenAI is unavailable
  try {
    return await aiEnhancedProductMatching(products, searchIntent);
  } catch (error) {
    console.log("Falling back to smart ranking due to AI limitation");
    return smartFallbackRanking(products, searchIntent);
  }
}