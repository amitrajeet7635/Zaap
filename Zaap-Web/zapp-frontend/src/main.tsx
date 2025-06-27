// Polyfill imports first
import { Buffer } from 'buffer'
import process from 'process'


// Make them globally available
window.Buffer = Buffer
window.process = process
globalThis.Buffer = Buffer
globalThis.process = process

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
