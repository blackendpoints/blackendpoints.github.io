import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddBusinessButton from './components/AddBusinessButton';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <div className="action-buttons">
          <div className="action-buttons-container">
            <button 
              onClick={() => {
                const event = new CustomEvent('findMyLocation');
                window.dispatchEvent(event);
              }}
              className="find-location-btn"
            >
              Find My Location
            </button>
            <AddBusinessButton />
          </div>
        </div>
        <Routes>
          <Route path="/*" element={<Home />} />
        </Routes>
        <div className="copyright">
          © {new Date().getFullYear()} <a href="https://www.instagram.com/blackendpoints" target="_blank" rel="noopener noreferrer">BlackEndpoints</a>. Created by <a href="https://github.com/jcode116" target="_blank" rel="noopener noreferrer">@jcode116</a>
        </div>
      </div>
    </Router>
  );
}

export default App