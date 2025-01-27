import { useState, useMemo, useEffect } from 'react';
import ReactGA from 'react-ga4';
import BusinessList from './components/BusinessList';
import BusinessModal from './components/BusinessModal';
import LocationSearch from './components/LocationSearch';
import BusinessFilters from './components/BusinessFilters';
import Map from './components/Map';
import businessData from './data/businesses.json';
import './App.css';

// Dallas coordinates (default fallback)
const DALLAS_COORDINATES = [32.7767, -96.7970];

function App() {
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [businesses, setBusinesses] = useState([]); 
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [mapCenter, setMapCenter] = useState(DALLAS_COORDINATES);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mapZoom, setMapZoom] = useState(13);

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    
    if ("geolocation" in navigator) {
      const requestLocation = async () => {
        try {
          const permission = await navigator.permissions.query({ name: 'geolocation' });
          
          if (permission.state === 'granted' || permission.state === 'prompt') {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                // Track successful location access
                ReactGA.event({
                  category: "Location",
                  action: "Auto-Location Success"
                });

                const coords = [position.coords.latitude, position.coords.longitude];
                
                // Get location name from coordinates
                try {
                  const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[0]}&lon=${coords[1]}`
                  );
                  const data = await response.json();
                  
                  // Find nearby businesses
                  const nearbyBusinesses = businessData.businesses.map(business => ({
                    ...business,
                    distance: calculateDistance(
                      coords[0],
                      coords[1],
                      business.coordinates[0],
                      business.coordinates[1]
                    )
                  })).filter(business => business.distance <= 20);

                  if (nearbyBusinesses.length > 0) {
                    // Sort by distance to find closest business
                    nearbyBusinesses.sort((a, b) => a.distance - b.distance);
                    const closestBusiness = nearbyBusinesses[0];
                    
                    setMapCenter(closestBusiness.coordinates);
                    setMapZoom(15);
                    setBusinesses(nearbyBusinesses);
                    setLocation(data.address?.city || data.address?.town || 'your location');
                  } else {
                    setMapCenter(coords);
                    setMapZoom(13);
                    setError('No businesses found in your area');
                  }
                } catch (err) {
                  console.error('Reverse geocoding error:', err);
                  setMapCenter(coords);
                }
              },
              (err) => {
                // Track location errors with more specific categories
                ReactGA.event({
                  category: "Error",
                  action: "Location Error",
                  label: `Code: ${err.code} - ${err.message}`
                });

                // More user-friendly error messages
                let userMessage = 'Unable to get your location. ';
                switch (err.code) {
                  case err.PERMISSION_DENIED:
                    userMessage += 'Please enable location access or enter your location manually.';
                    break;
                  case err.POSITION_UNAVAILABLE:
                    userMessage += 'Location information is unavailable. Please try again or enter your location manually.';
                    break;
                  case err.TIMEOUT:
                    userMessage += 'Location request timed out. Please check your connection and try again.';
                    break;
                  default:
                    userMessage += 'Please enter your location manually.';
                }
                setError(userMessage);
                console.warn('Geolocation error:', err);
              },
              {
                enableHighAccuracy: true,
                timeout: 15000, // Increased to 15 seconds
                maximumAge: 30000 // Cache location for 30 seconds
              }
            );
          } else if (permission.state === 'denied') {
            setError('Location access was denied. Please enter your location manually.');
          }
        } catch (err) {
          console.warn('Permission query error:', err);
          setError('Unable to access location services. Please enter your location manually.');
        }
      };

      requestLocation();
    } else {
      setError('Your browser does not support geolocation. Please enter your location manually.');
    }
  }, []);

  // Calculate distance between two points using Haversine formula
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

  // Get filtered businesses based on selected categories
  const filteredBusinesses = useMemo(() => {
    if (selectedCategories.length === 0) {
      return businesses;
    }
    return businesses.filter(business => 
      selectedCategories.includes(business.category)
    );
  }, [businesses, selectedCategories]);

  const handleSearch = async (searchLocation) => {
    setIsLoading(true);
    setError('');

    try {
      if (!searchLocation.trim()) {
        setError('Please enter a location');
        setBusinesses([]);
        return;
      }

      // Track search event
      ReactGA.event({
        category: "Search",
        action: "Location Search",
        label: searchLocation
      });

      // Check if input is a zip code (5 digits)
      const isZipCode = /^\d{5}$/.test(searchLocation.trim());
      const searchQuery = isZipCode ? 
        `postalcode=${searchLocation}` : 
        `q=${encodeURIComponent(searchLocation)}`;

      // Geocode the entered location
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&${searchQuery}&countrycodes=us`
      );
      const data = await response.json();

      if (data.length === 0) {
        setError('Location not found. Please enter a valid US location or zip code.');
        return;
      }

      // Get the searched location coordinates
      const { lat, lon, display_name } = data[0];
      const searchCoords = [parseFloat(lat), parseFloat(lon)];

      // Filter businesses by distance and find the closest one
      const locationFiltered = businessData.businesses.map(business => ({
        ...business,
        distance: calculateDistance(
          searchCoords[0],
          searchCoords[1],
          business.coordinates[0],
          business.coordinates[1]
        )
      })).filter(business => business.distance <= 20); // 20 miles radius

      if (locationFiltered.length > 0) {
        // Sort by distance to find closest business
        locationFiltered.sort((a, b) => a.distance - b.distance);
        const closestBusiness = locationFiltered[0];
        
        // Set map center to the closest business
        setMapCenter(closestBusiness.coordinates);
        setMapZoom(15); // Zoom in closer to show the business

        // Track successful search with results
        ReactGA.event({
          category: "Search",
          action: "Found Businesses",
          label: searchLocation,
          value: locationFiltered.length
        });
      } else {
        // If no businesses found, center on searched location
        setMapCenter(searchCoords);
        setMapZoom(isZipCode ? 14 : 12);

        // Track search with no results
        ReactGA.event({
          category: "Search",
          action: "No Results",
          label: searchLocation
        });
      }

      setLocation(isZipCode ? `ZIP ${searchLocation}` : display_name);
      setBusinesses(locationFiltered);
      
      if (locationFiltered.length === 0) {
        setError('No businesses found in this area');
      }
    } catch (err) {
      // Track search errors
      ReactGA.event({
        category: "Error",
        action: "Search Error",
        label: err.message
      });
      setError('Error finding location. Please try again.');
      console.error('Geocoding error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (categories) => {
    // Track filter changes
    ReactGA.event({
      category: "Filter",
      action: "Category Filter",
      label: categories.join(", ")
    });
    setSelectedCategories(categories);
  };

  const handleBusinessClick = (business) => {
    // Track business clicks
    ReactGA.event({
      category: "Business",
      action: "View Business",
      label: business.name
    });
    setSelectedBusiness(business);
  };

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
                  ? `Businesses in ${location}`
                  : `No businesses found in ${location}`
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

export default App;