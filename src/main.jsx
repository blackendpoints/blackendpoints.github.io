import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactGA from 'react-ga4'
import App from './App.jsx'
import './index.css'

// Initialize GA4 with your measurement ID
ReactGA.initialize('G-SE1B1FDSEB') // Replace with your actual GA4 measurement ID

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)