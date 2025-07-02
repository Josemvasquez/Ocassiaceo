import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Loader2, AlertCircle, Navigation } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LocationSelectorProps {
  onLocationChange: (location: string, coordinates?: { lat: number; lng: number }) => void;
  defaultLocation?: string;
  placeholder?: string;
}

export default function LocationSelector({ 
  onLocationChange, 
  defaultLocation = "",
  placeholder = "Enter city or location"
}: LocationSelectorProps) {
  const [manualLocation, setManualLocation] = useState(defaultLocation);
  const [isUsingGeolocation, setIsUsingGeolocation] = useState(false);
  const { 
    latitude, 
    longitude, 
    city, 
    state, 
    error, 
    loading, 
    getLocation, 
    locationString,
    hasLocation 
  } = useGeolocation();

  // Update parent when geolocation is obtained
  useEffect(() => {
    if (hasLocation && isUsingGeolocation) {
      const coordinates = { lat: latitude!, lng: longitude! };
      onLocationChange(locationString, coordinates);
      setManualLocation(locationString);
    }
  }, [hasLocation, locationString, isUsingGeolocation, latitude, longitude, onLocationChange]);

  const handleUseCurrentLocation = async () => {
    setIsUsingGeolocation(true);
    await getLocation();
  };

  const handleManualLocationChange = (value: string) => {
    setManualLocation(value);
    setIsUsingGeolocation(false);
    onLocationChange(value);
  };

  const handleManualLocationSubmit = () => {
    if (manualLocation.trim()) {
      setIsUsingGeolocation(false);
      onLocationChange(manualLocation.trim());
    }
  };

  return (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-soft-blue" />
            <h3 className="font-medium text-primary">Location</h3>
          </div>

          {/* Current Location Button */}
          <div className="flex gap-2">
            <Button
              onClick={handleUseCurrentLocation}
              disabled={loading}
              variant="outline"
              className="flex items-center gap-2 border-soft-blue/20 text-soft-blue hover:bg-very-soft-blue"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4" />
              )}
              {loading ? 'Getting location...' : 'Use Current Location'}
            </Button>
            
            {hasLocation && isUsingGeolocation && (
              <div className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <MapPin className="h-3 w-3" />
                {locationString}
              </div>
            )}
          </div>

          {/* Manual Location Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary">
              Or enter location manually
            </label>
            <div className="flex gap-2">
              <Input
                placeholder={placeholder}
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleManualLocationSubmit()}
                className="flex-1"
              />
              <Button
                onClick={handleManualLocationSubmit}
                disabled={!manualLocation.trim()}
                className="bg-soft-blue hover:bg-soft-blue/90 text-white"
              >
                Set
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error} You can still enter your location manually above.
              </AlertDescription>
            </Alert>
          )}

          {/* Location Info */}
          {hasLocation && (
            <div className="text-xs text-secondary bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Coordinates:</span>
                <span className="font-mono">{latitude?.toFixed(4)}, {longitude?.toFixed(4)}</span>
              </div>
              {city && state && (
                <div className="flex justify-between items-center mt-1">
                  <span>Address:</span>
                  <span>{city}, {state}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}