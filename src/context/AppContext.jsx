import { createContext, useContext, useEffect, useState } from 'react'
import { useMsal } from '@azure/msal-react'
import { loginRequest } from '../auth/msalConfig'
import { getGraphClient } from '../auth/graphClient'
import { nominations as seedNominations, employees as seedEmployees } from '../data/employees'

const GRADIENT_PALETTE = [
  'linear-gradient(135deg,#6160ff,#ad46ff)',
  'linear-gradient(135deg,#f9a825,#ff6f00)',
  'linear-gradient(135deg,#00c9a7,#48dbfb)',
  'linear-gradient(135deg,#f633a0,#ff6b6b)',
  'linear-gradient(135deg,#43e97b,#38f9d7)',
  'linear-gradient(135deg,#f093fb,#f5576c)',
  'linear-gradient(135deg,#4facfe,#00f2fe)',
  'linear-gradient(135deg,#a18cd1,#fbc2eb)',
  'linear-gradient(135deg,#fd7b5f,#ef4767)',
]

function getInitials(name) {
  return (name || '')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const AppContext = createContext(null)

export function AppContextProvider({ children }) {
  const { instance, accounts } = useMsal()
  const [currentUser, setCurrentUser] = useState(null)
  const [employees, setEmployees] = useState([])
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true)
  const [graphError, setGraphError] = useState(null)
  const [nominations, setNominations] = useState(seedNominations)
  const [votedIds, setVotedIds] = useState(new Set())

  useEffect(() => {
    if (!accounts.length) return

    async function loadData() {
      setIsLoadingEmployees(true)
      setGraphError(null)

      try {
        const tokenResponse = await instance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        })
        const token = tokenResponse.accessToken
        const client = getGraphClient(token)

        // Load current user — User.Read only (no admin consent needed)
        const meResult = await client.api('/me').select('id,displayName,jobTitle,department').get()

        let photoUrl = null
        try {
          const photoBlob = await client.api('/me/photo/$value').get()
          photoUrl = URL.createObjectURL(photoBlob)
        } catch {
          // no photo — use initials
        }

        const me = {
          id: meResult.id,
          name: meResult.displayName || 'You',
          role: meResult.jobTitle || 'Employee',
          department: meResult.department || 'Unknown',
          initials: getInitials(meResult.displayName || 'You'),
          avatarBg: GRADIENT_PALETTE[0],
          photoUrl,
        }
        setCurrentUser(me)

        // Try to load full directory — requires admin consent.
        // If it fails, fall back to seed employee data silently.
        try {
          const usersResult = await client.api('/users').select('id,displayName,jobTitle,department').top(50).get()
          const userList = usersResult.value || []

          const photoResults = await Promise.allSettled(
            userList.map(u => client.api(`/users/${u.id}/photo/$value`).get())
          )

          const normalised = userList.map((u, idx) => {
            let uPhotoUrl = null
            if (photoResults[idx].status === 'fulfilled') {
              try { uPhotoUrl = URL.createObjectURL(photoResults[idx].value) } catch { /* ignore */ }
            }
            return {
              id: u.id,
              name: u.displayName || 'Unknown',
              role: u.jobTitle || 'Employee',
              department: u.department || 'Unknown',
              initials: getInitials(u.displayName || '?'),
              avatarBg: GRADIENT_PALETTE[idx % GRADIENT_PALETTE.length],
              photoUrl: uPhotoUrl,
            }
          })
          setEmployees(normalised)
        } catch {
          // No admin consent — use seed data, normalised to the same shape
          const normalised = seedEmployees.map((u, idx) => ({
            id: u.id,
            name: u.name,
            role: u.role || 'Employee',
            department: u.department || 'Unknown',
            initials: getInitials(u.name),
            avatarBg: GRADIENT_PALETTE[idx % GRADIENT_PALETTE.length],
            photoUrl: null,
          }))
          setEmployees(normalised)
        }
      } catch (err) {
        console.error('Graph API error:', err)
        setGraphError(err.message || 'Failed to load data from Microsoft Graph.')
      } finally {
        setIsLoadingEmployees(false)
      }
    }

    loadData()
  }, [accounts, instance])

  function addNomination(nomineeId, catId, message) {
    const nominee = employees.find(e => e.id === nomineeId)
    if (!nominee || !currentUser) return
    setNominations(prev => [...prev, {
      id: Date.now(),
      nominee,
      nominatedBy: currentUser,
      category: catId,
      message,
      votes: 0,
    }])
  }

  function castVote(nominationId) {
    if (votedIds.has(nominationId)) return
    setVotedIds(prev => new Set([...prev, nominationId]))
    setNominations(prev =>
      prev.map(n => n.id === nominationId ? { ...n, votes: n.votes + 1 } : n)
    )
  }

  return (
    <AppContext.Provider value={{
      currentUser,
      employees,
      isLoadingEmployees,
      graphError,
      nominations,
      votedIds,
      addNomination,
      castVote,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used inside AppContextProvider')
  return ctx
}
