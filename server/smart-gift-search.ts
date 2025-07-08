import { Request, Response } from 'express';

// Enhanced gift-specific search that understands context
interface GiftContext {
  recipient: string;
  age?: string;
  interests: string[];
  occasion: string;
  budget?: string;
  relationship: string;
}

// Smart category mapping for better product matching
const GIFT_CATEGORIES = {
  // Age-based categories
  child: ['toys', 'games', 'educational', 'sports', 'books', 'art supplies'],
  teen: ['tech', 'gaming', 'fashion', 'beauty', 'music', 'sports', 'books'],
  adult: ['tech', 'home', 'fitness', 'beauty', 'books', 'travel', 'hobbies'],
  
  // Interest-based keywords
  gaming: ['gaming', 'video games', 'console', 'PC', 'headset', 'controller'],
  beauty: ['makeup', 'skincare', 'beauty', 'cosmetics', 'perfume'],
  fitness: ['fitness', 'workout', 'gym', 'sports', 'health', 'yoga'],
  tech: ['electronics', 'phone', 'computer', 'gadget', 'smart', 'tech'],
  cooking: ['kitchen', 'cooking', 'chef', 'food', 'recipe', 'appliance'],
  reading: ['books', 'kindle', 'reading', 'literature', 'novel'],
  art: ['art', 'craft', 'drawing', 'painting', 'creative', 'design'],
  music: ['music', 'audio', 'headphones', 'speaker', 'instrument'],
  fashion: ['clothing', 'fashion', 'style', 'accessories', 'jewelry'],
  home: ['home', 'decor', 'furniture', 'organization', 'living']
};

// Occasion-specific product types
const OCCASION_PRODUCTS = {
  birthday: ['surprise', 'special', 'celebration', 'party'],
  christmas: ['holiday', 'festive', 'gift', 'seasonal'],
  graduation: ['achievement', 'milestone', 'success', 'professional'],
  wedding: ['romantic', 'couple', 'elegant', 'special'],
  anniversary: ['romantic', 'memorable', 'love', 'special']
};

export function analyzeGiftIntent(query: string): GiftContext {
  console.log('🎁 Analyzing gift intent for query:', query);
  const lowerQuery = query.toLowerCase();
  
  // Extract relationship
  const relationships = ['nephew', 'niece', 'daughter', 'son', 'mother', 'father', 'sister', 'brother', 'friend', 'wife', 'husband', 'girlfriend', 'boyfriend'];
  const relationship = relationships.find(rel => lowerQuery.includes(rel)) || 'friend';
  
  // Extract age
  const ageMatch = lowerQuery.match(/(\d+)\s*year/);
  const age = ageMatch ? ageMatch[1] : undefined;
  
  // Extract occasion
  const occasions = ['birthday', 'christmas', 'graduation', 'wedding', 'anniversary'];
  const occasion = occasions.find(occ => lowerQuery.includes(occ)) || 'birthday';
  
  // Extract interests from known categories
  const interests: string[] = [];
  Object.keys(GIFT_CATEGORIES).forEach(category => {
    if (lowerQuery.includes(category) || GIFT_CATEGORIES[category as keyof typeof GIFT_CATEGORIES].some(keyword => lowerQuery.includes(keyword))) {
      interests.push(category);
    }
  });
  
  // If no specific interests found, try to infer from the query
  if (interests.length === 0) {
    const words = lowerQuery.split(/\s+/);
    words.forEach(word => {
      Object.entries(GIFT_CATEGORIES).forEach(([category, keywords]) => {
        if (keywords.includes(word)) {
          interests.push(category);
        }
      });
    });
  }
  
  return {
    recipient: relationship,
    age,
    interests,
    occasion,
    relationship
  };
}

