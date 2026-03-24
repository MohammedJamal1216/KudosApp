import { createContext, useContext, useEffect, useState } from 'react'
import { useMsal } from '@azure/msal-react'
import { loginRequest } from '../auth/msalConfig'
import { getGraphClient } from '../auth/graphClient'
import { employees as seedEmployees } from '../data/employees'
import { GOOGLE_USER_KEY } from '../auth/AuthWrapper'
import { supabase } from '../lib/supabase'

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
  return (name || '').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

const ADMIN_EMAIL_OVERRIDES = ['jamal@sharepointdesigns.com', 'anish@sharepointdesigns.com']

const MANAGER_TITLE_KEYWORDS = [
  'manager', 'lead', 'director', 'head', 'vp', 'vice president',
  'chief', 'president', 'supervisor', 'coordinator',
]

function getAccessRole(email, jobTitle) {
  if (ADMIN_EMAIL_OVERRIDES.includes((email || '').toLowerCase())) return 'admin'
  const title = (jobTitle || '').toLowerCase()
  return MANAGER_TITLE_KEYWORDS.some(k => title.includes(k)) ? 'manager' : 'employee'
}

// Map a Supabase nominations row → app nomination shape
function mapRow(row, empMap) {
  const nomineeFromDir = empMap[row.nominee_id]
  const nominatorFromDir = empMap[row.nominator_id]
  return {
    id: row.id,
    nominee: {
      id: row.nominee_id,
      name: row.nominee_name || '',
      role: nomineeFromDir?.role || row.nominee_role || '',
      initials: row.nominee_initials || '',
      avatarBg: row.nominee_avatar_bg || GRADIENT_PALETTE[0],
      photoUrl: nomineeFromDir?.photoUrl || null,
    },
    nominatedBy: {
      id: row.nominator_id,
      name: row.nominator_name || '',
      initials: row.nominator_initials || '',
      avatarBg: nominatorFromDir?.avatarBg || GRADIENT_PALETTE[0],
      photoUrl: nominatorFromDir?.photoUrl || null,
    },
    category: row.category || '',
    message: row.message || '',
    votes: row.vote_count || 0,
    createdAt: row.created_at || null,
  }
}

async function loadSupabaseData(userId, empMap) {
  const [{ data: nomRows }, { data: voteRows }] = await Promise.all([
    supabase.from('nominations').select('*').order('created_at', { ascending: false }),
    supabase.from('votes').select('nomination_id').eq('voter_id', userId),
  ])

  const nominations = (nomRows || []).map(row => mapRow(row, empMap))
  const votedIds = new Set((voteRows || []).map(v => v.nomination_id))
  return { nominations, votedIds }
}

const AppContext = createContext(null)

