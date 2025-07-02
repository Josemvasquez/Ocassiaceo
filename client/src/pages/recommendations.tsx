import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecommendationCard from "@/components/recommendation-card";
import RecommendationSearch from "@/components/recommendation-search";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Utensils, MapPin, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Recommendations() {
  const [giftParams, setGiftParams] = useState<any>({});
  const [restaurantParams, setRestaurantParams] = useState<any>({});
  const [travelParams, setTravelParams] = useState<any>({});

  // Fetch gift recommendations
  const { 
    data: gifts, 
    isLoading: giftsLoading, 
    error: giftsError,
    refetch: refetchGifts 
  } = useQuery({
    queryKey: ['/api/recommendations/gifts', giftParams],
  });

  // Fetch restaurant recommendations
  const { 
    data: restaurants, 
    isLoading: restaurantsLoading, 
    error: restaurantsError,
    refetch: refetchRestaurants 
  } = useQuery({
    queryKey: ['/api/recommendations/restaurants', restaurantParams],
  });

  // Fetch travel recommendations
  const { 
    data: travel, 
    isLoading: travelLoading, 
    error: travelError,
    refetch: refetchTravel 
  } = useQuery({
    queryKey: ['/api/recommendations/travel', travelParams],
  });

  const handleGiftSearch = (params: any) => {
    setGiftParams(params);
    refetchGifts();
  };

  const handleRestaurantSearch = (params: any) => {
    setRestaurantParams(params);
    refetchRestaurants();
  };

  const handleTravelSearch = (params: any) => {
    setTravelParams(params);
    refetchTravel();
  };

  const renderResults = (data: any[] | undefined, type: 'gift' | 'restaurant' | 'travel', isLoading: boolean, error: any) => {
    // Debug logging
    console.log(`${type} recommendations:`, { data, isLoading, error });
    
    if (error) {
      return (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Unable to load recommendations. Please try again or check your connection.
          </AlertDescription>
        </Alert>
      );
    }

    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
              <div className="w-full h-48 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!data || data.length === 0) {
      console.log(`No data for ${type}:`, { hasData: !!data, dataLength: data?.length, dataType: typeof data });
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">
            {type === 'gift' ? '🎁' : type === 'restaurant' ? '🍽️' : '✈️'}
          </div>
          <h3 className="text-lg font-medium text-primary mb-2">
            {type === 'gift' ? 'Find Perfect Gifts' : 
             type === 'restaurant' ? 'Discover Great Restaurants' : 
             'Explore Travel Options'}
          </h3>
          <p className="text-secondary">
            {data ? `No results found (${data.length} items)` : 'Loading recommendations...'}
          </p>
        </div>
      );
    }

    console.log(`Rendering ${data.length} ${type} items:`, data.slice(0, 2));
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item: any, index: number) => (
          <RecommendationCard
            key={item.id || index}
            item={item}
            type={type}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-primary mb-2">
            Smart Recommendations
          </h1>
          <p className="text-secondary">
            Discover perfect gifts, restaurants, and travel options with our affiliate partners
          </p>
        </div>

        <Tabs defaultValue="gifts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white rounded-2xl p-1">
            <TabsTrigger 
              value="gifts" 
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-soft-blue data-[state=active]:text-white"
            >
              <Gift className="h-4 w-4" />
              Gifts
            </TabsTrigger>
            <TabsTrigger 
              value="restaurants"
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-soft-blue data-[state=active]:text-white"
            >
              <Utensils className="h-4 w-4" />
              Restaurants
            </TabsTrigger>
            <TabsTrigger 
              value="travel"
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-soft-blue data-[state=active]:text-white"
            >
              <MapPin className="h-4 w-4" />
              Travel
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gifts" className="space-y-6">
            <RecommendationSearch
              type="gift"
              onSearch={handleGiftSearch}
              isLoading={giftsLoading}
            />
            {renderResults(gifts as any[], 'gift', giftsLoading, giftsError)}
          </TabsContent>

          <TabsContent value="restaurants" className="space-y-6">
            <RecommendationSearch
              type="restaurant"
              onSearch={handleRestaurantSearch}
              isLoading={restaurantsLoading}
            />
            {renderResults(restaurants as any[], 'restaurant', restaurantsLoading, restaurantsError)}
          </TabsContent>

          <TabsContent value="travel" className="space-y-6">
            <RecommendationSearch
              type="travel"
              onSearch={handleTravelSearch}
              isLoading={travelLoading}
            />
            {renderResults(travel as any[], 'travel', travelLoading, travelError)}
          </TabsContent>
        </Tabs>

        {/* Affiliate Disclosure */}
        <Card className="mt-12 bg-very-soft-blue border-soft-blue/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-soft-blue mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-soft-blue mb-2">Affiliate Disclosure</h4>
                <p className="text-sm text-soft-blue/80 leading-relaxed">
                  This site contains affiliate links to our partners Amazon, OpenTable, and Expedia. 
                  When you click on these links and make a purchase, we may earn a commission at no 
                  additional cost to you. This helps us maintain and improve our service while 
                  providing you with the best recommendations for your special occasions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}