import { useMsal } from '@azure/msal-react'
import { loginRequest } from './msalConfig'

export default function LoginPage() {
  const { instance } = useMsal()

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch(console.error)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#F7F8FC', fontFamily: "'Inter','Segoe UI',sans-serif",
    }}>
      <div style={{
        background: '#fff', borderRadius: 32, padding: '56px 64px', textAlign: 'center',
        boxShadow: '0 20px 60px rgba(79,56,245,0.12)', maxWidth: 440, width: '100%',
        border: '1px solid #E2EBF0',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 16, flexShrink: 0,
            background: 'linear-gradient(135deg, #F5339A 0%, #FF8902 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(245,51,154,0.35)',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
          </div>
          <span style={{
            fontSize: 28, fontWeight: 900,
            background: 'linear-gradient(90deg, #F5339A 0%, #AD47FF 50%, #6160FF 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            KudosApp
          </span>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#1D2840', margin: '0 0 12px' }}>
          Welcome Back!
        </h1>
        <p style={{ fontSize: 16, fontWeight: 500, color: '#627490', margin: '0 0 40px', lineHeight: 1.6 }}>
          Sign in with your Microsoft account to recognize and celebrate your teammates.
        </p>

        <button
          onClick={handleLogin}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            background: '#fff', color: '#1D2840', border: '1.5px solid #E2EBF0',
            borderRadius: 14, padding: '14px 24px', fontSize: 15, fontWeight: 700,
            cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#4F38F6'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(79,56,246,0.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2EBF0'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'; }}
        >
          {/* Microsoft logo */}
          <svg width="20" height="20" viewBox="0 0 21 21" fill="none">
            <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
            <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
            <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
            <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
          </svg>
          Sign in with Microsoft
        </button>
      </div>
    </div>
  )
}
