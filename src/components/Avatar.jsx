export default function Avatar({ initials, bg, size = 40 }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontWeight: 800,
      fontSize: size * 0.32,
      flexShrink: 0,
      letterSpacing: 0.5,
    }}>
      {initials}
    </div>
  )
}
