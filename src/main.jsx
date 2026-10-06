import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Amb from './ambient.js'
import './styles.css'

Amb.init() // sound is on by default; browsers unlock it on the first click/tap/key

createRoot(document.getElementById('root')).render(<App />)
