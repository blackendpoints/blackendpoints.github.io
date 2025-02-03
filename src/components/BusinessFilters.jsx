import { useState } from 'react';

function BusinessFilters({ onFilterChange }) {
  const [selectedCategory, setSelectedCategory] = useState('');

  // Revised categories list
  const staticCategories = [
    'Food',
    'Hair Care',
    'Retail',
    'Professional Services',
    'Home Services',
    'Technology'
  ];

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    onFilterChange(category ? [category] : []);
  };

  return (
    <div className="filter-section">
      <div className="filter-container">
        <div className="select-wrapper">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {staticCategories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default BusinessFilters;