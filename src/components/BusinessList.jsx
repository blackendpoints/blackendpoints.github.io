function BusinessList({ businesses, onBusinessClick }) {
  if (!businesses || businesses.length === 0) return null;

  return (
    <div className="business-grid">
      {businesses.map(business => (
        <div 
          key={business.id}
          className="business-card"
          onClick={() => onBusinessClick(business)}
        >
          <img 
            src={business.image_url || 'https://via.placeholder.com/400x200?text=No+Image'} 
            alt={business.name}
            className="business-image"
          />
          <div className="business-info">
            <h3>{business.name}</h3>
            <p>{business.category}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BusinessList;