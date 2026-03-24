import { useMsal } from '@azure/msal-react'
import { useGoogleLogin } from '@react-oauth/google'
import { loginRequest } from './msalConfig'

export default function LoginPage({ onGoogleLogin }) {
  const { instance } = useMsal()

  const handleMicrosoftLogin = () => {
    instance.loginPopup(loginRequest).catch(console.error)
  }

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async tokenResponse => {
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then(r => r.json())

        onGoogleLogin({
          id: userInfo.sub,
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
          provider: 'google',
        })
      } catch (err) {
        console.error('Failed to fetch Google user info:', err)
      }
    },
    onError: () => console.error('Google login failed'),
    scope: 'openid profile email',
  })

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
        <p style={{ fontSize: 15, fontWeight: 500, color: '#627490', margin: '0 0 36px', lineHeight: 1.6 }}>
          Sign in to recognize and celebrate your teammates.
        </p>

        {/* Microsoft button */}
        <button
          onClick={handleMicrosoftLogin}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            background: '#fff', color: '#1D2840', border: '1.5px solid #E2EBF0',
            borderRadius: 14, padding: '14px 24px', fontSize: 15, fontWeight: 700,
            cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.15s',
            marginBottom: 12,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#4F38F6'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(79,56,246,0.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2EBF0'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'; }}
        >
          <svg width="20" height="20" viewBox="0 0 21 21" fill="none">
            <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
            <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
            <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
            <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
          </svg>
          Sign in with Microsoft
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#E2EBF0' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#90a3b8' }}>or</span>
          <div style={{ flex: 1, height: 1, background: '#E2EBF0' }} />
        </div>

        {/* Google button */}
        <button
          onClick={() => handleGoogleLogin()}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            background: '#fff', color: '#1D2840', border: '1.5px solid #E2EBF0',
            borderRadius: 14, padding: '14px 24px', fontSize: 15, fontWeight: 700,
            cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.15s',
            marginTop: 8,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#EA4335'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(234,67,53,0.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2EBF0'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'; }}
        >
          {/* Google logo */}
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  )
}
