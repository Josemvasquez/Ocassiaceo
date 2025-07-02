import { useState, useCallback } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  state: string | null;
  error: string | null;
  loading: boolean;
}

interface GeolocationHook extends GeolocationState {
  getLocation: () => Promise<void>;
  locationString: string;
  hasLocation: boolean;
}

export function useGeolocation(): GeolocationHook {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    city: null,
    state: null,
    error: null,
    loading: false,
  });

  const getLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser',
        loading: false,
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // 5 minutes
          }
        );
      });

      const { latitude, longitude } = position.coords;

      // Reverse geocoding to get city and state
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        
        if (response.ok) {
          const data = await response.json();
          setState(prev => ({
            ...prev,
            latitude,
            longitude,
            city: data.city || data.locality || null,
            state: data.principalSubdivision || data.region || null,
            loading: false,
            error: null,
          }));
        } else {
          // If reverse geocoding fails, still save coordinates
          setState(prev => ({
            ...prev,
            latitude,
            longitude,
            loading: false,
            error: null,
          }));
        }
      } catch (geocodeError) {
        // If reverse geocoding fails, still save coordinates
        setState(prev => ({
          ...prev,
          latitude,
          longitude,
          loading: false,
          error: null,
        }));
      }
    } catch (error: any) {
      let errorMessage = 'Unable to get your location';
      
      if (error.code) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions in your browser.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
          default:
            errorMessage = 'An unknown error occurred while getting location.';
        }
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, []);

  const locationString = state.city && state.state 
    ? `${state.city}, ${state.state}`
    : state.city || state.state || '';

  const hasLocation = state.latitude !== null && state.longitude !== null;

  return {
    ...state,
    getLocation,
    locationString,
    hasLocation,
  };
}