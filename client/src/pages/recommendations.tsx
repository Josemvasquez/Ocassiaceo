import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import RecommendationCard from "@/components/recommendation-card";
import { Card } from "@/components/ui/card";
import { Gift, Utensils, MapPin, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGeolocation } from "@/hooks/useGeolocation";

export default function Recommendations() {
  // Get user's location automatically
  const { latitude, longitude, locationString, hasLocation, getLocation } = useGeolocation();
  
  // Get location on component mount
  useEffect(() => {
    getLocation();
  }, []);

  // Fetch gift recommendations
  const { 
    data: gifts, 
    isLoading: giftsLoading, 
    error: giftsError
  } = useQuery({
    queryKey: ['/api/recommendations/gifts'],
  });

  // Fetch restaurant recommendations with GPS coordinates when available
  const { 
    data: restaurants, 
    isLoading: restaurantsLoading, 
    error: restaurantsError
  } = useQuery({
    queryKey: ['/api/recommendations/restaurants', { 
      location: hasLocation ? locationString : 'Florida',
      coordinates: hasLocation ? `${latitude},${longitude}` : '28.3344,-81.2187'
    }],
  });

  // Fetch travel recommendations
  const { 
    data: travel, 
    isLoading: travelLoading, 
    error: travelError
  } = useQuery({
    queryKey: ['/api/recommendations/travel'],
  });

  // Fetch flowers recommendations
  const { 
    data: flowers, 
    isLoading: flowersLoading, 
    error: flowersError
  } = useQuery({
    queryKey: ['/api/recommendations/flowers'],
  });

  // Fetch Best Buy recommendations
  const { 
    data: bestbuy, 
    isLoading: bestbuyLoading, 
    error: bestbuyError
  } = useQuery({
    queryKey: ['/api/recommendations/bestbuy'],
  });

  // Fetch Target recommendations
  const { 
    data: target, 
    isLoading: targetLoading, 
    error: targetError
  } = useQuery({
    queryKey: ['/api/recommendations/target'],
  });



  const renderHorizontalSection = (data: any[] | undefined, type: 'gift' | 'restaurant' | 'travel' | 'flowers' | 'bestbuy' | 'target', isLoading: boolean, error: any, title: string, icon: any) => {
    if (error) {
      return (
        <Alert className="border-red-200 bg-red-50/80 backdrop-blur-md">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Unable to load {title.toLowerCase()}. Please try again or check your connection.
          </AlertDescription>
        </Alert>
      );
    }

    if (isLoading) {
      return (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="min-w-[320px] p-6 animate-pulse backdrop-blur-md bg-white/20 border-white/30 flex-shrink-0">
              <div className="space-y-4">
                <div className="h-4 bg-white/20 rounded w-3/4"></div>
                <div className="h-3 bg-white/20 rounded w-1/2"></div>
                <div className="h-3 bg-white/20 rounded w-full"></div>
              </div>
            </Card>
          ))}
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            {icon}
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            {title}
          </h3>
          <p className="text-white/80">
            No recommendations available at the moment
          </p>
        </div>
      );
    }

    return (
      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {data.map((item: any, index: number) => (
          <div key={item.id || index} className="min-w-[320px] flex-shrink-0">
            <RecommendationCard
              item={item}
              type={type}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 py-8">
      <div className="max-w-full mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2 drop-shadow-lg">
            Smart Recommendations
          </h1>
          <p className="text-white/90">
            Discover perfect gifts, restaurants, and travel options with our affiliate partners
          </p>
        </div>

        <div className="space-y-8">
          {/* Amazon Gifts Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                <Gift className="h-6 w-6" />
                Amazon Gifts
              </h2>
              <span className="text-sm bg-orange-500 text-white px-3 py-1 rounded-full">Amazon Partner</span>
            </div>
            {renderHorizontalSection(gifts as any[], 'gift', giftsLoading, giftsError, 'Perfect Gifts', <Gift className="w-12 h-12 text-white/60" />)}
          </section>

          {/* Flowers.com Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                🌸 Beautiful Flowers
              </h2>
              <span className="text-sm bg-pink-500 text-white px-3 py-1 rounded-full">Flowers.com Partner</span>
            </div>
            {renderHorizontalSection(flowers as any[], 'flowers', flowersLoading, flowersError, 'Fresh Flowers', <div className="text-4xl">🌸</div>)}
          </section>

          {/* Best Buy Tech Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                📱 Tech & Electronics
              </h2>
              <span className="text-sm bg-blue-600 text-white px-3 py-1 rounded-full">Best Buy Partner</span>
            </div>
            {renderHorizontalSection(bestbuy as any[], 'bestbuy', bestbuyLoading, bestbuyError, 'Tech Gifts', <div className="text-4xl">📱</div>)}
          </section>

          {/* Target Lifestyle Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                🏠 Home & Lifestyle
              </h2>
              <span className="text-sm bg-red-500 text-white px-3 py-1 rounded-full">Target Partner</span>
            </div>
            {renderHorizontalSection(target as any[], 'target', targetLoading, targetError, 'Lifestyle Products', <div className="text-4xl">🏠</div>)}
          </section>

          {/* OpenTable Restaurants Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                <Utensils className="h-6 w-6" />
                Restaurants Near You
                {hasLocation && (
                  <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    📍 {locationString}
                  </span>
                )}
              </h2>
              <span className="text-sm bg-red-600 text-white px-3 py-1 rounded-full">OpenTable Partner</span>
            </div>
            {renderHorizontalSection(restaurants as any[], 'restaurant', restaurantsLoading, restaurantsError, 'Great Restaurants', <Utensils className="w-12 h-12 text-white/60" />)}
          </section>

          {/* Expedia Travel Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                <MapPin className="h-6 w-6" />
                Travel & Hotels
              </h2>
              <span className="text-sm bg-yellow-600 text-white px-3 py-1 rounded-full">Expedia Partner</span>
            </div>
            {renderHorizontalSection(travel as any[], 'travel', travelLoading, travelError, 'Amazing Destinations', <MapPin className="w-12 h-12 text-white/60" />)}
          </section>
        </div>
      </div>
    </div>
  );
}