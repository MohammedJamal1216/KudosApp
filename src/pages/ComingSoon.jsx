export default function ComingSoon({ title, color = '#4F38F6' }) {
  return (
    <div
      className="bg-white flex flex-col items-center justify-center text-center"
      style={{
        borderRadius: '20px',
        border: '1px solid #E2EBF0',
        padding: '72px 40px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
      }}
    >
      <div
        className="flex items-center justify-center text-white"
        style={{
          width: 64,
          height: 64,
          borderRadius: 20,
          background: color,
          marginBottom: 24,
        }}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9"/>
          <path d="M12 7v5l3 2"/>
        </svg>
      </div>
      <h1 className="text-[28px] font-black" style={{ color: '#0F1729' }}>
        {title}
      </h1>
      <p className="text-[15px] font-semibold mt-3" style={{ color: '#627490' }}>
        This section is coming soon — we're still building it.
      </p>
    </div>
  )
}
