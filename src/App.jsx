import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import NominatePeer from './pages/NominatePeer'
import Vote from './pages/Vote'
import HallOfFame from './pages/HallOfFame'
import AuthWrapper from './auth/AuthWrapper'
import RoleGuard from './components/RoleGuard'
import { AppContextProvider } from './context/AppContext'
import { ConfigContextProvider } from './context/ConfigContext'

export default function App() {
  return (
    <AuthWrapper>
      <ConfigContextProvider>
        <AppContextProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-[#F7F8FC] overflow-x-hidden">
              <Navbar />
              <main className="max-w-[1260px] mx-auto px-[90px] py-8">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/nominate" element={<RoleGuard allowedRole="manager"><NominatePeer /></RoleGuard>} />
                  <Route path="/vote" element={<RoleGuard allowedRole="employee"><Vote /></RoleGuard>} />
                  <Route path="/leaderboard" element={<HallOfFame />} />
                </Routes>
              </main>
              <footer className="mt-12 py-5 text-center text-sm text-[#627490] bg-[#EEEEFF]">
                SharePoint Designs © 2026 All Rights Reserved.
              </footer>
            </div>
          </BrowserRouter>
        </AppContextProvider>
      </ConfigContextProvider>
    </AuthWrapper>
  )
}
