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
          style={{ height: '400px', width: '100%' }}
          attributionControl={false}
        >
          <ChangeView center={center} zoom={zoom} />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        </MapContainer>
      </div>
    );
  }

  return (
    <div className="map-container">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '400px', width: '100%' }}
        attributionControl={false}
      >
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        {businesses.map(business => (
          <Marker 
            key={business.id} 
            position={[business.latitude, business.longitude]}
            icon={defaultIcon}
            eventHandlers={{
              click: () => onBusinessClick(business)
            }}
          >
            <Popup>
              <div className="popup-content">
                <h3>{business.name}</h3>
                <p>{business.category}</p>
                <p>{business.location}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;