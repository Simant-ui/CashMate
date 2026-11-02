import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { clearAllLocalStorage } from './context/AppContext'

// Clean all previous local storage as requested (one-time reset for fresh session)
if (typeof window !== 'undefined') {
  const CLEANUP_KEY = 'cashmate_storage_cleaned_v2';
  if (!window.localStorage.getItem(CLEANUP_KEY)) {
    clearAllLocalStorage();
    window.localStorage.setItem(CLEANUP_KEY, 'true');
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
