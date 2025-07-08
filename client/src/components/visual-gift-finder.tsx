import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sparkles, Heart, Gift, Calendar, Users, ArrowLeft, ArrowRight, Plus, Star } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface VisualGiftFinderProps {
  onAddToWishlist: (item: any) => void;
}

interface GiftResult {
  id: string;
  title: string;
  name?: string;
  price: string;
  image: string;
  source: string;
  relevanceScore?: number;
  category?: string;
  affiliateUrl?: string;
  affiliateLink?: string;
  url?: string;
}

const occasions = [
  { id: 'christmas', name: 'Christmas', icon: '🎄', gradient: 'from-green-500 to-red-500' },
  { id: 'birthday', name: 'Birthday', icon: '🎂', gradient: 'from-purple-500 to-pink-500' },
  { id: 'valentines', name: "Valentine's Day", icon: '💕', gradient: 'from-red-500 to-pink-500' },
  { id: 'anniversary', name: 'Anniversary', icon: '💍', gradient: 'from-yellow-400 to-orange-500' },
  { id: 'wedding', name: 'Wedding', icon: '💒', gradient: 'from-pink-300 to-rose-400' },
  { id: 'mothers-day', name: "Mother's Day", icon: '🌸', gradient: 'from-pink-400 to-purple-400' },
  { id: 'fathers-day', name: "Father's Day", icon: '👔', gradient: 'from-blue-500 to-indigo-500' },
  { id: 'graduation', name: 'Graduation', icon: '🎓', gradient: 'from-blue-600 to-purple-600' },
  { id: 'baby-shower', name: 'Baby Shower', icon: '🍼', gradient: 'from-blue-300 to-pink-300' },
  { id: 'housewarming', name: 'Housewarming', icon: '🏠', gradient: 'from-green-400 to-blue-400' },
  { id: 'just-because', name: 'Just Because', icon: '💝', gradient: 'from-purple-400 to-pink-400' },
  { id: 'other', name: 'Other', icon: '⭐', gradient: 'from-gray-400 to-gray-600' }
];

const recipients = [
  { id: 'mother', name: 'Mother', icon: '👩', gradient: 'from-pink-400 to-rose-400' },
  { id: 'father', name: 'Father', icon: '👨', gradient: 'from-blue-500 to-indigo-500' },
  { id: 'daughter', name: 'Daughter', icon: '👧', gradient: 'from-pink-300 to-purple-300' },
  { id: 'son', name: 'Son', icon: '👦', gradient: 'from-blue-400 to-cyan-400' },
  { id: 'girlfriend', name: 'Girlfriend', icon: '💃', gradient: 'from-red-400 to-pink-400' },
  { id: 'boyfriend', name: 'Boyfriend', icon: '🕺', gradient: 'from-blue-500 to-purple-500' },
  { id: 'wife', name: 'Wife', icon: '👰', gradient: 'from-rose-400 to-pink-500' },
  { id: 'husband', name: 'Husband', icon: '🤵', gradient: 'from-blue-600 to-indigo-600' },
  { id: 'friend', name: 'Friend', icon: '👥', gradient: 'from-yellow-400 to-orange-400' },
  { id: 'sister', name: 'Sister', icon: '👩‍🦱', gradient: 'from-purple-400 to-pink-400' },
  { id: 'brother', name: 'Brother', icon: '👨‍🦱', gradient: 'from-green-500 to-blue-500' },
  { id: 'coworker', name: 'Coworker', icon: '💼', gradient: 'from-gray-500 to-blue-500' },
  { id: 'teacher', name: 'Teacher', icon: '📚', gradient: 'from-green-400 to-teal-400' },
  { id: 'grandparent', name: 'Grandparent', icon: '👴', gradient: 'from-yellow-300 to-orange-400' },
  { id: 'niece', name: 'Niece', icon: '👧', gradient: 'from-pink-400 to-purple-400' },
  { id: 'nephew', name: 'Nephew', icon: '👦', gradient: 'from-blue-400 to-green-400' }
];

const interests = [
  'Gaming', 'Reading', 'Cooking', 'Sports', 'Music', 'Art', 'Technology', 'Fashion',
  'Fitness', 'Travel', 'Gardening', 'Photography', 'Movies', 'Crafts', 'Outdoors',
  'Beauty', 'Home Decor', 'Jewelry', 'Books', 'Coffee', 'Wine', 'Board Games'
];

