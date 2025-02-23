import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/all.scss'
import { RouterProvider } from 'react-router-dom'
import router from './routes/index.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)