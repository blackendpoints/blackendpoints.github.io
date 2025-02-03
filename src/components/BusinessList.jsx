import { getMapsUrl } from './Map';

function BusinessList({ businesses, onBusinessClick }) {
  if (!businesses || businesses.length === 0) return null;

  // Group businesses by category
  const groupedBusinesses = businesses.reduce((acc, business) => {
    if (!acc[business.category]) {
      acc[business.category] = [];
    }
    acc[business.category].push(business);
    return acc;
  }, {});

  // Sort categories alphabetically
  const sortedCategories = Object.keys(groupedBusinesses).sort();

  return (
    <div className="business-sections">
      {sortedCategories.map(category => (
        <div key={category} className="business-section">
          <h2 className="category-title">{category}</h2>
          <div className="business-grid">
            {groupedBusinesses[category].map(business => (
              <div 
                key={business.id}
                className="business-card"
              >
                <img 
                  src={business.image_url || 'https://via.placeholder.com/400x200?text=No+Image'} 
                  alt={business.name}
                  className="business-image"
                  onClick={() => onBusinessClick(business)}
                />
                <div className="business-info">
                  <h3 onClick={() => onBusinessClick(business)}>{business.name}</h3>
                  <a 
                    href={getMapsUrl(business.location, business.latitude, business.longitude)}
                    className="business-address"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {business.location}
                  </a>
                  <button 
                    className="view-details-btn"
                    onClick={() => onBusinessClick(business)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default BusinessList;