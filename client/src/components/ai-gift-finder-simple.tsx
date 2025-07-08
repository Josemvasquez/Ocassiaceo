import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Search, Plus } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface SimpleGiftFinderProps {
  onAddToWishlist: (item: any) => void;
}

export default function SimpleGiftFinder({ onAddToWishlist }: SimpleGiftFinderProps) {
  const { toast } = useToast();
  const [isSearching, setIsSearching] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [relationship, setRelationship] = useState('');
  const [age, setAge] = useState('');
  const [interests, setInterests] = useState('');
  const [occasion, setOccasion] = useState('');

  const handleSearch = async () => {
    if (!relationship || !age || !interests) {
      toast({
        title: "Missing Information",
        description: "Please fill in the relationship, age, and interests.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      const searchQuery = `${interests} gift for ${age} year old ${relationship} for ${occasion || 'birthday'}`;
      
      const response = await apiRequest('GET', `/api/search/products?query=${encodeURIComponent(searchQuery)}`);
      const results = await response.json();
      setRecommendations(results || []);
      
      if (results.length === 0) {
        toast({
          title: "No Results",
          description: "No products found. Try different criteria.",
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

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">AI Gift Finder</h3>
        <p className="text-gray-600">Tell us who you're shopping for and we'll find perfect gifts</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="relationship">Relationship</Label>
          <Select value={relationship} onValueChange={setRelationship}>
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daughter">Daughter</SelectItem>
              <SelectItem value="son">Son</SelectItem>
              <SelectItem value="mother">Mother</SelectItem>
              <SelectItem value="father">Father</SelectItem>
              <SelectItem value="sister">Sister</SelectItem>
              <SelectItem value="brother">Brother</SelectItem>
              <SelectItem value="friend">Friend</SelectItem>
              <SelectItem value="niece">Niece</SelectItem>
              <SelectItem value="nephew">Nephew</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g., 13, 25"
          />
        </div>

        <div>
          <Label htmlFor="interests">Interests</Label>
          <Input
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="e.g., makeup, gaming, cooking"
          />
        </div>

        <div>
          <Label htmlFor="occasion">Occasion</Label>
          <Select value={occasion} onValueChange={setOccasion}>
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="birthday">Birthday</SelectItem>
              <SelectItem value="christmas">Christmas</SelectItem>
              <SelectItem value="graduation">Graduation</SelectItem>
              <SelectItem value="just because">Just Because</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button 
        onClick={handleSearch}
        disabled={!relationship || !age || !interests || isSearching}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
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

      {recommendations.length > 0 && (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          <h4 className="font-semibold text-gray-800">Recommendations:</h4>
          {recommendations.slice(0, 5).map((item, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-3">
                <div className="flex gap-3">
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.title || item.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-grow">
                    <h5 className="font-medium text-sm text-gray-800 mb-1">
                      {item.title || item.name}
                    </h5>
                    {item.price && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs mb-2">
                        {item.price}
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      onClick={() => onAddToWishlist(item)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add to Wishlist
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}