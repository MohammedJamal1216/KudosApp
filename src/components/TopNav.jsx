import { NavLink } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const ALL_ROLES = ['admin', 'manager', 'employee']

// Sections shown in the header pill. Pages for these are not built yet —
// they route to the ComingSoon placeholder (see UPCOMING_SECTIONS in App.jsx).
const topNavItems = [
  {
    to: '/perks',
    label: 'Perks',
    roles: ALL_ROLES,
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="8" width="18" height="4" rx="1"/>
        <path d="M12 8v13M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>
        <path d="M12 8S10.5 3 8 3a2.5 2.5 0 0 0 0 5M12 8s1.5-5 4-5a2.5 2.5 0 0 1 0 5"/>
      </svg>
    ),
  },
  {
    to: '/wellbeing',
    label: 'Wellbeing',
    roles: ALL_ROLES,
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21c-3.5-2-6-5-6-8a6 6 0 0 1 6-6 6 6 0 0 1 6 6c0 3-2.5 6-6 8z"/>
        <path d="M12 21V11M12 13l-3-2M12 13l3-2"/>
      </svg>
    ),
  },
  {
    to: '/celebration',
    label: 'Celebration',
    roles: ALL_ROLES,
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21l6.5-14L21 18.5 3 21z"/>
        <path d="M14 5V2M18 8l2.5-2M17 12h3"/>
      </svg>
    ),
  },
  {
    to: '/rewards',
    label: 'Rewards',
    roles: ALL_ROLES,
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="9" r="6"/>
        <path d="M12 9l1.2 1.2L15 7.5"/>
        <path d="M8.5 14L7 22l5-2.5L17 22l-1.5-8"/>
      </svg>
    ),
  },
  {
    to: '/culture-hub',
    label: 'Culture hub',
    roles: ALL_ROLES,
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/>
        <path d="M15.5 8.5a4 4 0 0 1 0 7M18.5 5.5a8 8 0 0 1 0 13"/>
      </svg>
    ),
  },
  {
    to: '/my-wallet',
    label: 'My wallet',
    roles: ALL_ROLES,
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="3"/>
        <path d="M2 10h20"/>
        <circle cx="17.5" cy="14.5" r="1.2"/>
      </svg>
    ),
  },
  {
    to: '/my-savings',
    label: 'My savings',
    roles: ALL_ROLES,
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/>
        <path d="M14.5 9.5A2.5 2.5 0 0 0 12 8c-1.4 0-2.5.8-2.5 2s1.1 2 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2a2.5 2.5 0 0 1-2.5-1.5"/>
        <path d="M12 6v12"/>
      </svg>
    ),
  },
  {
    to: '/order-history',
    label: 'Order history',
    roles: ALL_ROLES,
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3.05 11a9 9 0 1 1 .5 4"/>
        <path d="M3 21v-6h6"/>
        <path d="M12 8v4l3 2"/>
      </svg>
    ),
  },
]

export default function TopNav() {
  const { currentUser } = useAppContext()
  const navItems = topNavItems.filter(item => item.roles.includes(currentUser?.accessRole ?? 'employee'))

  return (
    <div
      className="flex items-center overflow-x-auto mx-4"
      style={{
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: '16px',
        border: '1px solid #ffffff',
        padding: '5.7px 1px',
        gap: '4px',
        minWidth: 0,
        scrollbarWidth: 'none',
      }}
    >
      {navItems.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center flex-shrink-0 rounded-[14px] transition-all duration-200 ${isActive ? 'bg-white' : ''}`
          }
          style={({ isActive }) => ({
            paddingTop: 0,
            paddingBottom: 0,
            height: '37.8px',
            paddingLeft: '15px',
            paddingRight: '13px',
            boxShadow: isActive
              ? '0 2px 4px -2px rgba(224,231,255,1), 0 4px 6px -1px rgba(224,231,255,1)'
              : 'none',
          })}
        >
          {({ isActive }) => (
            <>
              <span
                className="flex-shrink-0 mr-[6px]"
                style={{ color: isActive ? '#4F38F6' : '#627490' }}
              >
                {icon}
              </span>
              <span
                className="text-[13.5px] font-bold whitespace-nowrap"
                style={{ color: isActive ? '#4F38F6' : '#627490' }}
              >
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  )
}
