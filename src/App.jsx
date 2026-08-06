import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import PageNav from './components/PageNav'
import Dashboard from './pages/Dashboard'
import NominatePeer from './pages/NominatePeer'
import Vote from './pages/Vote'
import HallOfFame from './pages/HallOfFame'
import ComingSoon from './pages/ComingSoon'
import AuthWrapper from './auth/AuthWrapper'
import RoleGuard from './components/RoleGuard'
import { AppContextProvider } from './context/AppContext'
import { ConfigContextProvider } from './context/ConfigContext'
import { NotificationProvider } from './context/NotificationContext'

// Colors mirror the matching tile in PageNav
const UPCOMING_SECTIONS = [
  { path: '/perks', title: 'Perks', color: '#3B2BE8' },
  { path: '/wellbeing', title: 'Wellbeing', color: '#F97316' },
  { path: '/celebration', title: 'Celebration', color: '#C026D3' },
  { path: '/rewards', title: 'Rewards', color: '#F43F5E' },
  { path: '/culture-hub', title: 'Culture hub', color: '#A21CAF' },
  { path: '/my-wallet', title: 'My wallet', color: '#0EA5E9' },
  { path: '/my-savings', title: 'My savings', color: '#10B981' },
  { path: '/order-history', title: 'Order history', color: '#64748B' },
]

export default function App() {
  return (
    <AuthWrapper>
      <ConfigContextProvider>
        <AppContextProvider>
          <NotificationProvider>
          <HashRouter>
            <div className="min-h-screen bg-[#F7F8FC] overflow-x-hidden">
              <Navbar />
              <main className="max-w-[1260px] mx-auto px-[90px] py-8">
                <PageNav />
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/nominate" element={<RoleGuard allowedRole="manager"><NominatePeer /></RoleGuard>} />
                  <Route path="/vote" element={<RoleGuard allowedRole="employee"><Vote /></RoleGuard>} />
                  <Route path="/leaderboard" element={<HallOfFame />} />
                  {/* New sections — pages not built yet */}
                  {UPCOMING_SECTIONS.map(({ path, title, color }) => (
                    <Route key={path} path={path} element={<ComingSoon title={title} color={color} />} />
                  ))}
                </Routes>
              </main>
              <footer className="mt-12 py-5 text-center text-sm text-[#627490] bg-[#EEEEFF]">
                SharePoint Designs © 2026 All Rights Reserved.
              </footer>
            </div>
          </HashRouter>
          </NotificationProvider>
        </AppContextProvider>
      </ConfigContextProvider>
    </AuthWrapper>
  )
}
