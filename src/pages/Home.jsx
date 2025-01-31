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

function Home() {
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [businesses, setBusinesses] = useState([]); 
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [mapCenter, setMapCenter] = useState(DALLAS_COORDINATES);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapZoom, setMapZoom] = useState(13);
  const [hasRequestedLocation, setHasRequestedLocation] = useState(false);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3959; // Earth's radius in miles
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
      const { data: businessesData, error } = await supabase
        .from('businesses')
        .select('*');

      if (error) throw error;

      if (businessesData) {
        const nearbyBusinesses = businessesData.filter(business => 
          calculateDistance(
            latitude,
            longitude,
            business.latitude,
            business.longitude
          ) <= 20
        );

        setBusinesses(nearbyBusinesses);
        
        if (nearbyBusinesses.length > 0) {
          setMapCenter([latitude, longitude]);
          setMapZoom(11);
        } else {
          setError('No businesses found within your location');
          setMapCenter([latitude, longitude]);
          setMapZoom(11);
        }
      }
    } catch (err) {
      console.error('Error fetching businesses:', err);
      setError('Error loading businesses');
    } finally {
      setIsLoading(false);
    }
  };

  // Request location once on initial load
  useEffect(() => {
    if (!hasRequestedLocation && "geolocation" in navigator) {
      setHasRequestedLocation(true);
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          ReactGA.event({
            category: "Location",
            action: "Auto-Location Success"
          });

          const { latitude, longitude } = position.coords;
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            setLocation(data.address?.city || data.address?.town || 'your location');
            
            await findNearbyBusinesses(latitude, longitude);
          } catch (err) {
            console.error('Error:', err);
            setError('Error determining your location');
            setIsLoading(false);
          }
        },
        (err) => {
          ReactGA.event({
            category: "Error",
            action: "Location Error",
            label: `Code: ${err.code} - ${err.message}`
          });

          setIsLoading(false);
          setError('Please enter your location manually to find nearby businesses');
          console.warn('Geolocation error:', err);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else if (!("geolocation" in navigator)) {
      setIsLoading(false);
      setError('Your browser does not support location services. Please enter your location manually.');
    }
  }, [hasRequestedLocation]);

  const handleSearch = async (searchLocation) => {
    setIsLoading(true);
    setError('');

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
      const data = await response.json();

      if (data.length === 0) {
        setError('Location not found. Please enter a valid US location or zip code.');
        setIsLoading(false);
        return;
      }

      const { lat, lon, display_name } = data[0];
      setLocation(isZipCode ? `zip code ${searchLocation}` : display_name);
      
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
    if (selectedCategories.length === 0) {
      return businesses;
    }
    return businesses.filter(business => 
      selectedCategories.includes(business.category)
    );
  }, [businesses, selectedCategories]);

  return (
    <div className="app">
      <header className="header">
        <h1>BlackEndpoints</h1>
        <p>Discover and support local Black-owned businesses in your area</p>
      </header>

      <main className="main">
        <LocationSearch 
          onSearch={handleSearch}
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
                  ? `Businesses within ${location}`
                  : `No businesses found within ${location}`
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
    </div>
  );
}

export default Home;