import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { useConfig } from '../context/ConfigContext'

export default function RoleGuard({ allowedRole, children }) {
  const { currentUser } = useAppContext()
  const { config } = useConfig()
  const navigate = useNavigate()

  if (!currentUser) return null

  // Admins bypass all restrictions
  if (currentUser.accessRole === 'admin') return children

  // Managers can access /vote if managersCanVoteOnOthers is enabled
  if (allowedRole === 'employee' && currentUser.accessRole === 'manager' && config.managersCanVoteOnOthers) {
    return children
  }

  if (currentUser.accessRole !== allowedRole) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh', fontFamily: "'Inter','Segoe UI',sans-serif",
      }}>
        <div style={{
          background: '#fff', borderRadius: 24, padding: '48px 56px', textAlign: 'center',
          boxShadow: '0 8px 30px rgba(0,0,0,0.06)', border: '1px solid #E2EBF0', maxWidth: 400,
        }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🔒</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1D2840', margin: '0 0 10px' }}>
            Access Restricted
          </h2>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#627490', margin: '0 0 28px', lineHeight: 1.6 }}>
            This page is for <strong>{allowedRole === 'manager' ? 'managers' : 'employees'}</strong> only.
            {currentUser.accessRole === 'manager'
              ? ' As a manager, you can nominate peers.'
              : ' As an employee, you can vote on nominations.'}
          </p>
          <button
            onClick={() => navigate(currentUser.accessRole === 'manager' ? '/nominate' : '/vote')}
            style={{
              background: '#4F38F6', color: '#fff', border: 'none', borderRadius: 12,
              padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(79,56,246,0.3)',
            }}
          >
            {currentUser.accessRole === 'manager' ? 'Go to Nominate' : 'Go to Vote'}
          </button>
        </div>
      </div>
    )
  }

  return children
}
