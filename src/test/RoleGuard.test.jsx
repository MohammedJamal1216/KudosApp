import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import RoleGuard from '../components/RoleGuard'

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}))

// Mock AppContext
vi.mock('../context/AppContext', () => ({
  useAppContext: vi.fn(),
}))

// Mock ConfigContext
vi.mock('../context/ConfigContext', () => ({
  useConfig: vi.fn(),
}))

import { useAppContext } from '../context/AppContext'
import { useConfig } from '../context/ConfigContext'

function setup(accessRole, allowedRole, managersCanVoteOnOthers = false) {
  useAppContext.mockReturnValue({ currentUser: accessRole ? { accessRole, name: 'Test User' } : null })
  useConfig.mockReturnValue({ config: { managersCanVoteOnOthers } })
  return render(
    <RoleGuard allowedRole={allowedRole}>
      <div>Protected Content</div>
    </RoleGuard>
  )
}

describe('RoleGuard', () => {
  it('renders nothing when currentUser is null', () => {
    const { container } = setup(null, 'employee')
    expect(container).toBeEmptyDOMElement()
  })

  it('allows admin to access employee route', () => {
    setup('admin', 'employee')
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('allows admin to access manager route', () => {
    setup('admin', 'manager')
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('allows employee to access employee route', () => {
    setup('employee', 'employee')
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('blocks employee from accessing manager route', () => {
    setup('employee', 'manager')
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    expect(screen.getByText('Access Restricted')).toBeInTheDocument()
  })

  it('allows manager to access vote when managersCanVoteOnOthers is true', () => {
    setup('manager', 'employee', true)
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('blocks manager from vote when managersCanVoteOnOthers is false', () => {
    setup('manager', 'employee', false)
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    expect(screen.getByText('Access Restricted')).toBeInTheDocument()
  })
})
