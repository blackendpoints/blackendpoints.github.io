import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { icon } from 'leaflet';

// Custom minimal marker icon
const defaultIcon = icon({
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
  return (
    <div className="map-container">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        zoomControl={false} // Hide zoom controls for cleaner look
      >
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={19}
        />
        {businesses.map(business => (
          <Marker 
            key={business.id} 
            position={business.coordinates}
            icon={defaultIcon}
            eventHandlers={{
              click: () => onBusinessClick(business)
            }}
          >
            <Popup className="custom-popup">
              <div 
                onClick={() => onBusinessClick(business)} 
                style={{ 
                  cursor: 'pointer',
                  padding: '8px 4px'
                }}
              >
                <strong style={{ 
                  display: 'block',
                  marginBottom: '4px',
                  color: '#333'
                }}>
                  {business.name}
                </strong>
                <span style={{ 
                  display: 'block',
                  fontSize: '0.9em',
                  color: '#666'
                }}>
                  {business.category}
                </span>
                <span style={{ 
                  display: 'block',
                  fontSize: '0.9em',
                  color: '#666'
                }}>
                  {business.location}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;