export function buildSmartSearchQueries(context: GiftContext): string[] {
  const queries: string[] = [];
  
  // Age-appropriate searches
  const ageGroup = context.age ? 
    (parseInt(context.age) <= 12 ? 'child' : 
     parseInt(context.age) <= 17 ? 'teen' : 'adult') : 'adult';
  
  // Interest-based queries
  context.interests.forEach(interest => {
    const keywords = GIFT_CATEGORIES[interest as keyof typeof GIFT_CATEGORIES] || [interest];
    keywords.forEach(keyword => {
      // Create specific product queries
      queries.push(`${keyword} for ${ageGroup}`);
      queries.push(`${keyword} gift ${context.age ? context.age + ' year old' : ''}`);
      queries.push(`${keyword} ${context.occasion}`);
    });
  });
  
  // Fallback queries if no interests detected
  if (context.interests.length === 0) {
    const ageCategories = GIFT_CATEGORIES[ageGroup as keyof typeof GIFT_CATEGORIES] || ['gift'];
    ageCategories.slice(0, 3).forEach(category => {
      queries.push(`${category} for ${context.relationship}`);
      queries.push(`${category} ${context.age ? context.age + ' year old' : ''}`);
    });
  }
  
  // Occasion-specific queries
  const occasionKeywords = OCCASION_PRODUCTS[context.occasion as keyof typeof OCCASION_PRODUCTS] || ['gift'];
  occasionKeywords.forEach(keyword => {
    queries.push(`${keyword} ${context.interests[0] || 'gift'}`);
  });
  
  return queries.slice(0, 5); // Limit to 5 most relevant queries
}

export async function smartGiftSearch(req: Request, res: Response) {
  try {
    const { query } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    console.log(`🎁 Smart Gift Search: "${query}"`);
    
    // Analyze the gift context
    const context = analyzeGiftIntent(query);
    console.log(`🎯 Gift Context:`, context);
    
    // Build multiple smart search queries
    const searchQueries = buildSmartSearchQueries(context);
    console.log(`🔍 Search Queries:`, searchQueries);
    
    // Import search functions
    const { searchAmazonProducts } = await import('./affiliates');
    const { searchBestBuy } = await import('./affiliates');
    const { searchTarget } = await import('./affiliates');
    
    // Search across multiple platforms with smart queries
    const allResults: any[] = [];
    
    // Search Amazon with multiple queries
    for (const searchQuery of searchQueries.slice(0, 3)) {
      try {
        const amazonResults = await searchAmazonProducts(searchQuery);
        allResults.push(...amazonResults.slice(0, 3));
      } catch (error) {
        console.log(`Amazon search failed for "${searchQuery}":`, error);
      }
    }
    
    // Search Best Buy for tech-related interests
    if (context.interests.some(interest => ['gaming', 'tech', 'music'].includes(interest))) {
      try {
        const bestBuyResults = await searchBestBuy('Electronics');
        allResults.push(...bestBuyResults.slice(0, 3));
      } catch (error) {
        console.log('Best Buy search failed:', error);
      }
    }
    
    // Search Target for general gifts
    try {
      const targetResults = await searchTarget();
      allResults.push(...targetResults.slice(0, 2));
    } catch (error) {
      console.log('Target search failed:', error);
    }
    
    // Remove duplicates and score relevance
    const uniqueResults = allResults.filter((item, index, self) => 
      index === self.findIndex(t => t.title === item.title || t.name === item.name)
    );
    
    // Score and sort by relevance
    const scoredResults = uniqueResults.map(item => {
      let score = 0;
      const title = (item.title || item.name || '').toLowerCase();
      
      // Score based on interests
      context.interests.forEach(interest => {
        const keywords = GIFT_CATEGORIES[interest as keyof typeof GIFT_CATEGORIES] || [interest];
        keywords.forEach(keyword => {
          if (title.includes(keyword.toLowerCase())) {
            score += 10;
          }
        });
      });
      
      // Score based on age appropriateness
      if (context.age) {
        const age = parseInt(context.age);
        if (age <= 12 && (title.includes('toy') || title.includes('game') || title.includes('kid'))) {
          score += 15;
        } else if (age <= 17 && (title.includes('teen') || title.includes('gaming') || title.includes('tech'))) {
          score += 15;
        }
      }
      
      // Score based on price (prefer mid-range for gifts)
      if (item.price) {
        const priceMatch = item.price.match(/\$?(\d+\.?\d*)/);
        if (priceMatch) {
          const price = parseFloat(priceMatch[1]);
          if (price >= 20 && price <= 100) score += 5;
          if (price >= 100 && price <= 300) score += 3;
        }
      }
      
      return { ...item, relevanceScore: score };
    });
    
    // Sort by relevance and return top results
    const finalResults = scoredResults
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 8);
    
    console.log(`✨ Found ${finalResults.length} relevant gift suggestions`);
    
    res.json(finalResults);
    
  } catch (error) {
    console.error('Smart gift search error:', error);
    res.status(500).json({ error: 'Failed to search for gifts' });
  }
}