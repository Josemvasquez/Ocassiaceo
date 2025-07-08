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
    
    // Fallback suggestions if AI fails
    return [
      {
        id: `fallback_${Date.now()}`,
        title: `${giftRequest.interests[0] || 'Special'} Gift for ${giftRequest.recipient}`,
        description: `A thoughtful ${giftRequest.occasion} gift based on their interests`,
        category: giftRequest.interests[0] || 'General',
        estimatedPrice: giftRequest.budget ? `Under $${giftRequest.budget}` : '$25-75',
        reasoning: `Perfect for someone who loves ${giftRequest.interests.join(' and ')}`,
        searchTerm: `${giftRequest.interests[0]} gift ${giftRequest.recipient}`,
        affiliateHint: 'Amazon'
      }
    ];
  }
}

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

    console.log('✨ Generated', suggestions.length, 'AI gift suggestions');

    res.json({
      success: true,
      suggestions,
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