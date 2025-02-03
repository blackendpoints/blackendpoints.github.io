import { useState, useMemo, useEffect } from 'react';
import ReactGA from 'react-ga4';
import BusinessList from '../components/BusinessList';
import BusinessModal from '../components/BusinessModal';
import LocationSearch from '../components/LocationSearch';
import BusinessFilters from '../components/BusinessFilters';
import Map from '../components/Map';
import { supabase } from '../lib/supabase';

// Dallas coordinates (default fallback)
const DALLAS_COORDINATES = [32.7767, -96.7970];

// Privacy radius in kilometers
const PRIVACY_RADIUS = 0.5; // 500 meters

function Home() {
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [businesses, setBusinesses] = useState([]); 
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [mapCenter, setMapCenter] = useState(DALLAS_COORDINATES);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mapZoom, setMapZoom] = useState(13);
  const [searchQuery, setSearchQuery] = useState('');

  const addPrivacyOffset = (lat, lon) => {
    const radiusLat = PRIVACY_RADIUS / 111;
    const radiusLon = PRIVACY_RADIUS / (111 * Math.cos(lat * Math.PI / 180));

    const randomAngle = Math.random() * 2 * Math.PI;
    const randomDistance = Math.random() * PRIVACY_RADIUS;

    const offsetLat = (randomDistance / 111) * Math.cos(randomAngle);
    const offsetLon = (randomDistance / (111 * Math.cos(lat * Math.PI / 180))) * Math.sin(randomAngle);

    return [
      lat + offsetLat,
      lon + offsetLon
    ];
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3959;
    const toRad = value => value * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const findNearbyBusinesses = async (latitude, longitude) => {
    try {
      const milesPerDegree = 69;
      const deltaLat = 20 / milesPerDegree;
      const deltaLon = 20 / (milesPerDegree * Math.cos(latitude * Math.PI / 180));

      const { data: businessesData, error: supabaseError } = await supabase
        .from('businesses')
        .select('*')
        .gte('latitude', latitude - deltaLat)
        .lte('latitude', latitude + deltaLat)
        .gte('longitude', longitude - deltaLon)
        .lte('longitude', longitude + deltaLon);

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        throw supabaseError;
      }

      if (!businessesData) {
        setBusinesses([]);
        setError('No businesses found in this area');
        return;
      }

      const nearbyBusinesses = businessesData.filter(business => {
        const distance = calculateDistance(
          latitude,
          longitude,
          business.latitude,
          business.longitude
        );
        return distance <= 20;
      });

      const [privacyLat, privacyLon] = addPrivacyOffset(latitude, longitude);
      
      setBusinesses(nearbyBusinesses);
      
      if (nearbyBusinesses.length > 0) {
        setMapCenter([privacyLat, privacyLon]);
        setMapZoom(11);
        setError('');
      } else {
        setError('No businesses found within 20 miles of this location');
        setMapCenter([privacyLat, privacyLon]);
        setMapZoom(10);
      }
    } catch (err) {
      console.error('Error fetching businesses:', err);
      setError('Error loading businesses. Please try again.');
      setBusinesses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindMyLocation = () => {
    if (!("geolocation" in navigator)) {
      setError('Your browser does not support location services. Please enter your location manually.');
      return;
    }

    setIsLoading(true);
    setError('');
    setBusinesses([]);

    const geolocationOptions = {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        ReactGA.event({
          category: "Location",
          action: "Find My Location Success"
        });

        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );
          
          if (!response.ok) {
            throw new Error('Failed to get location name');
          }
          
          const data = await response.json();
          setLocation(data.address?.city || data.address?.town || 'your area');
          
          await findNearbyBusinesses(latitude, longitude);
        } catch (err) {
          console.error('Error:', err);
          setError('Error determining your location. Please try again or enter your location manually.');
          setIsLoading(false);
        }
      },
      (err) => {
        ReactGA.event({
          category: "Error",
          action: "Location Error",
          label: `Code: ${err.code} - ${err.message}`
        });

        console.warn('Geolocation error:', err);
        let errorMessage = 'Error getting your location. Please try entering it manually.';
        
        if (err.code === 1) {
          errorMessage = 'Location access was denied. Please allow location access or enter your location manually.';
        } else if (err.code === 2) {
          errorMessage = 'Unable to determine your location. Please try entering it manually.';
        } else if (err.code === 3) {
          errorMessage = 'Location request timed out. Please try again or enter your location manually.';
        }
        
        setError(errorMessage);
        setIsLoading(false);
      },
      geolocationOptions
    );
  };

  useEffect(() => {
    const handleFindLocation = () => {
      handleFindMyLocation();
    };

    window.addEventListener('findMyLocation', handleFindLocation);

    return () => {
      window.removeEventListener('findMyLocation', handleFindLocation);
    };
  }, []);

  const handleSearch = async (searchLocation) => {
    setIsLoading(true);
    setError('');
    setBusinesses([]);

    try {
      if (!searchLocation.trim()) {
        setError('Please enter a location');
        setIsLoading(false);
        return;
      }

      ReactGA.event({
        category: "Search",
        action: "Location Search",
        label: searchLocation
      });

      const isZipCode = /^\d{5}$/.test(searchLocation.trim());
      const searchQuery = isZipCode ? 
        `postalcode=${searchLocation}` : 
        `q=${encodeURIComponent(searchLocation)}`;

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&${searchQuery}&countrycodes=us`
      );
      
      if (!response.ok) {
        throw new Error('Failed to search location');
      }
      
      const data = await response.json();

      if (data.length === 0) {
        setError('Location not found. Please enter a valid US location or zip code.');
        setIsLoading(false);
        return;
      }

      const { lat, lon, display_name } = data[0];
      setLocation(isZipCode ? `area ${searchLocation}` : display_name.split(',')[0]);
      
      await findNearbyBusinesses(parseFloat(lat), parseFloat(lon));
    } catch (err) {
      ReactGA.event({
        category: "Error",
        action: "Search Error",
        label: err.message
      });
      setError('Error finding location. Please try again.');
      console.error('Error:', err);
      setIsLoading(false);
    }
  };

  const handleBusinessSearch = async (query) => {
    setIsLoading(true);
    setError('');
    setSearchQuery(query.toLowerCase().trim());

    try {
      const { data: businessesData, error: supabaseError } = await supabase
        .from('businesses')
        .select('*')
        .or(`name.ilike.%${query}%,category.ilike.%${query}%,description.ilike.%${query}%`);

      if (supabaseError) {
        throw supabaseError;
      }

      if (!businessesData || businessesData.length === 0) {
        setError('No businesses found matching your search.');
        setBusinesses([]);
      } else {
        setBusinesses(businessesData);
        
        const avgLat = businessesData.reduce((sum, b) => sum + b.latitude, 0) / businessesData.length;
        const avgLng = businessesData.reduce((sum, b) => sum + b.longitude, 0) / businessesData.length;
        
        setMapCenter([avgLat, avgLng]);
        setMapZoom(11);
        setLocation('search results');
      }
    } catch (err) {
      console.error('Error searching businesses:', err);
      setError('Error searching businesses. Please try again.');
      setBusinesses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (categories) => {
    ReactGA.event({
      category: "Filter",
      action: "Category Filter",
      label: categories.join(", ")
    });
    setSelectedCategories(categories);
  };

  const handleBusinessClick = (business) => {
    ReactGA.event({
      category: "Business",
      action: "View Business",
      label: business.name
    });
    setSelectedBusiness(business);
  };

  const filteredBusinesses = useMemo(() => {
    let filtered = businesses;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(business => 
        selectedCategories.includes(business.category)
      );
    }

    return filtered;
  }, [businesses, selectedCategories, searchQuery]);

  return (
    <>
      <header className="header">
        <h1>BlackEndpoints</h1>
        <p>Discover and support local Black-owned businesses in your area</p>
      </header>

      <main className="main">
        <LocationSearch 
          onSearch={handleSearch}
          onBusinessSearch={handleBusinessSearch}
          error={error}
        />

        <BusinessFilters 
          onFilterChange={handleFilterChange}
        />

        <Map 
          center={mapCenter}
          zoom={mapZoom}
          businesses={filteredBusinesses}
          onBusinessClick={handleBusinessClick}
        />

        {isLoading ? (
          <div className="loading">Loading businesses...</div>
        ) : (
          <>
            {location && (
              <h2 className="results-title">
                {filteredBusinesses.length > 0 
                  ? searchQuery
                    ? `Found ${filteredBusinesses.length} business${filteredBusinesses.length === 1 ? '' : 'es'} matching "${searchQuery}"`
                    : `Businesses near ${location}`
                  : searchQuery
                    ? `No businesses found matching "${searchQuery}"`
                    : `No businesses found near ${location}`
                }
              </h2>
            )}

            <BusinessList 
              businesses={filteredBusinesses}
              onBusinessClick={handleBusinessClick}
            />
          </>
        )}

        {selectedBusiness && (
          <BusinessModal 
            business={selectedBusiness}
            onClose={() => setSelectedBusiness(null)}
          />
        )}
      </main>
    </>
  );
}

export default Home;