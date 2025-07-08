import { Request, Response } from 'express';
import { searchRealAmazonProducts } from './amazon-product-api';
import { awsProductService, productCache } from './aws-product-api';

// Enhanced recommendation system with AWS integration potential
interface EnhancedGiftRequest {
  recipient: string;
  occasion: string;
  age?: number;
  interests: string[];
  budget?: number;
  relationship: string;
  location?: string;
  previousPurchases?: string[];
}

interface PersonalizedRecommendation {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  affiliateUrl: string;
  source: 'Amazon' | 'Local' | 'Curated';
  confidence: number; // 0-1 score
  reasoning: string;
  category: string;
  features: string[];
  isPrime: boolean;
  rating?: number;
  reviewCount?: number;
  availability: 'InStock' | 'Limited' | 'PreOrder';
  estimatedDelivery: string;
}

class EnhancedRecommendationEngine {
  
  async generatePersonalizedRecommendations(request: EnhancedGiftRequest): Promise<PersonalizedRecommendation[]> {
    console.log('🎯 Generating enhanced personalized recommendations');
    
    try {
      // Step 1: Check cache first
      const cachedResults = await productCache.getCachedSearch(
        `${request.recipient}_${request.occasion}`,
        { interests: request.interests, budget: request.budget }
      );
      
      if (cachedResults) {
        return this.formatRecommendations(cachedResults, request);
      }
      
      // Step 2: Get base recommendations from our Amazon database
      const baseRecommendations = await this.getBaseRecommendations(request);
      
      // Step 3: Enhance with AWS-like features
      const enhancedRecommendations = await this.enhanceWithAWSFeatures(baseRecommendations, request);
      
      // Step 4: Apply personalization scoring
      const personalizedRecommendations = this.applyPersonalizationScoring(enhancedRecommendations, request);
      
      // Step 5: Cache the results
      await productCache.setCachedSearch(
        `${request.recipient}_${request.occasion}`,
        { interests: request.interests, budget: request.budget },
        personalizedRecommendations
      );
      
      return personalizedRecommendations.slice(0, 6); // Return top 6 recommendations
      
    } catch (error) {
      console.error('Error generating enhanced recommendations:', error);
      
      // Fallback to basic recommendations
      return this.getFallbackRecommendations(request);
    }
  }
  
  private async getBaseRecommendations(request: EnhancedGiftRequest): Promise<any[]> {
    const recommendations = [];
    
    // Get products for each interest
    for (const interest of request.interests) {
      const products = searchRealAmazonProducts(interest.toLowerCase(), request.interests);
      recommendations.push(...products.slice(0, 3)); // Top 3 per interest
    }
    
    // Add occasion-specific products
    const occasionProducts = searchRealAmazonProducts(request.occasion.toLowerCase(), request.interests);
    recommendations.push(...occasionProducts.slice(0, 2));
    
    return recommendations;
  }
  
  private async enhanceWithAWSFeatures(products: any[], request: EnhancedGiftRequest): Promise<any[]> {
    // This would integrate with AWS Product Advertising API for real-time data
    // For now, we enhance with AWS-like structure
    
    return products.map(product => ({
      ...product,
      availability: 'InStock',
      estimatedDelivery: this.calculateDeliveryDate(product.isPrime),
      features: this.extractProductFeatures(product),
      confidence: this.calculateConfidence(product, request)
    }));
  }
  
  private applyPersonalizationScoring(products: any[], request: EnhancedGiftRequest): any[] {
    return products.map(product => {
      let score = 0.5; // Base score
      
      // Age appropriateness
      if (request.age) {
        score += this.getAgeScore(product, request.age);
      }
      
      // Budget fit
      if (request.budget) {
        score += this.getBudgetScore(product, request.budget);
      }
      
      // Interest alignment
      score += this.getInterestScore(product, request.interests);
      
      // Occasion appropriateness
      score += this.getOccasionScore(product, request.occasion);
      
      return {
        ...product,
        confidence: Math.min(1, Math.max(0, score))
      };
    }).sort((a, b) => b.confidence - a.confidence);
  }
  
