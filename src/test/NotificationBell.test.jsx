import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// Mock NotificationContext
vi.mock('../context/NotificationContext', () => ({
  useNotifications: vi.fn(),
}))

import { useNotifications } from '../context/NotificationContext'
import NotificationBell from '../components/NotificationBell'

function setup(overrides = {}) {
  const defaults = {
    notifications: [],
    unreadCount: 0,
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
  }
  const value = { ...defaults, ...overrides }
  useNotifications.mockReturnValue(value)
  render(<MemoryRouter><NotificationBell /></MemoryRouter>)
  return value
}

describe('NotificationBell', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the bell button', () => {
    setup()
    expect(screen.getByTitle('Notifications')).toBeInTheDocument()
  })

  it('shows no badge when unreadCount is 0', () => {
    setup({ unreadCount: 0 })
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('shows badge with unread count', () => {
    setup({ unreadCount: 5 })
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('shows 99+ when unread exceeds 99', () => {
    setup({ unreadCount: 150 })
    expect(screen.getByText('99+')).toBeInTheDocument()
  })

  it('opens dropdown on click', () => {
    setup()
    fireEvent.click(screen.getByTitle('Notifications'))
    expect(screen.getByText('Notifications')).toBeInTheDocument()
  })

  it('shows empty state when no notifications', () => {
    setup()
    fireEvent.click(screen.getByTitle('Notifications'))
    expect(screen.getByText('No notifications yet')).toBeInTheDocument()
  })

  it('renders notification messages in dropdown', () => {
    setup({
      unreadCount: 1,
      notifications: [
        { id: 'n1', message: 'You have been nominated for Innovation by Jamal!', type: 'nominated', created_at: new Date().toISOString(), isRead: false },
      ],
    })
    fireEvent.click(screen.getByTitle('Notifications'))
    expect(screen.getByText('You have been nominated for Innovation by Jamal!')).toBeInTheDocument()
  })

  it('shows "Mark all as read" when there are unread notifications', () => {
    setup({
      unreadCount: 2,
      notifications: [
        { id: 'n1', message: 'Notif 1', type: 'nominated', created_at: new Date().toISOString(), isRead: false },
        { id: 'n2', message: 'Notif 2', type: 'vote_received', created_at: new Date().toISOString(), isRead: false },
      ],
    })
    fireEvent.click(screen.getByTitle('Notifications'))
    expect(screen.getByText('Mark all as read')).toBeInTheDocument()
  })

  it('does not show "Mark all as read" when all are read', () => {
    setup({
      unreadCount: 0,
      notifications: [
        { id: 'n1', message: 'Notif 1', type: 'nominated', created_at: new Date().toISOString(), isRead: true },
      ],
    })
    fireEvent.click(screen.getByTitle('Notifications'))
    expect(screen.queryByText('Mark all as read')).not.toBeInTheDocument()
  })

  it('calls markAllAsRead when button clicked', () => {
    const mocks = setup({
      unreadCount: 1,
      notifications: [
        { id: 'n1', message: 'Notif 1', type: 'nominated', created_at: new Date().toISOString(), isRead: false },
      ],
    })
    fireEvent.click(screen.getByTitle('Notifications'))
    fireEvent.click(screen.getByText('Mark all as read'))
    expect(mocks.markAllAsRead).toHaveBeenCalledOnce()
  })

  it('calls markAsRead when notification clicked', () => {
    const mocks = setup({
      unreadCount: 1,
      notifications: [
        { id: 'n1', message: 'Click me', type: 'new_nomination', created_at: new Date().toISOString(), isRead: false },
      ],
    })
    fireEvent.click(screen.getByTitle('Notifications'))
    fireEvent.click(screen.getByText('Click me'))
    expect(mocks.markAsRead).toHaveBeenCalledWith('n1')
  })

  it('shows "new" badge count in dropdown header', () => {
    setup({
      unreadCount: 3,
      notifications: [
        { id: 'n1', message: 'A', type: 'nominated', created_at: new Date().toISOString(), isRead: false },
      ],
    })
    fireEvent.click(screen.getByTitle('Notifications'))
    expect(screen.getByText('3 new')).toBeInTheDocument()
  })

  it('closes dropdown on second click', () => {
    setup({
      notifications: [
        { id: 'n1', message: 'Visible', type: 'nominated', created_at: new Date().toISOString(), isRead: true },
      ],
    })
    const bell = screen.getByTitle('Notifications')
    fireEvent.click(bell)
    expect(screen.getByText('Visible')).toBeInTheDocument()
    fireEvent.click(bell)
    expect(screen.queryByText('Visible')).not.toBeInTheDocument()
  })
})
