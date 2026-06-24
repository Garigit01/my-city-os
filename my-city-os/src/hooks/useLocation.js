import { useState, useEffect } from 'react';

// Default mock coordinates for the city center (Connaught Place, New Delhi)
const MOCK_LOCATION = {
  latitude: 28.6129,
  longitude: 77.2295,
  address: "Radial Road 4, Connaught Place, New Delhi, Delhi 110001",
  accuracy: 15
};

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAddressFromCoords = async (lat, lon) => {
    // Return mock city addresses based on latitude variance for realism
    const sector = Math.floor((lat + lon) * 100) % 5;
    const sectors = [
      "Sec 4, Inner Circle, Connaught Place, New Delhi",
      "Parliament Street Area, Sansad Marg, New Delhi",
      "Barakhamba Rd near Metro Station, New Delhi",
      "Janpath Market, Tolstoy Marg Cross, New Delhi",
      "Kasturba Gandhi Marg, Near British Council, New Delhi"
    ];
    return sectors[sector] || MOCK_LOCATION.address;
  };

  const captureLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      // Fallback to mock
      setTimeout(async () => {
        const addr = await getAddressFromCoords(MOCK_LOCATION.latitude, MOCK_LOCATION.longitude);
        setLocation({ ...MOCK_LOCATION, address: addr });
        setLoading(false);
      }, 800);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const address = await getAddressFromCoords(latitude, longitude);
        setLocation({
          latitude,
          longitude,
          address,
          accuracy
        });
        setLoading(false);
      },
      async (err) => {
        console.warn("Geolocation access denied or failed, using mock city location.", err);
        setError("Location access denied. Using mock location.");
        // Fallback to mock
        const addr = await getAddressFromCoords(MOCK_LOCATION.latitude, MOCK_LOCATION.longitude);
        setLocation({ ...MOCK_LOCATION, address: addr });
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  return { location, loading, error, captureLocation };
};