// Function to get reliable product images
const getProductImage = (category: string, searchTerm: string) => {
  const imageMap = {
    'Sports & Fitness': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format',
    'Technology': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop&auto=format',
    'Books & Reading': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&auto=format',
    'Kitchen & Cooking': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&auto=format',
    'Photography': 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop&auto=format',
    'Home & Decor': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&auto=format',
    'General': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=300&fit=crop&auto=format'
  };
  
  return imageMap[category] || imageMap['General'];
};

export default function VisualGiftFinder({ onAddToWishlist }: VisualGiftFinderProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOccasion, setSelectedOccasion] = useState<string>('');
  const [selectedRecipient, setSelectedRecipient] = useState<string>('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState([25]);
  const [budgetRange, setBudgetRange] = useState([50]);
  const [isSearching, setIsSearching] = useState(false);
  const [giftResults, setGiftResults] = useState<GiftResult[]>([]);

  const totalSteps = 5;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const searchGifts = async () => {
    setIsSearching(true);
    try {
      // Prepare request for AI gift recommendations
      const requestData = {
        recipient: selectedRecipient || 'friend',
        occasion: selectedOccasion || 'birthday',
        age: ageRange[0],
        interests: selectedInterests,
        budget: budgetRange[0],
        relationship: selectedRecipient || 'friend'
      };
      
      console.log('AI Gift Finder Request:', requestData);
      
      // Call AI gift recommendations endpoint
      const response = await apiRequest('POST', '/api/ai/gift-recommendations', requestData);
      const data = await response.json();
      
      if (data.success && data.suggestions) {
        // Convert AI suggestions to our format
        const aiResults = data.suggestions.map((suggestion: any) => ({
          id: suggestion.id,
          title: suggestion.title,
          name: suggestion.title,
          description: suggestion.description,
          price: suggestion.estimatedPrice,
          image: getProductImage(suggestion.category, suggestion.searchTerm),
          source: 'AI Recommendations',
          category: suggestion.category,
          reasoning: suggestion.reasoning,
          searchTerm: suggestion.searchTerm,
          affiliateUrl: `https://amazon.com/s?k=${encodeURIComponent(suggestion.searchTerm)}&tag=ocassia-20`,
          affiliateLink: `https://amazon.com/s?k=${encodeURIComponent(suggestion.searchTerm)}&tag=ocassia-20`
        }));
        setGiftResults(aiResults);
      } else {
        setGiftResults([]);
      }
      setCurrentStep(5); // Go to results step
    } catch (error) {
      console.error('AI gift search error:', error);
      setGiftResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const renderStepProgress = () => (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
            ${i + 1 <= currentStep 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
              : 'bg-white/20 text-white/60'
            }`}>
            {i + 1 <= currentStep ? '✓' : i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div className={`w-12 h-1 mx-2 rounded-full
              ${i + 1 < currentStep 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                : 'bg-white/20'
              }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderOccasionStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">What's the occasion?</h2>
        <p className="text-white/80">Choose the special event you're shopping for</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {occasions.map((occasion) => (
          <Card 
            key={occasion.id}
            className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg
              ${selectedOccasion === occasion.id 
                ? 'ring-4 ring-purple-400 bg-white/20' 
                : 'bg-white/10 hover:bg-white/20'
              }`}
            onClick={() => setSelectedOccasion(occasion.id)}
          >
            <CardContent className="p-6 text-center">
              <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${occasion.gradient} 
                flex items-center justify-center text-2xl`}>
                {occasion.icon}
              </div>
              <h3 className="text-white font-semibold text-sm">{occasion.name}</h3>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderRecipientStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Who are you shopping for?</h2>
        <p className="text-white/80">Select your relationship to the gift recipient</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recipients.map((recipient) => (
          <Card 
            key={recipient.id}
            className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg
              ${selectedRecipient === recipient.id 
                ? 'ring-4 ring-purple-400 bg-white/20' 
                : 'bg-white/10 hover:bg-white/20'
              }`}
            onClick={() => setSelectedRecipient(recipient.id)}
          >
            <CardContent className="p-6 text-center">
              <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${recipient.gradient} 
                flex items-center justify-center text-2xl`}>
                {recipient.icon}
              </div>
              <h3 className="text-white font-semibold text-sm">{recipient.name}</h3>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderInterestsStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">What are their interests?</h2>
        <p className="text-white/80">Select all that apply to help us find perfect gifts</p>
      </div>
      
      <div className="flex flex-wrap gap-3 justify-center">
        {interests.map((interest) => (
          <Badge
            key={interest}
            variant={selectedInterests.includes(interest) ? "default" : "outline"}
            className={`cursor-pointer text-sm py-2 px-4 transition-all duration-200 hover:scale-105
              ${selectedInterests.includes(interest)
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none'
                : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
              }`}
            onClick={() => toggleInterest(interest)}
          >
            {interest}
          </Badge>
        ))}
      </div>
      
      {selectedInterests.length > 0 && (
        <div className="text-center">
          <p className="text-white/70 text-sm">
            Selected: {selectedInterests.join(', ')}
          </p>
        </div>
      )}
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-8 max-w-md mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Final details</h2>
        <p className="text-white/80">Help us narrow down the perfect gifts</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-white font-semibold mb-3">Age Range</label>
          <Input
            type="number"
            placeholder="Age"
            value={ageRange[0]}
            onChange={(e) => setAgeRange([parseInt(e.target.value) || 25])}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
        
        <div>
          <label className="block text-white font-semibold mb-3">Budget ($)</label>
          <Input
            type="number"
            placeholder="Budget"
            value={budgetRange[0]}
            onChange={(e) => setBudgetRange([parseInt(e.target.value) || 50])}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
      </div>
    </div>
  );

  const renderResultsStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Perfect Gift Recommendations</h2>
        <p className="text-white/80">
          AI-curated gifts for your {selectedRecipient} for {selectedOccasion}
        </p>
      </div>
      
      {giftResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {giftResults.slice(0, 9).map((gift, index) => (
            <Card key={gift.id || index} className="bg-white/10 border-white/20 hover:bg-white/20 transition-colors">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {gift.image && (
                    <img 
                      src={gift.image} 
                      alt={gift.title || gift.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="text-white font-semibold text-sm line-clamp-2 mb-2">
                      {gift.title || gift.name}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-green-300 font-bold">
                        {gift.price}
                      </span>
                      <Badge variant="outline" className="border-white/30 text-white/70 text-xs">
                        {gift.source}
                      </Badge>
                    </div>
                    {gift.relevanceScore && gift.relevanceScore > 10 && (
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 mb-3">
                        <Star className="h-3 w-3 mr-1" />
                        Perfect Match
                      </Badge>
                    )}
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => onAddToWishlist(gift)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add to Wishlist
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Gift className="h-16 w-16 text-white/40 mx-auto mb-4" />
          <p className="text-white/70 text-lg">No gifts found. Try adjusting your criteria.</p>
        </div>
      )}
    </div>
  );

  const renderCurrentStep = () => {
    switch(currentStep) {
      case 1: return renderOccasionStep();
      case 2: return renderRecipientStep();
      case 3: return renderInterestsStep();
      case 4: return renderDetailsStep();
      case 5: return renderResultsStep();
      default: return renderOccasionStep();
    }
  };

  const canProceed = () => {
    switch(currentStep) {
      case 1: return selectedOccasion !== '';
      case 2: return selectedRecipient !== '';
      case 3: return selectedInterests.length > 0;
      case 4: return true;
      case 5: return true;
      default: return false;
    }
  };

  return (
    <div className="space-y-8">
      {renderStepProgress()}
      
      <div className="min-h-[400px]">
        {renderCurrentStep()}
      </div>
      
      <div className="flex justify-between items-center pt-6">
        {currentStep > 1 ? (
          <Button
            variant="outline"
            onClick={prevStep}
            className="border-white/50 bg-white/10 text-white hover:bg-white/20 hover:border-white/70 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
        ) : (
          <div></div>
        )}
        
        {currentStep < 4 ? (
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : currentStep === 4 ? (
          <Button
            onClick={searchGifts}
            disabled={isSearching || !canProceed()}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
          >
            {isSearching ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Finding Gifts...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Find Perfect Gifts
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentStep(1)}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
          >
            Start New Search
          </Button>
        )}
      </div>
    </div>
  );
}