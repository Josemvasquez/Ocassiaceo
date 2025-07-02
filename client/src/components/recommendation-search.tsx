import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Gift, Utensils, MapPin } from "lucide-react";
import LocationSelector from "@/components/location-selector";

interface RecommendationSearchProps {
  type: 'gift' | 'restaurant' | 'travel';
  onSearch: (params: any) => void;
  isLoading?: boolean;
}

export default function RecommendationSearch({ type, onSearch, isLoading }: RecommendationSearchProps) {
  const [searchParams, setSearchParams] = useState<any>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search params being sent:', searchParams);
    onSearch(searchParams);
  };

  const renderGiftSearch = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Gift className="h-5 w-5 text-soft-blue" />
        <h3 className="font-medium text-primary">Find Perfect Gifts</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-secondary mb-2 block">
            Search for gifts
          </label>
          <Input
            placeholder="e.g., wireless headphones, jewelry, books"
            value={searchParams.query || ''}
            onChange={(e) => setSearchParams({ ...searchParams, query: e.target.value })}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-secondary mb-2 block">
            Category
          </label>
          <Select
            value={searchParams.category || ''}
            onValueChange={(value) => setSearchParams({ ...searchParams, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Books">Books</SelectItem>
              <SelectItem value="Home & Garden">Home & Garden</SelectItem>
              <SelectItem value="Fashion">Fashion</SelectItem>
              <SelectItem value="Sports">Sports</SelectItem>
              <SelectItem value="Toys & Games">Toys & Games</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const handleLocationChange = (location: string, coordinates?: { lat: number; lng: number }) => {
    const newParams = { 
      ...searchParams, 
      location,
      coordinates: coordinates ? `${coordinates.lat},${coordinates.lng}` : undefined
    };
    console.log('Location changed:', { location, coordinates, newParams });
    setSearchParams(newParams);
  };

  const renderRestaurantSearch = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Utensils className="h-5 w-5 text-soft-blue" />
        <h3 className="font-medium text-primary">Find Restaurants</h3>
      </div>
      
      <div className="space-y-4">
        <LocationSelector
          onLocationChange={handleLocationChange}
          defaultLocation={searchParams.location || ''}
          placeholder="e.g., New York, San Francisco, London"
        />
        
        <div>
          <label className="text-sm font-medium text-secondary mb-2 block">
            Cuisine Type
          </label>
          <Select
            value={searchParams.cuisine || ''}
            onValueChange={(value) => setSearchParams({ ...searchParams, cuisine: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any cuisine" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any cuisine</SelectItem>
              <SelectItem value="Italian">Italian</SelectItem>
              <SelectItem value="Japanese">Japanese</SelectItem>
              <SelectItem value="French">French</SelectItem>
              <SelectItem value="Mexican">Mexican</SelectItem>
              <SelectItem value="American">American</SelectItem>
              <SelectItem value="Indian">Indian</SelectItem>
              <SelectItem value="Chinese">Chinese</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderTravelSearch = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-soft-blue" />
        <h3 className="font-medium text-primary">Find Travel Options</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-secondary mb-2 block">
            Destination
          </label>
          <Input
            placeholder="e.g., Paris, Tokyo, Las Vegas"
            value={searchParams.destination || ''}
            onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-secondary mb-2 block">
            Travel Type
          </label>
          <Select
            value={searchParams.type || 'hotels'}
            onValueChange={(value) => setSearchParams({ ...searchParams, type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hotels">Hotels</SelectItem>
              <SelectItem value="flights">Flights</SelectItem>
              <SelectItem value="packages">Vacation Packages</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit}>
          {type === 'gift' && renderGiftSearch()}
          {type === 'restaurant' && renderRestaurantSearch()}
          {type === 'travel' && renderTravelSearch()}
          
          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-soft-blue hover:bg-soft-blue/90 text-white font-medium rounded-xl px-6"
            >
              <Search className="h-4 w-4 mr-2" />
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}