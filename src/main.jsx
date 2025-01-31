import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactGA from 'react-ga4'
import App from './App.jsx'
import './index.css'

// Initialize GA4 with your measurement ID
ReactGA.initialize('G-XXXXXXXXXX') // Replace with your actual GA4 measurement ID

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered:', registration);
    }).catch(error => {
      console.log('SW registration failed:', error);
    });
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)