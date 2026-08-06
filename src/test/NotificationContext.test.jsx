import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

// Build a proper chainable mock for supabase
const mockChannel = {
  on: vi.fn(() => mockChannel),
  subscribe: vi.fn(() => mockChannel),
}

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        or: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => Promise.resolve({ data: [], error: null })),
          })),
        })),
      })),
      insert: vi.fn(() => Promise.resolve({ error: null })),
    })),
    channel: vi.fn(() => mockChannel),
    removeChannel: vi.fn(),
  },
}))

// Mock AppContext
vi.mock('../context/AppContext', () => ({
  useAppContext: vi.fn(),
}))

import { useAppContext } from '../context/AppContext'
import { NotificationProvider, useNotifications } from '../context/NotificationContext'

function setup(currentUser = { id: 'user-1', name: 'Test' }) {
  useAppContext.mockReturnValue({ currentUser })
  return renderHook(() => useNotifications(), {
    wrapper: ({ children }) => <NotificationProvider>{children}</NotificationProvider>,
  })
}

describe('NotificationContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  afterEach(() => localStorage.clear())

  it('provides default values', () => {
    const { result } = setup()
    expect(result.current.notifications).toEqual([])
    expect(result.current.unreadCount).toBe(0)
    expect(typeof result.current.markAsRead).toBe('function')
    expect(typeof result.current.markAllAsRead).toBe('function')
  })

  it('throws if used outside provider', () => {
    expect(() => {
      renderHook(() => useNotifications())
    }).toThrow('useNotifications must be inside NotificationProvider')
  })

  it('markAsRead updates read state in localStorage', () => {
    const { result } = setup()

    act(() => {
      result.current.markAsRead('notif-1')
    })

    const stored = JSON.parse(localStorage.getItem('kudos_notif_reads_user-1') || '[]')
    expect(stored).toContain('notif-1')
  })

  it('markAsRead accumulates multiple reads', () => {
    const { result } = setup()

    act(() => { result.current.markAsRead('n1') })
    act(() => { result.current.markAsRead('n2') })

    const stored = JSON.parse(localStorage.getItem('kudos_notif_reads_user-1') || '[]')
    expect(stored).toContain('n1')
    expect(stored).toContain('n2')
  })

  it('does nothing when currentUser is null', () => {
    const { result } = setup(null)
    expect(result.current.notifications).toEqual([])
    expect(result.current.unreadCount).toBe(0)

    // markAsRead should not throw
    act(() => {
      result.current.markAsRead('x')
    })
    // No localStorage entry since no user
    expect(localStorage.getItem('kudos_notif_reads_null')).toBeNull()
  })

  it('stores reads per user in localStorage', () => {
    const { result: r1 } = setup({ id: 'alice', name: 'Alice' })
    act(() => r1.current.markAsRead('n1'))

    const { result: r2 } = setup({ id: 'bob', name: 'Bob' })
    act(() => r2.current.markAsRead('n2'))

    const aliceReads = JSON.parse(localStorage.getItem('kudos_notif_reads_alice') || '[]')
    const bobReads = JSON.parse(localStorage.getItem('kudos_notif_reads_bob') || '[]')

    expect(aliceReads).toContain('n1')
    expect(aliceReads).not.toContain('n2')
    expect(bobReads).toContain('n2')
    expect(bobReads).not.toContain('n1')
  })
})
