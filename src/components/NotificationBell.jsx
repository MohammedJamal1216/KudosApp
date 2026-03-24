import { useState, useRef, useEffect } from 'react'
import { useNotifications } from '../context/NotificationContext'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

const TYPE_ICON = { nominated: '🏅', vote_received: '👍', new_nomination: '🔔' }
const TYPE_BG = {
  nominated: 'linear-gradient(135deg,#6160ff,#ad46ff)',
  vote_received: 'linear-gradient(135deg,#f633a0,#ff6b6b)',
  new_nomination: 'linear-gradient(135deg,#00c9a7,#48dbfb)',
}

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        title="Notifications"
        style={{
          background: open ? '#eceaff' : 'none',
          border: `1.5px solid ${open ? '#c4b5fd' : '#e2e8f0'}`,
          borderRadius: 12, width: 40, height: 40, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: open ? '#4f38f5' : '#627490', transition: 'all 0.15s ease',
          flexShrink: 0, position: 'relative',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#eceaff'; e.currentTarget.style.borderColor = '#c4b5fd'; e.currentTarget.style.color = '#4f38f5' }}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#627490' } }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: -6, right: -6,
            background: '#e11d48', color: '#fff', borderRadius: 999,
            fontSize: 10, fontWeight: 800, minWidth: 18, height: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 4px', border: '2px solid #fff', lineHeight: 1,
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 12px)', right: 0,
          background: '#fff', border: '1px solid #e2ebf0', borderRadius: 16,
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)', width: 360, zIndex: 200,
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', borderBottom: '1px solid #f1f5f9',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: '#1d2940' }}>Notifications</span>
              {unreadCount > 0 && (
                <span style={{
                  background: '#e11d48', color: '#fff', borderRadius: 999,
                  fontSize: 11, fontWeight: 700, padding: '2px 8px',
                }}>
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 700, color: '#4f38f5', padding: 0,
                }}
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div style={{ maxHeight: 420, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{
                padding: '40px 20px', textAlign: 'center',
                color: '#90a3b8', fontSize: 14, fontWeight: 600,
              }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>🔔</div>
                No notifications yet
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  style={{
                    padding: '14px 20px', borderBottom: '1px solid #f8fafc',
                    background: n.isRead ? '#fff' : '#f5f3ff',
                    cursor: 'pointer', transition: 'background 0.15s',
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => { e.currentTarget.style.background = n.isRead ? '#fff' : '#f5f3ff' }}
                >
                  {/* Type icon */}
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: TYPE_BG[n.type] || TYPE_BG.new_nomination,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16,
                  }}>
                    {TYPE_ICON[n.type] || '🔔'}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: 13, fontWeight: n.isRead ? 500 : 700,
                      color: '#1d2940', margin: 0, lineHeight: 1.5,
                    }}>
                      {n.message}
                    </p>
                    <p style={{ fontSize: 11, color: '#90a3b8', fontWeight: 600, margin: '4px 0 0' }}>
                      {timeAgo(n.created_at)}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {!n.isRead && (
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: '#4f38f5', flexShrink: 0, marginTop: 5,
                    }} />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
