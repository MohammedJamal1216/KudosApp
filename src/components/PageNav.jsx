import { NavLink } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const allNavItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    roles: ['admin', 'manager', 'employee'],
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    to: '/nominate',
    label: 'Nominate',
    roles: ['admin', 'manager'],
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <line x1="19" y1="8" x2="19" y2="14"/>
        <line x1="22" y1="11" x2="16" y2="11"/>
      </svg>
    ),
  },
  {
    to: '/vote',
    label: 'Vote',
    roles: ['admin', 'employee'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z"/>
        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
      </svg>
    ),
  },
  {
    to: '/leaderboard',
    label: 'Leaderboard',
    roles: ['admin', 'manager', 'employee'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
        <path d="M4 22h16"/>
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
      </svg>
    ),
  },
]

export default function PageNav() {
  const { currentUser } = useAppContext()
  const navItems = allNavItems.filter(item => item.roles.includes(currentUser?.accessRole ?? 'employee'))

  return (
    <div className="flex justify-center mb-8">
      <div
        className="flex items-center"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #E2EBF0',
          padding: '5.7px 1px',
          gap: '7px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
        }}
      >
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-0 rounded-[14px] transition-all duration-200 ${isActive ? 'bg-white' : ''}`
            }
            style={({ isActive }) => ({
              paddingTop: 0,
              paddingBottom: 0,
              height: '37.8px',
              paddingLeft: '20px',
              paddingRight: '16px',
              boxShadow: isActive
                ? '0 2px 4px -2px rgba(224,231,255,1), 0 4px 6px -1px rgba(224,231,255,1)'
                : 'none',
              backgroundColor: isActive ? '#F3F1FF' : 'transparent',
            })}
          >
            {({ isActive }) => (
              <>
                <span
                  className="flex-shrink-0 mr-[7px]"
                  style={{ color: isActive ? '#4F38F6' : '#627490' }}
                >
                  {icon}
                </span>
                <span
                  className="text-[14px] font-bold"
                  style={{ color: isActive ? '#4F38F6' : '#627490' }}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  )
}
