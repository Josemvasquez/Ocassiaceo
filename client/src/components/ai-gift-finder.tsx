import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Sparkles, Users, Calendar, DollarSign, Search, Plus } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface GiftFinderProps {
  onAddToWishlist: (item: any) => void;
  onClose: () => void;
}

interface GiftProfile {
  relationship: string;
  age: string;
  gender: string;
  interests: string;
  occasion: string;
  budget: string;
  personality: string;
  lifestyle: string;
}

export default function AIGiftFinder({ onAddToWishlist, onClose }: GiftFinderProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [profile, setProfile] = useState<GiftProfile>({
    relationship: '',
    age: '',
    gender: '',
    interests: '',
    occasion: '',
    budget: '',
    personality: '',
    lifestyle: ''
  });

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      // Create a detailed search query based on the profile
      const searchQuery = `${profile.interests} gift for ${profile.age} year old ${profile.gender} ${profile.relationship} who is ${profile.personality} and likes ${profile.lifestyle} for ${profile.occasion} under ${profile.budget}`;
      
      const response = await apiRequest('GET', `/api/search/products?query=${encodeURIComponent(searchQuery)}`);
      const results = await response.json();
      setRecommendations(results || []);
      setStep(3);
      
      if (results.length === 0) {
        toast({
          title: "No Results",
          description: "No products found. Try adjusting your criteria.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to find gift recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">AI Gift Finder</h3>
        <p className="text-gray-600">Tell us about the person you're shopping for</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="relationship">Your relationship to them</Label>
          <Select value={profile.relationship} onValueChange={(value) => setProfile({...profile, relationship: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daughter">Daughter</SelectItem>
              <SelectItem value="son">Son</SelectItem>
              <SelectItem value="mother">Mother</SelectItem>
              <SelectItem value="father">Father</SelectItem>
              <SelectItem value="sister">Sister</SelectItem>
              <SelectItem value="brother">Brother</SelectItem>
              <SelectItem value="wife">Wife</SelectItem>
              <SelectItem value="husband">Husband</SelectItem>
              <SelectItem value="girlfriend">Girlfriend</SelectItem>
              <SelectItem value="boyfriend">Boyfriend</SelectItem>
              <SelectItem value="friend">Friend</SelectItem>
              <SelectItem value="colleague">Colleague</SelectItem>
              <SelectItem value="niece">Niece</SelectItem>
              <SelectItem value="nephew">Nephew</SelectItem>
              <SelectItem value="aunt">Aunt</SelectItem>
              <SelectItem value="uncle">Uncle</SelectItem>
              <SelectItem value="grandparent">Grandparent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="age">Their age</Label>
          <Input
            id="age"
            value={profile.age}
            onChange={(e) => setProfile({...profile, age: e.target.value})}
            placeholder="e.g., 13, 25, 45"
          />
        </div>

        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select value={profile.gender} onValueChange={(value) => setProfile({...profile, gender: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="woman">Woman</SelectItem>
              <SelectItem value="man">Man</SelectItem>
              <SelectItem value="girl">Girl</SelectItem>
              <SelectItem value="boy">Boy</SelectItem>
              <SelectItem value="non-binary">Non-binary</SelectItem>
              <SelectItem value="prefer not to say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="occasion">Occasion</Label>
          <Select value={profile.occasion} onValueChange={(value) => setProfile({...profile, occasion: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select occasion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="birthday">Birthday</SelectItem>
              <SelectItem value="christmas">Christmas</SelectItem>
              <SelectItem value="anniversary">Anniversary</SelectItem>
              <SelectItem value="graduation">Graduation</SelectItem>
              <SelectItem value="wedding">Wedding</SelectItem>
              <SelectItem value="baby shower">Baby Shower</SelectItem>
              <SelectItem value="housewarming">Housewarming</SelectItem>
              <SelectItem value="valentine's day">Valentine's Day</SelectItem>
              <SelectItem value="mother's day">Mother's Day</SelectItem>
              <SelectItem value="father's day">Father's Day</SelectItem>
              <SelectItem value="just because">Just Because</SelectItem>
              <SelectItem value="thank you">Thank You</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="interests">Their interests and hobbies</Label>
        <Textarea
          id="interests"
          value={profile.interests}
          onChange={(e) => setProfile({...profile, interests: e.target.value})}
          placeholder="e.g., reading, cooking, gaming, fitness, art, music, travel..."
          className="min-h-[80px]"
        />
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={() => setStep(2)}
          disabled={!profile.relationship || !profile.age || !profile.interests}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          Next Step
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full mb-4">
          <Heart className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Tell us more</h3>
        <p className="text-gray-600">Help us understand their personality and preferences</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="budget">Budget range</Label>
          <Select value={profile.budget} onValueChange={(value) => setProfile({...profile, budget: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select budget range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under $25">Under $25</SelectItem>
              <SelectItem value="$25-$50">$25 - $50</SelectItem>
              <SelectItem value="$50-$100">$50 - $100</SelectItem>
              <SelectItem value="$100-$200">$100 - $200</SelectItem>
              <SelectItem value="$200-$500">$200 - $500</SelectItem>
              <SelectItem value="over $500">Over $500</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="personality">Their personality</Label>
          <Select value={profile.personality} onValueChange={(value) => setProfile({...profile, personality: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select personality type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="outgoing and social">Outgoing & Social</SelectItem>
              <SelectItem value="quiet and thoughtful">Quiet & Thoughtful</SelectItem>
              <SelectItem value="adventurous and spontaneous">Adventurous & Spontaneous</SelectItem>
              <SelectItem value="practical and organized">Practical & Organized</SelectItem>
              <SelectItem value="creative and artistic">Creative & Artistic</SelectItem>
              <SelectItem value="tech-savvy and modern">Tech-savvy & Modern</SelectItem>
              <SelectItem value="traditional and classic">Traditional & Classic</SelectItem>
              <SelectItem value="funny and playful">Funny & Playful</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="lifestyle">Their lifestyle</Label>
          <Select value={profile.lifestyle} onValueChange={(value) => setProfile({...profile, lifestyle: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select lifestyle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active and outdoorsy">Active & Outdoorsy</SelectItem>
              <SelectItem value="homebody and cozy">Homebody & Cozy</SelectItem>
              <SelectItem value="professional and busy">Professional & Busy</SelectItem>
              <SelectItem value="student life">Student Life</SelectItem>
              <SelectItem value="family-focused">Family-focused</SelectItem>
              <SelectItem value="travel enthusiast">Travel Enthusiast</SelectItem>
              <SelectItem value="health and wellness focused">Health & Wellness Focused</SelectItem>
              <SelectItem value="minimalist">Minimalist</SelectItem>
              <SelectItem value="luxury lover">Luxury Lover</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(1)}>
          Back
        </Button>
        <Button 
          onClick={handleSearch}
          disabled={!profile.budget || !profile.personality || !profile.lifestyle || isSearching}
          className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
        >
          {isSearching ? (
            <>
              <Search className="h-4 w-4 mr-2 animate-spin" />
              Finding Perfect Gifts...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Find Perfect Gifts
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4">
          <Heart className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Perfect Gift Recommendations</h3>
        <p className="text-gray-600">
          Personalized suggestions for your {profile.age} year old {profile.relationship}
        </p>
      </div>

      <div className="grid gap-4 max-h-[400px] overflow-y-auto">
        {recommendations.map((item, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex gap-4">
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.title || item.name}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-grow">
                  <h4 className="font-semibold text-gray-800 mb-1">
                    {item.title || item.name}
                  </h4>
                  {item.description && (
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.price && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {item.price}
                        </Badge>
                      )}
                      {item.category && (
                        <Badge variant="outline">{item.category}</Badge>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onAddToWishlist(item)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add to Wishlist
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(2)}>
          Refine Search
        </Button>
        <Button onClick={onClose}>
          Done
        </Button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  );
}