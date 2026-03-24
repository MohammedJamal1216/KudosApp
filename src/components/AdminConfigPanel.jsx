import { useState } from 'react'
import { useConfig } from '../context/ConfigContext'

function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        width: 52, height: 28, borderRadius: 999, border: 'none', cursor: 'pointer',
        background: checked ? 'linear-gradient(135deg,#4f38f5,#ad46ff)' : '#e2e8f0',
        position: 'relative', transition: 'background 0.25s ease', flexShrink: 0,
        boxShadow: checked ? '0 2px 8px rgba(79,56,245,0.35)' : 'inset 0 1px 3px rgba(0,0,0,0.1)',
        padding: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: checked ? 27 : 3,
        width: 22, height: 22, borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s ease', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
      }} />
    </button>
  )
}

const COOLDOWN_PRESETS = [
  { label: '1 month',  days: 30 },
  { label: '2 months', days: 60 },
  { label: '3 months', days: 90 },
  { label: '6 months', days: 180 },
  { label: 'Custom',   days: null },
]

export default function AdminConfigPanel({ onClose }) {
  const { config, updateConfig } = useConfig()

  const isPreset = COOLDOWN_PRESETS.some(p => p.days === config.nominationCooldownDays)
  const [isCustom, setIsCustom] = useState(!isPreset)
  const [customDays, setCustomDays] = useState(isPreset ? '' : String(config.nominationCooldownDays))

  function handleCooldownPreset(days) {
    if (days === null) {
      setIsCustom(true)
    } else {
      setIsCustom(false)
      updateConfig('nominationCooldownDays', days)
    }
  }

  function handleCustomDays(val) {
    setCustomDays(val)
    const n = parseInt(val, 10)
    if (!isNaN(n) && n > 0) updateConfig('nominationCooldownDays', n)
  }

  const configItems = [
    {
      key: 'managersCanVoteOnOthers',
      label: "Managers Can Vote on Others' Nominations",
      icon: '👔',
      description: config.managersCanVoteOnOthers
        ? "Managers can vote on nominations submitted by other managers. Managers can never vote on their own nominations."
        : "Managers cannot vote on any nominations, regardless of who submitted them.",
    },
    {
      key: 'employeesCanSelfVote',
      label: 'Employees Can Self-Vote',
      icon: '🗳️',
      description: config.employeesCanSelfVote
        ? 'Employees can vote for themselves if they have been nominated.'
        : 'Employees cannot vote on their own nominations.',
    },
  ]

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(15,20,40,0.35)',
        zIndex: 200, backdropFilter: 'blur(4px)',
      }} />

      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 440,
        background: '#fff', zIndex: 201, display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.12)',
        fontFamily: "'Inter','Segoe UI',sans-serif",
      }}>
        {/* Header */}
        <div style={{
          padding: '28px 32px 24px', borderBottom: '1px solid #f1f5f9',
          background: 'linear-gradient(135deg, #f8f7ff 0%, #fdf2ff 100%)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'linear-gradient(135deg,#4f38f5,#ad46ff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(79,56,245,0.3)',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: '#1d2840' }}>Admin Config</h2>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#8b5cf6' }}>Admin access only</p>
              </div>
            </div>
            <button onClick={onClose} style={{
              background: '#f1f5f9', border: 'none', borderRadius: 10, width: 36, height: 36,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#627490', fontSize: 18, fontWeight: 700,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#e2e8f0' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9' }}
            >✕</button>
          </div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: '#627490', lineHeight: 1.5 }}>
            Configure nomination and voting rules. Changes take effect immediately.
          </p>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {configItems.map(({ key, label, icon, description }) => (
            <div key={key} style={{
              background: config[key] ? 'linear-gradient(135deg,#f5f3ff,#fdf4ff)' : '#fafafa',
              border: `1.5px solid ${config[key] ? '#d0c9ff' : '#e2e8f0'}`,
              borderRadius: 18, padding: '18px 20px', transition: 'all 0.2s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: config[key] ? 'linear-gradient(135deg,#eceaff,#f5e8ff)' : '#f1f5f9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, border: `1px solid ${config[key] ? '#d0c9ff' : '#e2e8f0'}`,
                }}>{icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1d2840' }}>{label}</div>
                    <Toggle checked={config[key]} onChange={val => updateConfig(key, val)} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: '#627490', lineHeight: 1.5 }}>{description}</div>
                </div>
              </div>
            </div>
          ))}

          {/* Block Repeat Nominations */}
          <div style={{
            background: config.blockRepeatNominations ? 'linear-gradient(135deg,#f5f3ff,#fdf4ff)' : '#fafafa',
            border: `1.5px solid ${config.blockRepeatNominations ? '#d0c9ff' : '#e2e8f0'}`,
            borderRadius: 18, padding: '18px 20px', transition: 'all 0.2s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: config.blockRepeatNominations ? 'linear-gradient(135deg,#eceaff,#f5e8ff)' : '#f1f5f9',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, border: `1px solid ${config.blockRepeatNominations ? '#d0c9ff' : '#e2e8f0'}`,
              }}>🔄</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1d2840' }}>Block Repeat Nominations</div>
                  <Toggle checked={config.blockRepeatNominations} onChange={val => updateConfig('blockRepeatNominations', val)} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#627490', lineHeight: 1.5, marginBottom: config.blockRepeatNominations ? 14 : 0 }}>
                  {config.blockRepeatNominations
                    ? 'A cooldown period applies before the same person can be nominated again.'
                    : 'Anyone can be nominated at any time with no restrictions.'}
                </div>

                {config.blockRepeatNominations && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#4f38f5', marginBottom: 8 }}>Cooldown Period</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {COOLDOWN_PRESETS.map(preset => {
                        const isSelected = preset.days === null
                          ? isCustom
                          : !isCustom && config.nominationCooldownDays === preset.days
                        return (
                          <button key={preset.label} onClick={() => handleCooldownPreset(preset.days)} style={{
                            padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700,
                            cursor: 'pointer', border: `1.5px solid ${isSelected ? '#4f38f5' : '#d0c9ff'}`,
                            background: isSelected ? '#4f38f5' : '#f5f3ff',
                            color: isSelected ? '#fff' : '#4f38f5', transition: 'all 0.15s ease',
                          }}>{preset.label}</button>
                        )
                      })}
                    </div>
                    {isCustom && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
                        <input
                          type="number" min="1" value={customDays}
                          onChange={e => handleCustomDays(e.target.value)}
                          placeholder="e.g. 45"
                          style={{
                            width: 90, height: 36, borderRadius: 10, border: '1.5px solid #c4b5fd',
                            padding: '0 12px', fontSize: 14, fontWeight: 600, color: '#1d2840',
                            fontFamily: 'inherit', outline: 'none',
                          }}
                          onFocus={e => { e.target.style.borderColor = '#4f38f5' }}
                          onBlur={e => { e.target.style.borderColor = '#c4b5fd' }}
                        />
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#627490' }}>days</span>
                      </div>
                    )}
                    <div style={{
                      marginTop: 10, padding: '8px 12px', background: '#eceaff',
                      borderRadius: 10, fontSize: 12, fontWeight: 600, color: '#4f38f5',
                    }}>
                      Current cooldown: <strong>{config.nominationCooldownDays} day{config.nominationCooldownDays !== 1 ? 's' : ''}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '20px 32px', borderTop: '1px solid #f1f5f9',
          background: '#fafafa', fontSize: 12, fontWeight: 500, color: '#90a3b8',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#90a3b8" strokeWidth="2"/>
            <path d="M12 8v4m0 4h.01" stroke="#90a3b8" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Settings are saved automatically and persist across sessions.
        </div>
      </div>
    </>
  )
}
