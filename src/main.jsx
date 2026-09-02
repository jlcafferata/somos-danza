import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'

import { AdminAuthProvider } from './context/AdminAuthContext'
import Layout from './components/Layout'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'
import JuradoHomePage from './pages/JuradoHomePage'
import JuradoPage from './pages/JuradoPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDatosPage from './pages/AdminDatosPage'
import AdminPuntajesPage from './pages/AdminPuntajesPage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminAuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<JuradoHomePage />} />
            <Route path="jurado/:numero" element={<JuradoPage />} />
            <Route path="admin/login" element={<AdminLoginPage />} />
            <Route
              path="admin/datos"
              element={
                <ProtectedAdminRoute>
                  <AdminDatosPage />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="admin/puntajes"
              element={
                <ProtectedAdminRoute>
                  <AdminPuntajesPage />
                </ProtectedAdminRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AdminAuthProvider>
  </StrictMode>
)
