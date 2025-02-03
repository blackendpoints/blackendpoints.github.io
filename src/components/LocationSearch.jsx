import { useState } from 'react';

function LocationSearch({ onSearch, onBusinessSearch, error, defaultLocation }) {
  const [inputValue, setInputValue] = useState('');
  const [searchType, setSearchType] = useState('location'); // 'location' or 'business'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchType === 'location') {
      onSearch(inputValue);
    } else {
      onBusinessSearch(inputValue);
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <div className="search-type-toggle">
          <button
            type="button"
            className={`toggle-btn ${searchType === 'location' ? 'active' : ''}`}
            onClick={() => setSearchType('location')}
          >
            Search by Location
          </button>
          <button
            type="button"
            className={`toggle-btn ${searchType === 'business' ? 'active' : ''}`}
            onClick={() => setSearchType('business')}
          >
            Search Businesses
          </button>
        </div>
        <div className="search-input-container">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={searchType === 'location' ? 
              "Enter ZIP code or location..." : 
              "Search business name, category..."
            }
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </div>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default LocationSearch;