function BusinessModal({ business, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <img 
          src={business.imageUrl} 
          alt={business.name}
          className="modal-image"
        />
        
        <div className="modal-details">
          <h2>{business.name}</h2>
          <p className="category">{business.category}</p>
          <p className="description">{business.description}</p>
          
          <div className="contact-info">
            <p><strong>Address:</strong> {business.location}</p>
            <p><strong>Phone:</strong> {business.phone}</p>
            <p><strong>Email:</strong> {business.email}</p>
            {business.website && (
              <p>
                <strong>Website:</strong>{' '}
                <a 
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="website-link"
                >{business.website}</a>
              </p>
            )}
          </div>

          <div className="business-hours">
            <h3>Business Hours</h3>
            <p>{business.hours}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessModal;