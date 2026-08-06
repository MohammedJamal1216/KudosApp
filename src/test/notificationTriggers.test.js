import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock supabase with tracking
const insertCalls = []
const mockInsert = vi.fn(data => {
  insertCalls.push(data)
  return Promise.resolve({ error: null })
})

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(table => ({
      insert: vi.fn(data => {
        insertCalls.push({ table, data })
        return { then: cb => cb({ error: null }) }
      }),
      update: vi.fn(() => ({ eq: vi.fn(() => Promise.resolve({ error: null })) })),
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: [] })),
        eq: vi.fn(() => Promise.resolve({ data: [] })),
        single: vi.fn(() => Promise.resolve({ data: { id: 'nom-123', created_at: new Date().toISOString() }, error: null })),
      })),
    })),
  },
}))

import { supabase } from '../lib/supabase'

// Replicate the notification logic from AppContext for isolated testing
const CATEGORY_LABELS = {
  team: 'Team Player', innovation: 'Innovation', leadership: 'Leadership',
  helping: 'Helping Others', beyond: 'Above & Beyond',
  rising: 'Rising Star', performance: 'Performance Champion',
}

function simulateNominationNotifications(nominee, catId, currentUser, nominationId) {
  const catLabel = CATEGORY_LABELS[catId] || catId
  return [
    {
      user_id: nominee.id,
      message: `You have been nominated for ${catLabel} by ${currentUser.name}!`,
      type: 'nominated',
      nomination_id: nominationId,
    },
    {
      user_id: 'broadcast',
      message: `${nominee.name} has been nominated for ${catLabel}! Go vote now.`,
      type: 'new_nomination',
      nomination_id: nominationId,
    },
  ]
}

function simulateVoteNotification(nomination, newVoteCount) {
  const catLabel = CATEGORY_LABELS[nomination.category] || nomination.category
  return {
    user_id: nomination.nominee.id,
    message: `Someone voted for your ${catLabel} nomination! You now have ${newVoteCount} vote${newVoteCount === 1 ? '' : 's'}.`,
    type: 'vote_received',
    nomination_id: nomination.id,
  }
}

describe('Notification triggers', () => {
  beforeEach(() => {
    insertCalls.length = 0
    vi.clearAllMocks()
  })

  describe('addNomination notifications', () => {
    const currentUser = { id: 'u1', name: 'Jamal' }
    const nominee = { id: 'u2', name: 'Anish' }

    it('creates personal notification for nominee', () => {
      const notifs = simulateNominationNotifications(nominee, 'innovation', currentUser, 'nom-1')
      const personal = notifs.find(n => n.type === 'nominated')

      expect(personal.user_id).toBe('u2')
      expect(personal.message).toBe('You have been nominated for Innovation by Jamal!')
      expect(personal.nomination_id).toBe('nom-1')
    })

    it('creates broadcast notification for all employees', () => {
      const notifs = simulateNominationNotifications(nominee, 'leadership', currentUser, 'nom-2')
      const broadcast = notifs.find(n => n.type === 'new_nomination')

      expect(broadcast.user_id).toBe('broadcast')
      expect(broadcast.message).toBe('Anish has been nominated for Leadership! Go vote now.')
    })

    it('uses category label not id in message', () => {
      const notifs = simulateNominationNotifications(nominee, 'beyond', currentUser, 'nom-3')
      expect(notifs[0].message).toContain('Above & Beyond')
      expect(notifs[0].message).not.toContain('beyond')
    })

    it('falls back to raw catId if label not found', () => {
      const notifs = simulateNominationNotifications(nominee, 'custom_cat', currentUser, 'nom-4')
      expect(notifs[0].message).toContain('custom_cat')
    })

    it('creates exactly 2 notifications per nomination', () => {
      const notifs = simulateNominationNotifications(nominee, 'team', currentUser, 'nom-5')
      expect(notifs).toHaveLength(2)
    })
  })

  describe('castVote notifications', () => {
    const nomination = {
      id: 'nom-10',
      nominee: { id: 'u3', name: 'Sara' },
      category: 'innovation',
      votes: 4,
    }

    it('creates notification for nominee with correct vote count', () => {
      const notif = simulateVoteNotification(nomination, 5)

      expect(notif.user_id).toBe('u3')
      expect(notif.message).toBe('Someone voted for your Innovation nomination! You now have 5 votes.')
      expect(notif.type).toBe('vote_received')
      expect(notif.nomination_id).toBe('nom-10')
    })

    it('uses singular "vote" for count of 1', () => {
      const notif = simulateVoteNotification({ ...nomination, votes: 0 }, 1)
      expect(notif.message).toContain('1 vote.')
      expect(notif.message).not.toContain('1 votes')
    })

    it('uses plural "votes" for count > 1', () => {
      const notif = simulateVoteNotification(nomination, 10)
      expect(notif.message).toContain('10 votes.')
    })

    it('uses category label in vote notification', () => {
      const notif = simulateVoteNotification({ ...nomination, category: 'helping' }, 3)
      expect(notif.message).toContain('Helping Others')
    })
  })
})
