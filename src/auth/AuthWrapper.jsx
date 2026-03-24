import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { InteractionStatus } from '@azure/msal-browser'
import { useState } from 'react'
import LoginPage from './LoginPage'

export const GOOGLE_USER_KEY = 'kudos_google_user'

export default function AuthWrapper({ children }) {
  const { inProgress } = useMsal()
  const isMsalAuthenticated = useIsAuthenticated()

  const [googleUser, setGoogleUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(GOOGLE_USER_KEY) || 'null') }
    catch { return null }
  })

  const isAuthenticated = isMsalAuthenticated || googleUser !== null

  if (inProgress === InteractionStatus.Startup || inProgress === InteractionStatus.HandleRedirect) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#F7F8FC',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            border: '3px solid #E2EBF0', borderTopColor: '#4F38F6',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#627490', fontWeight: 600, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
            Loading…
          </p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <LoginPage
        onGoogleLogin={user => {
          sessionStorage.setItem(GOOGLE_USER_KEY, JSON.stringify(user))
          setGoogleUser(user)
        }}
      />
    )
  }

  return children
}
