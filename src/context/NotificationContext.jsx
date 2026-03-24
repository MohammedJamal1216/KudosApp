import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAppContext } from './AppContext'

const READS_KEY = uid => `kudos_notif_reads_${uid}`

function getReads(uid) {
  try { return new Set(JSON.parse(localStorage.getItem(READS_KEY(uid)) || '[]')) }
  catch { return new Set() }
}

function saveReads(uid, reads) {
  localStorage.setItem(READS_KEY(uid), JSON.stringify([...reads]))
}

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const { currentUser } = useAppContext()
  const [notifications, setNotifications] = useState([])
  const [reads, setReads] = useState(new Set())

  useEffect(() => {
    if (currentUser?.id) setReads(getReads(currentUser.id))
  }, [currentUser?.id])

  const fetchNotifications = useCallback(async () => {
    if (!currentUser?.id) return
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .or(`user_id.eq.${currentUser.id},user_id.eq.broadcast`)
      .order('created_at', { ascending: false })
      .limit(50)
    if (!error && data) setNotifications(data)
  }, [currentUser?.id])

  useEffect(() => {
    if (!currentUser?.id) return
    fetchNotifications()

    const channel = supabase
      .channel(`notif-${currentUser.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, payload => {
        const n = payload.new
        if (n.user_id === currentUser.id || n.user_id === 'broadcast') {
          setNotifications(prev => [n, ...prev])
        }
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [currentUser?.id, fetchNotifications])

  function markAsRead(id) {
    if (!currentUser?.id) return
    const updated = new Set([...reads, id])
    setReads(updated)
    saveReads(currentUser.id, updated)
  }

  function markAllAsRead() {
    if (!currentUser?.id) return
    const updated = new Set([...reads, ...notifications.map(n => n.id)])
    setReads(updated)
    saveReads(currentUser.id, updated)
  }

  const enriched = notifications.map(n => ({ ...n, isRead: reads.has(n.id) }))
  const unreadCount = enriched.filter(n => !n.isRead).length

  return (
    <NotificationContext.Provider value={{ notifications: enriched, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be inside NotificationProvider')
  return ctx
}