  private calculateDeliveryDate(isPrime: boolean): string {
    const now = new Date();
    const deliveryDays = isPrime ? 2 : 5;
    const deliveryDate = new Date(now.getTime() + (deliveryDays * 24 * 60 * 60 * 1000));
    
    return deliveryDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  private extractProductFeatures(product: any): string[] {
    // Extract key features from product description
    const features = [];
    
    if (product.isPrime) features.push('Prime Delivery');
    if (product.rating >= 4.5) features.push('Highly Rated');
    if (product.reviewCount > 1000) features.push('Popular Choice');
    
    return features;
  }
  
  private calculateConfidence(product: any, request: EnhancedGiftRequest): number {
    // Base confidence calculation
    let confidence = 0.5;
    
    // Rating boost
    if (product.rating) {
      confidence += (product.rating - 3) * 0.1;
    }
    
    // Review count boost
    if (product.reviewCount > 100) {
      confidence += 0.1;
    }
    
    return Math.min(1, Math.max(0, confidence));
  }
  
  private getAgeScore(product: any, age: number): number {
    // Age-appropriate scoring logic
    if (age < 18) return 0.1;
    if (age < 30) return 0.2;
    if (age < 50) return 0.15;
    return 0.1;
  }
  
  private getBudgetScore(product: any, budget: number): number {
    const price = parseFloat(product.price.replace('$', ''));
    if (price <= budget) return 0.2;
    if (price <= budget * 1.2) return 0.1;
    return -0.1;
  }
  
  private getInterestScore(product: any, interests: string[]): number {
    // Score based on category/interest alignment
    const categoryLower = product.category.toLowerCase();
    const matchingInterests = interests.filter(interest => 
      categoryLower.includes(interest.toLowerCase()) || 
      product.title.toLowerCase().includes(interest.toLowerCase())
    );
    
    return matchingInterests.length * 0.15;
  }
  
  private getOccasionScore(product: any, occasion: string): number {
    // Score based on occasion appropriateness
    const occasionKeywords = {
      'birthday': ['gift', 'special', 'celebration'],
      'anniversary': ['romantic', 'elegant', 'special'],
      'graduation': ['achievement', 'success', 'milestone'],
      'wedding': ['elegant', 'luxury', 'special']
    };
    
    const keywords = occasionKeywords[occasion.toLowerCase()] || [];
    const titleLower = product.title.toLowerCase();
    
    const matches = keywords.filter(keyword => titleLower.includes(keyword)).length;
    return matches * 0.1;
  }
  
  private formatRecommendations(awsProducts: any[], request: EnhancedGiftRequest): PersonalizedRecommendation[] {
    return awsProducts.map(product => ({
      id: product.asin || product.id,
      title: product.title,
      description: product.description || `Perfect ${request.occasion} gift`,
      price: product.price?.displayAmount || product.price,
      image: product.images?.primary || product.image,
      affiliateUrl: product.affiliateUrl,
      source: 'Amazon' as const,
      confidence: product.confidence || 0.5,
      reasoning: `Recommended based on ${request.interests.join(', ')} interests`,
      category: product.category,
      features: product.features || [],
      isPrime: product.isPrime,
      rating: product.rating,
      reviewCount: product.reviewCount,
      availability: product.availability || 'InStock',
      estimatedDelivery: product.estimatedDelivery
    }));
  }
  
  private getFallbackRecommendations(request: EnhancedGiftRequest): PersonalizedRecommendation[] {
    // Fallback to basic recommendations
    const fallbackProducts = searchRealAmazonProducts('gift', request.interests);
    
    return fallbackProducts.slice(0, 3).map(product => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.image,
      affiliateUrl: product.affiliateUrl,
      source: 'Amazon' as const,
      confidence: 0.6,
      reasoning: `Fallback recommendation for ${request.occasion}`,
      category: product.category,
      features: product.isPrime ? ['Prime Delivery'] : [],
      isPrime: product.isPrime,
      rating: product.rating,
      reviewCount: product.reviewCount,
      availability: 'InStock',
      estimatedDelivery: this.calculateDeliveryDate(product.isPrime)
    }));
  }
}

// Enhanced API endpoint
const recommendationEngine = new EnhancedRecommendationEngine();

export async function handleEnhancedRecommendations(req: Request, res: Response) {
  try {
    const { recipient, occasion, age, interests, budget, relationship, location } = req.body;
    
    if (!recipient || !occasion || !interests || !Array.isArray(interests)) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['recipient', 'occasion', 'interests (array)']
      });
    }

    console.log('🎯 Enhanced recommendation request:', {
      recipient, occasion, age, interests, budget, relationship
    });

    const recommendations = await recommendationEngine.generatePersonalizedRecommendations({
      recipient,
      occasion,
      age: age ? parseInt(age) : undefined,
      interests,
      budget: budget ? parseInt(budget) : undefined,
      relationship: relationship || recipient,
      location
    });

    res.json({
      success: true,
      recommendations,
      metadata: {
        totalRecommendations: recommendations.length,
        averageConfidence: recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length,
        generatedAt: new Date().toISOString(),
        cacheHit: false // Would be determined by cache service
      }
    });

  } catch (error) {
    console.error('Error in enhanced recommendations:', error);
    res.status(500).json({ 
      error: 'Failed to generate enhanced recommendations',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}