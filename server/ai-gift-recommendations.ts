import OpenAI from "openai";
import { Request, Response } from 'express';
import { searchRealAmazonProducts } from "./amazon-product-api";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface GiftRequest {
  recipient: string;
  occasion: string;
  age?: number;
  interests: string[];
  budget?: number;
  relationship: string;
}

interface GiftSuggestion {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedPrice: string;
  reasoning: string;
  searchTerm: string;
  affiliateHint: string;
}

export async function generateSmartGiftSuggestions(giftRequest: GiftRequest): Promise<GiftSuggestion[]> {
  try {
    const { recipient, occasion, age, interests, budget, relationship } = giftRequest;
    
    const prompt = `You are an expert gift advisor. Generate 3 personalized gift suggestions based on these details:

Recipient: ${recipient} (${relationship})
Occasion: ${occasion}
Age: ${age || 'Not specified'}
Interests: ${interests.join(', ')}
Budget: ${budget ? `$${budget}` : 'Flexible'}

For each gift suggestion, provide:
1. A specific, creative gift title
2. A detailed description explaining why it's perfect
3. The category it belongs to
4. A search term that would find this product on Amazon
5. Your reasoning for this recommendation

Respond with JSON in this exact format:
{
  "suggestions": [
    {
      "title": "Specific product name",
      "description": "Detailed description of the gift and why it's perfect",
      "category": "Product category",
      "estimatedPrice": "Price range like $25-50",
      "reasoning": "Why this gift matches their interests and occasion",
      "searchTerm": "amazon search term for this specific product",
      "affiliateHint": "Amazon"
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a gift recommendation expert. Always respond with valid JSON only." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 1500
    });

    const result = JSON.parse(response.choices[0].message.content || '{"suggestions": []}');
    
    // Add unique IDs and format for our system
    const suggestions: GiftSuggestion[] = result.suggestions.map((suggestion: any, index: number) => ({
      id: `ai_gift_${Date.now()}_${index}`,
      title: suggestion.title || 'Gift Suggestion',
      description: suggestion.description || '',
      category: suggestion.category || 'Gift',
      estimatedPrice: suggestion.estimatedPrice || 'N/A',
      reasoning: suggestion.reasoning || '',
      searchTerm: suggestion.searchTerm || suggestion.title,
      affiliateHint: suggestion.affiliateHint || 'Amazon'
    }));

    return suggestions;

  } catch (error) {
    console.error('Error generating AI gift suggestions:', error);
    
    // Use real Amazon products directly for fallback based on interests
    console.log('🔄 Using real Amazon product fallback for interests:', giftRequest.interests);
    
    const fallbackSuggestions = [];
    const searchTerms = [];
    
    // Create search terms based on interests
    giftRequest.interests.forEach(interest => {
      searchTerms.push(interest.toLowerCase());
    });
    
    // If no interests, use generic terms
    if (searchTerms.length === 0) {
      searchTerms.push('gift');
    }
    
    // Get real products for each search term
    searchTerms.forEach((term, index) => {
      const realProducts = searchRealAmazonProducts(term, giftRequest.interests);
      if (realProducts.length > 0) {
        const product = realProducts[0];
        fallbackSuggestions.push({
          id: `fallback_${Date.now()}_${index}`,
          title: product.title,
          description: product.description,
          category: product.category,
          estimatedPrice: product.price,
          price: product.price,
          reasoning: `Perfect for someone interested in ${term}`,
          searchTerm: term,
          affiliateHint: 'Amazon',
          image: product.image,
          affiliateUrl: product.affiliateUrl,
          source: 'Amazon',
          isPrime: product.isPrime,
          rating: product.rating,
          reviewCount: product.reviewCount
        });
      }
    });
    
    // Ensure we have at least 3 suggestions
    while (fallbackSuggestions.length < 3) {
      const genericProducts = searchRealAmazonProducts('gift', []);
      if (genericProducts.length > fallbackSuggestions.length) {
        const product = genericProducts[fallbackSuggestions.length];
        fallbackSuggestions.push({
          id: `fallback_${Date.now()}_${fallbackSuggestions.length}`,
          title: product.title,
          description: product.description,
          category: product.category,
          estimatedPrice: product.price,
          price: product.price,
          reasoning: `Great ${giftRequest.occasion} gift`,
          searchTerm: 'gift',
          affiliateHint: 'Amazon',
          image: product.image,
          affiliateUrl: product.affiliateUrl,
          source: 'Amazon',
          isPrime: product.isPrime,
          rating: product.rating,
          reviewCount: product.reviewCount
        });
      } else {
        break;
      }
    }
    
    return fallbackSuggestions.slice(0, 3);
  }
}

export async function handleAIGiftRecommendations(req: Request, res: Response) {
  try {
    const { recipient, occasion, age, interests, budget, relationship } = req.body;
    
    if (!recipient || !occasion || !interests || !Array.isArray(interests)) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['recipient', 'occasion', 'interests (array)']
      });
    }

    console.log('🤖 Generating AI gift recommendations for:', {
      recipient, occasion, age, interests, budget, relationship
    });

    const suggestions = await generateSmartGiftSuggestions({
      recipient,
      occasion,
      age: age ? parseInt(age) : undefined,
      interests,
      budget: budget ? parseInt(budget) : undefined,
      relationship: relationship || recipient
    });

    // Enhance suggestions with real Amazon product data
    const enhancedSuggestions = await Promise.all(
      suggestions.map(async (suggestion) => {
        try {
          // Search for real Amazon products based on search term and interests
          const realProducts = searchRealAmazonProducts(suggestion.searchTerm, interests);
          
          if (realProducts && realProducts.length > 0) {
            const product = realProducts[0]; // Use the first (most relevant) result
            return {
              ...suggestion,
              title: product.title,
              description: product.description,
              price: product.price,
              image: product.image,
              affiliateUrl: product.affiliateUrl,
              source: 'Amazon',
              isPrime: product.isPrime,
              rating: product.rating,
              reviewCount: product.reviewCount
            };
          }
        } catch (error) {
          console.error(`Error fetching Amazon product for "${suggestion.searchTerm}":`, error);
        }
        
        // If no specific match, try fallback with interests
        const fallbackProducts = searchRealAmazonProducts('gift', interests);
        if (fallbackProducts.length > 0) {
          const product = fallbackProducts[0];
          return {
            ...suggestion,
            image: product.image,
            price: product.price,
            affiliateUrl: product.affiliateUrl,
            source: 'Amazon'
          };
        }
        
        // Return original suggestion if no products found
        return suggestion;
      })
    );

    console.log('✨ Generated', enhancedSuggestions.length, 'AI gift suggestions with real product data');
    console.log('📦 Sample suggestion with image:', {
      title: enhancedSuggestions[0]?.title,
      image: enhancedSuggestions[0]?.image,
      price: enhancedSuggestions[0]?.price,
      affiliateUrl: enhancedSuggestions[0]?.affiliateUrl
    });

    res.json({
      success: true,
      suggestions: enhancedSuggestions,
      metadata: {
        recipient,
        occasion,
        interests,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in AI gift recommendations:', error);
    res.status(500).json({ 
      error: 'Failed to generate gift recommendations',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}