import { useState, useRef, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const ALL_ROLES = ['admin', 'manager', 'employee']

const icons = {
  perks: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="4" rx="1"/>
      <path d="M12 8v13M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>
      <path d="M12 8S10.5 3 8 3a2.5 2.5 0 0 0 0 5M12 8s1.5-5 4-5a2.5 2.5 0 0 1 0 5"/>
    </svg>
  ),
  wellbeing: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Drawn to span y 4–20 so it centers on 12 like the other icons */}
      <path d="M12 20c-4-2.3-7-5.5-7-9a7 7 0 0 1 14 0c0 3.5-3 6.7-7 9z"/>
      <path d="M12 20V10.5M12 13l-3.5-2.5M12 13l3.5-2.5"/>
    </svg>
  ),
  celebration: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21l6.5-14L21 18.5 3 21z"/>
      <path d="M14 5V2M18 8l2.5-2M17 12h3"/>
    </svg>
  ),
  rewards: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9" r="6"/>
      <path d="M12 9l1.2 1.2L15 7.5"/>
      <path d="M8.5 14L7 22l5-2.5L17 22l-1.5-8"/>
    </svg>
  ),
  cultureHub: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/>
      <path d="M15.5 8.5a4 4 0 0 1 0 7M18.5 5.5a8 8 0 0 1 0 13"/>
    </svg>
  ),
  wallet: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="3"/>
      <path d="M2 10h20"/>
      <circle cx="17.5" cy="14.5" r="1.2"/>
    </svg>
  ),
  savings: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M14.5 9.5A2.5 2.5 0 0 0 12 8c-1.4 0-2.5.8-2.5 2s1.1 2 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2a2.5 2.5 0 0 1-2.5-1.5"/>
      <path d="M12 6v12"/>
    </svg>
  ),
  orderHistory: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.05 11a9 9 0 1 1 .5 4"/>
      <path d="M3 21v-6h6"/>
      <path d="M12 8v4l3 2"/>
    </svg>
  ),
  benefits: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M2 13h20"/>
    </svg>
  ),
}

// A `children` array makes an entry a dropdown group; otherwise it's a direct link.
// The transactional sections are grouped so the header stays at four slots.
const topNavItems = [
  {
    label: 'Benefits',
    icon: icons.benefits,
    roles: ALL_ROLES,
    children: [
      { to: '/perks', label: 'Perks', icon: icons.perks, hint: 'Discounts and offers' },
      { to: '/rewards', label: 'Rewards', icon: icons.rewards, hint: 'Redeem your points' },
      { to: '/my-wallet', label: 'My wallet', icon: icons.wallet, hint: 'Points balance' },
      { to: '/my-savings', label: 'My savings', icon: icons.savings, hint: 'Total saved to date' },
      { to: '/order-history', label: 'Order history', icon: icons.orderHistory, hint: 'Past redemptions' },
    ],
  },
  { to: '/wellbeing', label: 'Wellbeing', icon: icons.wellbeing, roles: ALL_ROLES },
  { to: '/celebration', label: 'Celebration', icon: icons.celebration, roles: ALL_ROLES },
  { to: '/culture-hub', label: 'Culture hub', icon: icons.cultureHub, roles: ALL_ROLES },
]

// Shared geometry so group triggers and plain links sit on the same baseline
const itemBase = {
  height: '37.8px',
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: '17px',
  paddingRight: '15px',
  borderRadius: '14px',
}

const ACTIVE_SHADOW =
  '0 2px 4px -2px rgba(224,231,255,1), 0 4px 6px -1px rgba(224,231,255,1)'

function itemColors(isActive) {
  return { color: isActive ? '#4F38F6' : '#627490' }
}

// Icons must sit in a fixed flex box, not an inline span: an inline <svg>
// aligns to the text baseline, which drops it by the descender gap and by a
// different amount than its label. A fixed box also keeps labels on a common
// left edge regardless of each glyph's drawn width.
const ICON_BOX = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '19px',
  height: '19px',
  flexShrink: 0,
}

function iconBoxStyle(isActive, extra) {
  return { ...ICON_BOX, ...itemColors(isActive), ...extra }
}

function NavGroup({ item, isOpen, onToggle, onClose }) {
  const { pathname } = useLocation()
  const ref = useRef(null)
  const isChildActive = item.children.some(c => c.to === pathname)

  useEffect(() => {
    if (!isOpen) return
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const highlighted = isChildActive || isOpen

  return (
    <div className="relative flex-shrink-0" ref={ref}>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center transition-all duration-200"
        style={{
          ...itemBase,
          background: highlighted ? '#ffffff' : 'none',
          border: 'none',
          cursor: 'pointer',
          boxShadow: highlighted ? ACTIVE_SHADOW : 'none',
        }}
      >
        <span style={iconBoxStyle(highlighted, { marginRight: '7px' })}>
          {item.icon}
        </span>
        <span className="text-[13.5px] font-bold whitespace-nowrap" style={itemColors(highlighted)}>
          {item.label}
        </span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke={highlighted ? '#4F38F6' : '#627490'}
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          className="ml-[5px] flex-shrink-0"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute', top: 'calc(100% + 10px)', left: 0,
            background: '#fff', border: '1px solid #E2EBF0', borderRadius: 14,
            boxShadow: '0 8px 30px rgba(0,0,0,0.1)', minWidth: 236, zIndex: 100,
            overflow: 'hidden', padding: '6px',
          }}
        >
          {item.children.map(({ to, label, icon, hint }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className="flex items-center w-full"
              style={({ isActive }) => ({
                gap: 11,
                padding: '9px 12px',
                borderRadius: 10,
                background: isActive ? '#F3F1FF' : 'transparent',
                textDecoration: 'none',
              })}
            >
              {({ isActive }) => (
                <>
                  <span style={iconBoxStyle(isActive)}>{icon}</span>
                  <span className="flex flex-col">
                    <span className="text-[13.5px] font-bold leading-tight" style={{ color: isActive ? '#4F38F6' : '#1D2840' }}>
                      {label}
                    </span>
                    <span className="text-[11.5px] font-semibold leading-tight mt-[2px]" style={{ color: '#90a3b8' }}>
                      {hint}
                    </span>
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

export default function TopNav() {
  const { currentUser } = useAppContext()
  const [openMenu, setOpenMenu] = useState(null)
  const navItems = topNavItems.filter(item => item.roles.includes(currentUser?.accessRole ?? 'employee'))

  return (
    <div
      className="flex items-center mx-4"
      style={{
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: '16px',
        border: '1px solid #ffffff',
        padding: '5.7px 1px',
        gap: '6px',
        minWidth: 0,
      }}
    >
      {navItems.map(item =>
        item.children ? (
          <NavGroup
            key={item.label}
            item={item}
            isOpen={openMenu === item.label}
            onToggle={() => setOpenMenu(prev => (prev === item.label ? null : item.label))}
            onClose={() => setOpenMenu(null)}
          />
        ) : (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center flex-shrink-0 transition-all duration-200 ${isActive ? 'bg-white' : ''}`
            }
            style={({ isActive }) => ({
              ...itemBase,
              boxShadow: isActive ? ACTIVE_SHADOW : 'none',
            })}
          >
            {({ isActive }) => (
              <>
                <span style={iconBoxStyle(isActive, { marginRight: '7px' })}>
                  {item.icon}
                </span>
                <span className="text-[13.5px] font-bold whitespace-nowrap" style={itemColors(isActive)}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        )
      )}
    </div>
  )
}