export function AppContextProvider({ children }) {
  const { instance, accounts } = useMsal()
  const [currentUser, setCurrentUser] = useState(null)
  const [employees, setEmployees] = useState([])
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true)
  const [graphError, setGraphError] = useState(null)
  const [nominations, setNominations] = useState([])
  const [votedIds, setVotedIds] = useState(new Set())
  const [dbError, setDbError] = useState(null)

  useEffect(() => {
    // ── Google login path ──
    if (!accounts.length) {
      try {
        const googleUser = JSON.parse(sessionStorage.getItem(GOOGLE_USER_KEY) || 'null')
        if (googleUser) {
          const user = {
            id: googleUser.id,
            name: googleUser.name,
            role: '',
            department: '',
            email: googleUser.email,
            accessRole: getAccessRole(googleUser.email, ''),
            initials: getInitials(googleUser.name),
            avatarBg: GRADIENT_PALETTE[0],
            photoUrl: googleUser.picture || null,
            provider: 'google',
          }
          setCurrentUser(user)

          const empList = seedEmployees.map((u, idx) => ({
            id: u.id, name: u.name, role: u.role || '', department: u.department || '',
            initials: getInitials(u.name), avatarBg: GRADIENT_PALETTE[idx % GRADIENT_PALETTE.length], photoUrl: null,
          }))
          setEmployees(empList)

          const empMap = Object.fromEntries(empList.map(e => [e.id, e]))
          loadSupabaseData(user.id, empMap).then(({ nominations, votedIds }) => {
            setNominations(nominations)
            setVotedIds(votedIds)
          }).catch(console.error)

          setIsLoadingEmployees(false)
        }
      } catch { /* ignore */ }
      return
    }

    // ── Microsoft login path ──
    async function loadData() {
      setIsLoadingEmployees(true)
      setGraphError(null)

      try {
        const tokenResponse = await instance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        })
        const client = getGraphClient(tokenResponse.accessToken)

        // Load current user
        const meResult = await client.api('/me')
          .select('id,displayName,jobTitle,department,userPrincipalName,mail')
          .get()

        let photoUrl = null
        try {
          const photoBlob = await client.api('/me/photo/$value').get()
          photoUrl = URL.createObjectURL(photoBlob)
        } catch { /* no photo */ }

        const email = meResult.mail || meResult.userPrincipalName || ''
        const user = {
          id: meResult.id,
          name: meResult.displayName || 'You',
          role: meResult.jobTitle || '',
          department: meResult.department || '',
          email,
          accessRole: getAccessRole(email, meResult.jobTitle),
          initials: getInitials(meResult.displayName || 'You'),
          avatarBg: GRADIENT_PALETTE[0],
          photoUrl,
        }
        setCurrentUser(user)

        // Load employees
        let empList = []
        try {
          let userList = []
          let response = await client
            .api('/users')
            .select('id,displayName,jobTitle,department')
            .filter("accountEnabled eq true and userType eq 'Member'")
            .top(999)
            .get()
          userList = [...(response.value || [])]
          while (response['@odata.nextLink']) {
            response = await client.api(response['@odata.nextLink']).get()
            userList = [...userList, ...(response.value || [])]
          }

          const photoResults = await Promise.allSettled(
            userList.map(u => client.api(`/users/${u.id}/photo/$value`).get())
          )
          empList = userList.map((u, idx) => {
            let uPhotoUrl = null
            if (photoResults[idx].status === 'fulfilled') {
              try { uPhotoUrl = URL.createObjectURL(photoResults[idx].value) } catch { /* ignore */ }
            }
            return {
              id: u.id, name: u.displayName || '', role: u.jobTitle || '',
              department: u.department || '', initials: getInitials(u.displayName || '?'),
              avatarBg: GRADIENT_PALETTE[idx % GRADIENT_PALETTE.length], photoUrl: uPhotoUrl,
            }
          })
        } catch {
          empList = seedEmployees.map((u, idx) => ({
            id: u.id, name: u.name, role: u.role || '', department: u.department || '',
            initials: getInitials(u.name), avatarBg: GRADIENT_PALETTE[idx % GRADIENT_PALETTE.length], photoUrl: null,
          }))
        }
        setEmployees(empList)

        // Load nominations + votes from Supabase
        const empMap = Object.fromEntries(empList.map(e => [e.id, e]))
        const { nominations, votedIds } = await loadSupabaseData(user.id, empMap)
        setNominations(nominations)
        setVotedIds(votedIds)

      } catch (err) {
        console.error('Graph API error:', err)
        setGraphError(err.message || 'Failed to load data from Microsoft Graph.')
      } finally {
        setIsLoadingEmployees(false)
      }
    }

    loadData()
  }, [accounts, instance])

  async function addNomination(nomineeId, catId, message) {
    const nominee = employees.find(e => e.id === nomineeId)
    if (!nominee || !currentUser) return false

    setDbError(null)
    const { data, error } = await supabase.from('nominations').insert({
      nominee_id: nominee.id,
      nominee_name: nominee.name,
      nominee_initials: nominee.initials,
      nominee_avatar_bg: nominee.avatarBg || '',
      nominee_role: nominee.role || '',
      nominator_id: currentUser.id,
      nominator_name: currentUser.name,
      nominator_initials: currentUser.initials,
      category: catId,
      message,
      vote_count: 0,
    }).select().single()

    if (error) {
      console.error('Failed to save nomination:', error)
      setDbError(error.message || 'Failed to save nomination. Please try again.')
      return false
    }

    setNominations(prev => [{
      id: data.id,
      nominee,
      nominatedBy: currentUser,
      category: catId,
      message,
      votes: 0,
      createdAt: data.created_at,
    }, ...prev])
    return true
  }

  async function castVote(nominationId) {
    if (!currentUser) return
    if (votedIds.has(nominationId)) return
    const nomination = nominations.find(n => n.id === nominationId)
    if (!nomination) return

    const newVoteCount = nomination.votes + 1

    // Optimistic update
    setVotedIds(prev => new Set([...prev, nominationId]))
    setNominations(prev => prev.map(n => n.id === nominationId ? { ...n, votes: newVoteCount } : n))

    const [voteResult, updateResult] = await Promise.all([
      supabase.from('votes').insert({ nomination_id: nominationId, voter_id: currentUser.id }),
      supabase.from('nominations').update({ vote_count: newVoteCount }).eq('id', nominationId),
    ])

    if (voteResult.error || updateResult.error) {
      console.error('Failed to save vote:', voteResult.error || updateResult.error)
      // Revert
      setVotedIds(prev => { const s = new Set(prev); s.delete(nominationId); return s })
      setNominations(prev => prev.map(n => n.id === nominationId ? { ...n, votes: nomination.votes } : n))
    }
  }

  return (
    <AppContext.Provider value={{
      currentUser, employees, isLoadingEmployees, graphError,
      nominations, votedIds, addNomination, castVote, dbError,
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
