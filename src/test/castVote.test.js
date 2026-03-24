import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => Promise.resolve({ error: null })),
      update: vi.fn(() => ({ eq: vi.fn(() => Promise.resolve({ error: null })) })),
      select: vi.fn(() => ({ order: vi.fn(() => Promise.resolve({ data: [] })), eq: vi.fn(() => Promise.resolve({ data: [] })) })),
    })),
  },
}))

// We test the castVote logic directly by extracting it
import { supabase } from '../lib/supabase'

function makeCastVote({ currentUser, votedIds, nominations, setVotedIds, setNominations }) {
  return async function castVote(nominationId) {
    if (!currentUser) return
    if (votedIds.has(nominationId)) return
    const nomination = nominations.find(n => n.id === nominationId)
    if (!nomination) return

    const newVoteCount = nomination.votes + 1
    setVotedIds(prev => new Set([...prev, nominationId]))
    setNominations(prev => prev.map(n => n.id === nominationId ? { ...n, votes: newVoteCount } : n))

    const [voteResult, updateResult] = await Promise.all([
      supabase.from('votes').insert({ nomination_id: nominationId, voter_id: currentUser.id }),
      supabase.from('nominations').update({ vote_count: newVoteCount }).eq('id', nominationId),
    ])

    if (voteResult.error || updateResult.error) {
      setVotedIds(prev => { const s = new Set(prev); s.delete(nominationId); return s })
      setNominations(prev => prev.map(n => n.id === nominationId ? { ...n, votes: nomination.votes } : n))
    }
  }
}

describe('castVote', () => {
  let setVotedIds
  let setNominations
  const nomination = { id: 'nom-1', votes: 2 }

  beforeEach(() => {
    setVotedIds = vi.fn()
    setNominations = vi.fn()
    vi.clearAllMocks()
  })

  it('does nothing when currentUser is null', async () => {
    const castVote = makeCastVote({
      currentUser: null,
      votedIds: new Set(),
      nominations: [nomination],
      setVotedIds,
      setNominations,
    })

    await castVote('nom-1')

    expect(setVotedIds).not.toHaveBeenCalled()
    expect(setNominations).not.toHaveBeenCalled()
    expect(supabase.from).not.toHaveBeenCalled()
  })

  it('does nothing when nomination already voted', async () => {
    const castVote = makeCastVote({
      currentUser: { id: 'user-1' },
      votedIds: new Set(['nom-1']),
      nominations: [nomination],
      setVotedIds,
      setNominations,
    })

    await castVote('nom-1')

    expect(setVotedIds).not.toHaveBeenCalled()
    expect(supabase.from).not.toHaveBeenCalled()
  })

  it('does nothing when nomination not found', async () => {
    const castVote = makeCastVote({
      currentUser: { id: 'user-1' },
      votedIds: new Set(),
      nominations: [],
      setVotedIds,
      setNominations,
    })

    await castVote('nom-999')

    expect(setVotedIds).not.toHaveBeenCalled()
    expect(supabase.from).not.toHaveBeenCalled()
  })

  it('optimistically updates votes and calls supabase', async () => {
    const castVote = makeCastVote({
      currentUser: { id: 'user-1' },
      votedIds: new Set(),
      nominations: [nomination],
      setVotedIds,
      setNominations,
    })

    await castVote('nom-1')

    expect(setVotedIds).toHaveBeenCalled()
    expect(setNominations).toHaveBeenCalled()
    expect(supabase.from).toHaveBeenCalledWith('votes')
  })
})
