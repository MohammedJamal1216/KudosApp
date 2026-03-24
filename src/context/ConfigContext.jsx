import { createContext, useContext, useState } from 'react'

const STORAGE_KEY = 'kudos_admin_config'

const DEFAULT_CONFIG = {
  managersCanVoteOnOthers: false,
  employeesCanSelfVote: false,
  blockRepeatNominations: false,
  nominationCooldownDays: 30,
}

function loadConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG
  } catch {
    return DEFAULT_CONFIG
  }
}

const ConfigContext = createContext(null)

export function ConfigContextProvider({ children }) {
  const [config, setConfig] = useState(loadConfig)

  function updateConfig(key, value) {
    setConfig(prev => {
      const next = { ...prev, [key]: value }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  return (
    <ConfigContext.Provider value={{ config, updateConfig }}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  const ctx = useContext(ConfigContext)
  if (!ctx) throw new Error('useConfig must be used inside ConfigContextProvider')
  return ctx
}
