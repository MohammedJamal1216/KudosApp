import { useState, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useMsal } from '@azure/msal-react'
import { useAppContext } from '../context/AppContext'

const navItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
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

export default function Navbar() {
  const { instance } = useMsal()
  const { currentUser } = useAppContext()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const handleSignOut = () => {
    instance.logoutPopup().catch(console.error)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav
      className="w-full bg-white sticky top-0 z-50 flex items-center justify-between"
      style={{
        height: '82px',
        paddingLeft: '44px',
        paddingRight: '44px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.4)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Icon box */}
        <div
          className="w-10 h-10 flex items-center justify-center flex-shrink-0"
          style={{
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #F5339A 0%, #FF8902 100%)',
            boxShadow: '0 4px 6px -4px rgba(245,51,154,0.3), 0 10px 15px -3px rgba(245,51,154,0.3)',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
        </div>
        {/* KudosApp text with gradient */}
        <span
          className="text-[24px] font-extrabold leading-8"
          style={{
            background: 'linear-gradient(90deg, #F5339A 0%, #AD47FF 50%, #6160FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          KudosApp
        </span>
      </div>

      {/* Nav Links */}
      <div
        className="flex items-center"
        style={{
          backgroundColor: 'rgba(255,255,255,0.5)',
          borderRadius: '16px',
          border: '1px solid #ffffff',
          padding: '5.7px 1px',
          gap: '7px',
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

      {/* User Profile */}
      <div className="flex-shrink-0 relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(prev => !prev)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end gap-0.5">
              <p className="text-[14px] leading-5" style={{ fontWeight: 800, color: '#1D2840' }}>
                {currentUser?.name || '…'}
              </p>
              <p className="text-[12px] font-semibold leading-4" style={{ color: '#F5339A' }}>
                {currentUser?.role || '…'}
              </p>
            </div>
            {/* Avatar */}
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#E2E8F0] flex-shrink-0">
              {currentUser?.photoUrl ? (
                <img src={currentUser.photoUrl} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: currentUser?.avatarBg || 'linear-gradient(135deg,#6160ff,#ad46ff)' }}
                >
                  {currentUser?.initials || '?'}
                </div>
              )}
            </div>
          </div>
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 12px)', right: 0,
            background: '#fff', border: '1px solid #E2EBF0', borderRadius: 14,
            boxShadow: '0 8px 30px rgba(0,0,0,0.1)', minWidth: 180, zIndex: 100,
            overflow: 'hidden',
          }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #F1F5F9' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#1D2840', margin: 0 }}>{currentUser?.name}</p>
              <p style={{ fontSize: 12, fontWeight: 500, color: '#627490', margin: '2px 0 0' }}>{currentUser?.role}</p>
            </div>
            <button
              onClick={handleSignOut}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 16px', background: 'none', border: 'none',
                cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#e11d48',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fff1f2'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
