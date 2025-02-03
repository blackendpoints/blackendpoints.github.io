import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix marker icon paths
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Create a blue marker for user location
const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: '<div class="user-location-dot"></div><div class="user-location-pulse"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

// Function to get maps URL based on device
export const getMapsUrl = (address, latitude, longitude) => {
  // Check if device is iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  if (isIOS) {
    // Apple Maps URL format
    return `maps://maps.apple.com/?q=${encodeURIComponent(address)}&ll=${latitude},${longitude}`;
  } else {
    // Google Maps URL format
    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  }
};

// This component updates the map view when center or zoom props change
function ChangeView({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
}

function Map({ center, zoom, businesses, onBusinessClick }) {
  if (!businesses || businesses.length === 0) {
    return (
      <div className="map-container">
        <MapContainer 
          center={center} 
          zoom={zoom} 
          style={{ height: '100%', width: '100%' }}
          attributionControl={false}
        >
          <ChangeView center={center} zoom={zoom} />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
            maxZoom={19}
          />
          <Marker position={center} icon={userLocationIcon}>
            <Popup>Your approximate location</Popup>
          </Marker>
        </MapContainer>
      </div>
    );
  }

  return (
    <div className="map-container">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        attributionControl={false}
      >
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        {/* Add user location marker */}
        <Marker position={center} icon={userLocationIcon}>
          <Popup>Your approximate location</Popup>
        </Marker>
        {businesses.map(business => (
          <Marker 
            key={business.id} 
            position={[business.latitude, business.longitude]}
            icon={defaultIcon}
          >
            <Popup>
              <div className="map-popup">
                <h3>{business.name}</h3>
                <p className="popup-category">{business.category}</p>
                <a 
                  href={getMapsUrl(business.location, business.latitude, business.longitude)}
                  className="popup-address"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {business.location}
                </a>
                <button 
                  className="popup-details-btn"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent popup from closing
                    onBusinessClick(business);
                  }}
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;