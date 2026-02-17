import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { startTokenMonitoring } from './shared/utils/tokenMonitor'

// Iniciar monitoreo de token en desarrollo
if (import.meta.env.DEV) {
  startTokenMonitoring();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
