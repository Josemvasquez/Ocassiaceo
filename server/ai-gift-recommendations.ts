import OpenAI from "openai";
import { Request, Response } from 'express';

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
    
    const prompt = `You are an expert gift consultant with deep knowledge of products, brands, and personalized gift-giving. 

Generate 5 thoughtful, specific gift suggestions for:
- Recipient: ${recipient} (${relationship})
- Occasion: ${occasion}
${age ? `- Age: ${age} years old` : ''}
- Interests: ${interests.join(', ')}
${budget ? `- Budget: Under $${budget}` : '- Budget: Flexible'}

Requirements:
1. Each suggestion should be a SPECIFIC product with a clear brand/type
2. Include WHY this gift fits their interests and occasion
3. Provide realistic price estimates
4. Include search terms that would help find this product on Amazon/retailers
5. Make suggestions thoughtful and personal, not generic

Format as JSON with this structure:
{
  "suggestions": [
    {
      "title": "Specific Product Name",
      "description": "Brief product description",
      "category": "Product category",
      "estimatedPrice": "$XX-XX",
      "reasoning": "Why this fits their interests and occasion",
      "searchTerm": "Best search term for finding this product",
      "affiliateHint": "Amazon/Target/BestBuy - where to find it"
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a professional gift consultant. Always provide specific, actionable gift suggestions with clear reasoning."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000
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
    
    // Enhanced fallback suggestions with specific products for each interest
    const fallbackSuggestions = [];
    
    giftRequest.interests.forEach((interest, index) => {
      const interestGifts = {
        'Sports': {
          title: 'Wireless Bluetooth Earbuds for Workouts',
          description: 'High-quality wireless earbuds perfect for active lifestyle and sports',
          category: 'Sports & Fitness',
          searchTerm: 'wireless bluetooth sports earbuds',
          reasoning: 'Perfect for staying motivated during workouts and sports activities'
        },
        'Technology': {
          title: 'Portable Phone Charger Power Bank',
          description: 'High-capacity portable charger for smartphones and devices',
          category: 'Technology',
          searchTerm: 'portable phone charger power bank',
          reasoning: 'Essential tech accessory for anyone who loves gadgets and staying connected'
        },
        'Reading': {
          title: 'LED Reading Light with Adjustable Brightness',
          description: 'Portable reading light perfect for book lovers',
          category: 'Books & Reading',
          searchTerm: 'LED reading light adjustable brightness',
          reasoning: 'Ideal for reading enthusiasts who love to read anywhere, anytime'
        },
        'Cooking': {
          title: 'Silicone Cooking Utensil Set',
          description: 'Non-stick silicone cooking tools and utensils',
          category: 'Kitchen & Cooking',
          searchTerm: 'silicone cooking utensil set',
          reasoning: 'Perfect for home cooks who love experimenting in the kitchen'
        },
        'Photography': {
          title: 'Smartphone Camera Lens Attachment Kit',
          description: 'Professional-grade lens attachments for mobile photography',
          category: 'Photography',
          searchTerm: 'smartphone camera lens attachment kit',
          reasoning: 'Great for photography enthusiasts who want to enhance their mobile photos'
        },
        'Books': {
          title: 'Wooden Book Stand and Reading Rest',
          description: 'Adjustable book holder for comfortable reading',
          category: 'Books & Reading',
          searchTerm: 'wooden book stand reading rest',
          reasoning: 'Perfect for avid readers who enjoy comfortable reading sessions'
        },
        'Home Decor': {
          title: 'LED String Lights for Room Decoration',
          description: 'Warm white LED lights for creating cozy ambiance',
          category: 'Home & Decor',
          searchTerm: 'LED string lights room decoration',
          reasoning: 'Ideal for someone who loves decorating and creating a cozy home atmosphere'
        }
      };
      
      const giftTemplate = interestGifts[interest] || {
        title: `${interest} Starter Kit`,
        description: `Essential items for ${interest.toLowerCase()} enthusiasts`,
        category: interest,
        searchTerm: `${interest.toLowerCase()} gift kit`,
        reasoning: `Perfect for someone passionate about ${interest.toLowerCase()}`
      };
      
      fallbackSuggestions.push({
        id: `fallback_${Date.now()}_${index}`,
        title: giftTemplate.title,
        description: giftTemplate.description,
        category: giftTemplate.category,
        estimatedPrice: giftRequest.budget ? `Under $${giftRequest.budget}` : '$25-75',
        reasoning: giftTemplate.reasoning,
        searchTerm: giftTemplate.searchTerm,
        affiliateHint: 'Amazon'
      });
    });
    
    // If no specific interests, provide generic but thoughtful suggestions
    if (fallbackSuggestions.length === 0) {
      fallbackSuggestions.push({
        id: `fallback_${Date.now()}`,
        title: `Thoughtful Gift for ${giftRequest.recipient}`,
        description: `A special ${giftRequest.occasion} gift`,
        category: 'General',
        estimatedPrice: giftRequest.budget ? `Under $${giftRequest.budget}` : '$25-75',
        reasoning: `Perfect for celebrating ${giftRequest.occasion}`,
        searchTerm: `${giftRequest.occasion} gift ${giftRequest.recipient}`,
        affiliateHint: 'Amazon'
      });
    }
    
    return fallbackSuggestions.slice(0, 3); // Return up to 3 suggestions
  }
}

// Import affiliate search functions
import { searchAmazonProducts } from './affiliates';

export async function handleAIGiftRecommendations(req: Request, res: Response) {
  try {
    const { recipient, occasion, age, interests, budget, relationship } = req.body;
    
    if (!recipient || !occasion || !interests || !Array.isArray(interests)) {
      return res.status(400).json({ 
        error: 'Missing required fields: recipient, occasion, and interests are required' 
      });
    }

    console.log('🤖 Generating AI gift recommendations for:', {
      recipient,
      occasion,
      age,
      interests,
      budget,
      relationship
    });

    const suggestions = await generateSmartGiftSuggestions({
      recipient,
      occasion,
      age: age ? parseInt(age) : undefined,
      interests,
      budget: budget ? parseInt(budget) : undefined,
      relationship: relationship || recipient
    });

    // Enhance suggestions with real product data from affiliate partners
    const enhancedSuggestions = await Promise.all(
      suggestions.map(async (suggestion) => {
        try {
          // Search for real products using the AI-generated search term
          const products = await searchAmazonProducts(suggestion.searchTerm);
          if (products && products.length > 0) {
            const product = products[0]; // Use the first (most relevant) result
            return {
              ...suggestion,
              title: product.title || suggestion.title,
              description: product.description || suggestion.description,
              price: product.price || suggestion.estimatedPrice,
              image: product.image || product.imageUrl,
              affiliateUrl: product.affiliateUrl || product.url,
              source: product.source || 'Amazon'
            };
          }
        } catch (error) {
          console.error(`Error fetching product for "${suggestion.searchTerm}":`, error);
        }
        // Return original suggestion if product fetch fails
        return suggestion;
      })
    );

    console.log('✨ Generated', enhancedSuggestions.length, 'AI gift suggestions with real product data');

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