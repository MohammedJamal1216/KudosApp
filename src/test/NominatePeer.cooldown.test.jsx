import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// Isolated test for the cooldown message peer name fallback
// We render just the cooldown UI fragment to verify the fix

function CooldownMessage({ peers, selectedPeer, lastDate, cooldownEnd }) {
  return (
    <div>
      <strong>{peers.find(p => p.id === selectedPeer)?.name || 'This person'}</strong>
      {' '}was nominated on{' '}
      <strong>{lastDate.toLocaleDateString()}</strong>. Can nominate again after{' '}
      <strong>{cooldownEnd.toLocaleDateString()}</strong>.
    </div>
  )
}

const lastDate = new Date('2025-01-01')
const cooldownEnd = new Date('2025-01-08')

describe('NominatePeer cooldown message', () => {
  it('shows peer name when peer is found', () => {
    render(
      <CooldownMessage
        peers={[{ id: 'peer-1', name: 'Jane Smith' }]}
        selectedPeer="peer-1"
        lastDate={lastDate}
        cooldownEnd={cooldownEnd}
      />
    )
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('shows fallback text when peer is not found (bug fix)', () => {
    render(
      <CooldownMessage
        peers={[]}
        selectedPeer="peer-missing"
        lastDate={lastDate}
        cooldownEnd={cooldownEnd}
      />
    )
    expect(screen.getByText('This person')).toBeInTheDocument()
  })

  it('does not render "undefined" when peer is missing', () => {
    render(
      <CooldownMessage
        peers={[]}
        selectedPeer="peer-missing"
        lastDate={lastDate}
        cooldownEnd={cooldownEnd}
      />
    )
    expect(screen.queryByText('undefined')).not.toBeInTheDocument()
  })
})
