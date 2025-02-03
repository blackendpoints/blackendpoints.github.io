import { useState } from 'react';
import { memo } from 'react';

const AddBusinessButton = memo(function AddBusinessButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    phone: '',
    email: '',
    website: '',
    hours: '',
    category: '',
    description: '',
    imageUrl: ''
  });

  const [showErrors, setShowErrors] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    'Food',
    'Hair Care',
    'Retail',
    'Professional Services',
    'Home Services',
    'Technology'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = true;
    }

    if (!formData.category) {
      newErrors.category = true;
    }

    if (!formData.location.trim()) {
      newErrors.location = true;
    }

    if (formData.phone.trim() && !/^\d{3}-\d{3}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = true;
    }

    if (!formData.email.trim()) {
      newErrors.email = true;
    } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = true;
    }

    if (formData.website && !/^https?:\/\/.*/.test(formData.website)) {
      newErrors.website = true;
    }

    if (formData.imageUrl && !/^https?:\/\/.*/.test(formData.imageUrl)) {
      newErrors.imageUrl = true;
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    setErrors(newErrors);
    setShowErrors(true);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const imageUrl = formData.imageUrl.trim() || 
      `https://placehold.co/600x400/cccccc/333333?text=${encodeURIComponent(formData.name)}`;

    const emailBody = `
Name: ${formData.name}
Category: ${formData.category}
Description: ${formData.description}
Location: ${formData.location}
Phone: ${formData.phone}
Email: ${formData.email}
Website: ${formData.website}
Hours: ${formData.hours}
Image URL: ${imageUrl}
    `.trim();

    const mailtoLink = `mailto:blackendpoints@gmail.com?subject=NEW BUSINESS REQUEST FOR ${formData.name}!! ${formattedDate} ${formattedTime}&body=${encodeURIComponent(emailBody)}`;
    
    window.location.href = mailtoLink;

    setFormData({
      name: '',
      location: '',
      phone: '',
      email: '',
      website: '',
      hours: '',
      category: '',
      description: '',
      imageUrl: ''
    });
    setShowErrors(false);
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 10) {
        let formatted = cleaned;
        if (cleaned.length >= 3) {
          formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
        }
        if (cleaned.length >= 6) {
          formatted = `${formatted.slice(0, 7)}-${formatted.slice(7)}`;
        }
        setFormData(prev => ({
          ...prev,
          [name]: formatted
        }));
        return;
      }
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="add-business-btn"
        aria-label="Add your business"
      >
        Add Your Business
      </button>

      {isModalOpen && (
        <div 
          className="modal-overlay" 
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div 
            className="modal-content add-business-modal" 
            onClick={e => e.stopPropagation()}
          >
            <button 
              className="modal-close"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close modal"
            >
              ×
            </button>
            
            <div className="modal-details">
              <h2 id="modal-title">Add Your Business</h2>
              <p className="modal-subtitle">List your business in our directory</p>
              
              <form onSubmit={handleSubmit} className="add-business-form" noValidate>
                <div className="form-group">
                  <label htmlFor="name">Business Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={showErrors && errors.name ? 'error' : ''}
                    required
                    aria-required="true"
                    aria-invalid={showErrors && errors.name ? 'true' : 'false'}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={showErrors && errors.category ? 'error' : ''}
                    required
                    aria-required="true"
                    aria-invalid={showErrors && errors.category ? 'true' : 'false'}
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Full address"
                    className={showErrors && errors.location ? 'error' : ''}
                    required
                    aria-required="true"
                    aria-invalid={showErrors && errors.location ? 'true' : 'false'}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="000-000-0000"
                    className={showErrors && errors.phone ? 'error' : ''}
                    aria-invalid={showErrors && errors.phone ? 'true' : 'false'}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contact@business.com"
                    className={showErrors && errors.email ? 'error' : ''}
                    required
                    aria-required="true"
                    aria-invalid={showErrors && errors.email ? 'true' : 'false'}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="website">Website</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className={showErrors && errors.website ? 'error' : ''}
                    aria-invalid={showErrors && errors.website ? 'true' : 'false'}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="hours">Business Hours</label>
                  <input
                    type="text"
                    id="hours"
                    name="hours"
                    value={formData.hours}
                    onChange={handleChange}
                    placeholder="Mon-Fri: 9AM-5PM, Sat: 10AM-3PM"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Business Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tell us about your business..."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="imageUrl">Image URL</label>
                  <input
                    type="url"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className={showErrors && errors.imageUrl ? 'error' : ''}
                    aria-invalid={showErrors && errors.imageUrl ? 'true' : 'false'}
                  />
                </div>

                <button 
                  type="submit" 
                  className="submit-button"
                >
                  Submit Business
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default AddBusinessButton;