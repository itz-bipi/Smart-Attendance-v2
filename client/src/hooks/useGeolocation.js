import { useState, useCallback } from 'react';

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLocation = useCallback(() => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return Promise.reject(new Error('Geolocation not supported'));
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          setLocation(coords);
          setLoading(false);
          resolve(coords);
        },
        (err) => {
          console.warn('Geolocation error:', err.message);
          // If denied, provide fallback classroom coordinates so demo/testing works smoothly
          const fallbackCoords = {
            latitude: 28.6139,
            longitude: 77.2090,
            accuracy: 10,
            isFallback: true,
          };
          setLocation(fallbackCoords);
          setError(`Using default classroom coordinates (${err.message})`);
          setLoading(false);
          resolve(fallbackCoords);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }, []);

  return { location, loading, error, getLocation };
};

export default useGeolocation;
