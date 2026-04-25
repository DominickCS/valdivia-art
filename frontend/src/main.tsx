import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './Home'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SuccessPage from './pages/SuccessPage'
import ArchivePage from './pages/ArchivePage'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import CreatorDashboardPage from './pages/CreatorDashboardPage'
import NavigationBar from './components/NavigationBar'
import Footer from './components/Footer'
import ForSalePage from './pages/ForSalePage'
import ProfilePage from './pages/ProfilePage'
import CartPage from './pages/CartPage'
import ContactMePage from './pages/ContactMePage'
import AboutMePage from './pages/AboutMePage'
import ArtworkDetailPage from './pages/ArtworkDetailPage'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path='/for-sale' element={<ForSalePage />} />
            <Route path='/archive' element={<ArchivePage />} />
            <Route path='/about' element={<AboutMePage />} />
            <Route path='/contact' element={<ContactMePage />} />
            <Route path='/artwork/detail/:id' element={<ArtworkDetailPage />} />
            <Route path="/profile" element={
              <ProtectedRoute requiredRole="ROLE_CUSTOMER">
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <CreatorDashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/success" element={
              <ProtectedRoute requiredRole="ROLE_CUSTOMER">
                <SuccessPage />
              </ProtectedRoute>
            } />
            <Route path="/cart" element={
              <ProtectedRoute requiredRole="ROLE_CUSTOMER">
                <CartPage />
              </ProtectedRoute>
            } />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
)
