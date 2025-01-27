import { useState } from 'react';

function BusinessFilters({ onFilterChange }) {
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Static categories
  const staticCategories = [
    'Food & Beverage',
    'Health & Wellness',
    'Retail & Fashion',
    'Automotive',
    'Home Services'
  ];

  const handleCategoryChange = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(updatedCategories);
    onFilterChange(updatedCategories);
  };

  return (
    <div className="filter-section">
      <div className="filter-options">
        {staticCategories.map(category => (
          <label key={category} className="filter-option">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryChange(category)}
            />
            <span>{category}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default BusinessFilters;