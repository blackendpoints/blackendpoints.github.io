import { getMapsUrl } from './Map';

function BusinessModal({ business, onClose }) {
  if (!business) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        {business.image_url && (
          <img 
            src={business.image_url} 
            alt={business.name}
            className="modal-image"
          />
        )}
        
        <div className="modal-details">
          <h2>{business.name}</h2>
          <div className="category-badge">{business.category}</div>
          
          {business.description && (
            <p className="description">{business.description}</p>
          )}
          
          <div className="info-section">
            <h3>Location & Contact</h3>
            <div className="info-grid">
              <div className="info-item">
                <strong>Address</strong>
                <p>
                  <a 
                    href={getMapsUrl(business.location, business.latitude, business.longitude)}
                    className="contact-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {business.location}
                  </a>
                </p>
              </div>
              
              {business.phone && (
                <div className="info-item">
                  <strong>Phone</strong>
                  <p>
                    <a href={`tel:${business.phone}`} className="contact-link">
                      {business.phone}
                    </a>
                  </p>
                </div>
              )}
              
              {business.email && (
                <div className="info-item">
                  <strong>Email</strong>
                  <p>
                    <a href={`mailto:${business.email}`} className="contact-link">
                      {business.email}
                    </a>
                  </p>
                </div>
              )}
              
              {business.website && (
                <div className="info-item">
                  <strong>Website</strong>
                  <p>
                    <a 
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-link"
                    >
                      Visit Website
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>

          {business.hours && (
            <div className="info-section">
              <h3>Business Hours</h3>
              <p className="hours">{business.hours}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BusinessModal;