import { NavLink } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const ALL_ROLES = ['admin', 'manager', 'employee']

const allNavItems = [
  // ---- Existing sections ----
  {
    to: '/dashboard',
    label: 'Dashboard',
    color: '#4F38F6',
    roles: ALL_ROLES,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    color: '#FF8902',
    roles: ['admin', 'manager'],
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    color: '#F5339A',
    roles: ['admin', 'employee'],
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z"/>
        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
      </svg>
    ),
  },
  {
    to: '/leaderboard',
    label: 'Leaderboard',
    color: '#AD47FF',
    roles: ALL_ROLES,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
        <path d="M4 22h16"/>
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
      </svg>
    ),
  },

  // ---- New sections (pages not built yet) ----
  {
    to: '/perks',
    label: 'Perks',
    color: '#3B2BE8',
    roles: ALL_ROLES,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="8" width="18" height="4" rx="1"/>
        <path d="M12 8v13M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>
        <path d="M12 8S10.5 3 8 3a2.5 2.5 0 0 0 0 5M12 8s1.5-5 4-5a2.5 2.5 0 0 1 0 5"/>
      </svg>
    ),
  },
  {
    to: '/wellbeing',
    label: 'Wellbeing',
    color: '#F97316',
    roles: ALL_ROLES,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21c-3.5-2-6-5-6-8a6 6 0 0 1 6-6 6 6 0 0 1 6 6c0 3-2.5 6-6 8z"/>
        <path d="M12 21V11M12 13l-3-2M12 13l3-2"/>
      </svg>
    ),
  },
  {
    to: '/celebration',
    label: 'Celebration',
    color: '#C026D3',
    roles: ALL_ROLES,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21l6.5-14L21 18.5 3 21z"/>
        <path d="M14 5V2M18 8l2.5-2M17 12h3"/>
      </svg>
    ),
  },
  {
    to: '/rewards',
    label: 'Rewards',
    color: '#F43F5E',
    roles: ALL_ROLES,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="9" r="6"/>
        <path d="M12 9l1.2 1.2L15 7.5"/>
        <path d="M8.5 14L7 22l5-2.5L17 22l-1.5-8"/>
      </svg>
    ),
  },
  {
    to: '/culture-hub',
    label: 'Culture hub',
    color: '#A21CAF',
    roles: ALL_ROLES,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/>
        <path d="M15.5 8.5a4 4 0 0 1 0 7M18.5 5.5a8 8 0 0 1 0 13"/>
      </svg>
    ),
  },
  {
    to: '/my-wallet',
    label: 'My wallet',
    color: '#0EA5E9',
    roles: ALL_ROLES,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="3"/>
        <path d="M2 10h20"/>
        <circle cx="17.5" cy="14.5" r="1.2"/>
      </svg>
    ),
  },
  {
    to: '/my-savings',
    label: 'My savings',
    color: '#10B981',
    roles: ALL_ROLES,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/>
        <path d="M14.5 9.5A2.5 2.5 0 0 0 12 8c-1.4 0-2.5.8-2.5 2s1.1 2 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2a2.5 2.5 0 0 1-2.5-1.5"/>
        <path d="M12 6v12"/>
      </svg>
    ),
  },
  {
    to: '/order-history',
    label: 'Order history',
    color: '#64748B',
    roles: ALL_ROLES,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3.05 11a9 9 0 1 1 .5 4"/>
        <path d="M3 21v-6h6"/>
        <path d="M12 8v4l3 2"/>
      </svg>
    ),
  },
]

export default function PageNav() {
  const { currentUser } = useAppContext()
  const navItems = allNavItems.filter(item => item.roles.includes(currentUser?.accessRole ?? 'employee'))

  return (
    <div
      className="flex mb-8 overflow-x-auto"
      style={{ gap: '14px', paddingBottom: '6px', scrollbarWidth: 'thin' }}
    >
      {navItems.map(({ to, label, icon, color }) => (
        <NavLink
          key={to}
          to={to}
          className="relative block overflow-hidden flex-shrink-0"
          style={({ isActive }) => ({
            width: '134px',
            height: '104px',
            borderRadius: '18px',
            backgroundColor: '#ffffff',
            border: isActive ? `2px solid ${color}` : '1px solid #E2EBF0',
            boxShadow: isActive
              ? `0 10px 24px -8px ${color}59`
              : '0 4px 16px rgba(0,0,0,0.04)',
            transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          })}
        >
          {({ isActive }) => (
            <>
              {/* Label */}
              <span
                className="absolute text-[14px] font-extrabold leading-tight"
                style={{
                  top: '14px',
                  left: '16px',
                  right: '14px',
                  color: isActive ? color : '#0F1729',
                }}
              >
                {label}
              </span>

              {/* Quarter-disc with icon */}
              <div
                className="absolute flex items-center justify-center text-white"
                style={{
                  right: 0,
                  bottom: 0,
                  width: '62px',
                  height: '62px',
                  backgroundColor: color,
                  borderTopLeftRadius: '100%',
                  paddingLeft: '13px',
                  paddingTop: '13px',
                }}
              >
                {icon}
              </div>
            </>
          )}
        </NavLink>
      ))}
    </div>
  )
}
