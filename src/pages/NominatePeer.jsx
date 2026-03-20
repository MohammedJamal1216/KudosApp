import { useState } from "react";
import Avatar from "../components/Avatar";
import { useAppContext } from "../context/AppContext";

const categories = [
  { id: "team",        emoji: "🤝", label: "Team Player",          desc: "Collaborates and supports the team" },
  { id: "innovation",  emoji: "💡", label: "Innovation",           desc: "Brings creative solutions" },
  { id: "leadership",  emoji: "🚀", label: "Leadership",           desc: "Guides and mentors others" },
  { id: "helping",     emoji: "🌟", label: "Helping Others",       desc: "Always ready to lend a hand" },
  { id: "beyond",      emoji: "🔥", label: "Above & Beyond",       desc: "Goes the extra mile." },
  { id: "rising",      emoji: "🌟", label: "Rising Star",          desc: "Shows great potential and growth." },
  { id: "performance", emoji: "🎯", label: "Performance Champion", desc: "Delivers strong results consistently." },
];

function SkeletonPeerCard() {
  return (
    <div style={{
      background: "#f1f5f9", borderRadius: 16, height: 80,
      animation: "pulse 1.5s ease-in-out infinite",
    }} />
  );
}

export default function NominatePeer() {
  const { employees, currentUser, addNomination, isLoadingEmployees, graphError } = useAppContext();

  const peers = employees.filter(e => e.id !== currentUser?.id);

  const [selectedPeer, setSelectedPeer] = useState(null);
  const [selectedCat, setSelectedCat]   = useState("innovation");
  const [reason, setReason]             = useState("");
  const [search, setSearch]             = useState("");
  const [submitted, setSubmitted]       = useState(false);

  // Reset selection when peers load for the first time
  const filtered = peers.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.department.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = () => {
    if (!selectedPeer || !selectedCat || !reason.trim()) return;
    addNomination(selectedPeer, selectedCat, reason);
    setSubmitted(true);
  };

  if (submitted) {
    const peer = peers.find(p => p.id === selectedPeer);
    const cat  = categories.find(c => c.id === selectedCat);
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
        <div style={{ textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: 80, marginBottom: 24 }}>🎉</div>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: "#1d2940", marginBottom: 8 }}>Nomination Submitted!</h2>
          <p style={{ fontSize: 18, color: "#62748e", marginBottom: 32 }}>
            You nominated <strong style={{ color: "#4f38f5" }}>{peer?.name}</strong> for <strong>{cat?.label}</strong>
          </p>
          <button
            onClick={() => { setSubmitted(false); setReason(""); setSelectedPeer(null); }}
            style={{ background: "#4f38f5", color: "#fff", border: "none", borderRadius: 14, padding: "14px 36px", fontSize: 16, fontWeight: 700, cursor: "pointer" }}
          >
            Nominate Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", color: "#1d2940" }}>

      {/* Error banner */}
      {graphError && (
        <div style={{
          background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 14,
          padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center",
          gap: 12, fontSize: 14, fontWeight: 600, color: "#e11d48",
        }}>
          <span>⚠️</span>
          <span>Could not load employees: {graphError}</span>
          <button onClick={() => window.location.reload()} style={{ marginLeft: "auto", background: "#e11d48", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Retry</button>
        </div>
      )}

      {/* ── HERO BANNER ── */}
      <div style={{
        background: "rgba(255,255,255,0.7)", border: "1px solid #fff", borderRadius: 32,
        boxShadow: "0 8px 30px rgba(0,0,0,0.04)", padding: "40px 48px", marginBottom: 24,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: 80, top: -20, width: 146, height: 146, borderRadius: "50%", background: "linear-gradient(135deg,#6160ff,#ad46ff)", opacity: 0.08 }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: "linear-gradient(135deg,#6160ff,#2d7fe8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 15px rgba(97,96,255,0.4), 0 10px 15px rgba(97,96,255,0.2)",
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h1 style={{ fontSize: 44, fontWeight: 900, color: "#1d2940", margin: 0, lineHeight: 1.1 }}>Nominate a Peer</h1>
          </div>
          <p style={{ fontSize: 18, fontWeight: 600, color: "#1d2940", margin: 0, maxWidth: 600 }}>
            Recognize someone's hard work, leadership, or great attitude. Make their day!
          </p>
        </div>
        <div style={{ fontSize: 90, lineHeight: 1, filter: "drop-shadow(0 8px 24px rgba(246,51,160,0.15))" }}>🏅</div>
      </div>

      {/* ── FORM CARD ── */}
      <div style={{
        background: "rgba(255,255,255,0.8)", border: "1px solid #fff", borderRadius: 32,
        boxShadow: "0 20px 40px rgba(0,0,0,0.06)", padding: 40,
        display: "flex", flexDirection: "column", gap: 40,
      }}>

        {/* ── SECTION 1: Who ── */}
        <section>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1d2940", margin: 0 }}>1. Whom are you nominating?</h2>
            <div style={{ position: "relative" }}>
              <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="#90a3b8" strokeWidth="2"/>
                <path d="m21 21-4.35-4.35" stroke="#90a3b8" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name..."
                style={{
                  width: 250, height: 47, borderRadius: 14, border: "1.5px solid #eef2ff",
                  background: "#fff", paddingLeft: 44, paddingRight: 16, fontSize: 14,
                  fontWeight: 600, color: "#1d2940", outline: "none", fontFamily: "inherit",
                }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {isLoadingEmployees ? (
              [1,2,3,4,5,6,7,8].map(i => <SkeletonPeerCard key={i} />)
            ) : (
              <>
                {filtered.map(peer => {
                  const isSelected = selectedPeer === peer.id;
                  return (
                    <button key={peer.id} onClick={() => setSelectedPeer(peer.id)} style={{
                      background: isSelected ? "#eceaff" : "#fff",
                      border: isSelected ? "1.5px solid #4f38f5" : "1.5px solid #f8fafc",
                      borderRadius: 16, padding: "16px", cursor: "pointer", textAlign: "left",
                      display: "flex", alignItems: "center", gap: 14,
                      boxShadow: isSelected ? "0 1px 3px rgba(79,56,245,0.15)" : "0 1px 3px rgba(0,0,0,0.1)",
                      transition: "all 0.15s ease",
                    }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = "#d0c9ff"; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = "#f8fafc"; }}
                    >
                      {peer.photoUrl ? (
                        <img src={peer.photoUrl} alt={peer.name} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                      ) : (
                        <Avatar initials={peer.initials} bg={peer.avatarBg} size={48} />
                      )}
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#1d2940", lineHeight: 1.3 }}>{peer.name}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: isSelected ? "#4f38f5" : "#6160ff" }}>{peer.department}</div>
                      </div>
                    </button>
                  );
                })}
                {filtered.length === 0 && (
                  <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 32, color: "#90a3b8", fontSize: 15, fontWeight: 600 }}>
                    No results for "{search}"
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <div style={{ borderTop: "1px solid #f1f5f9" }} />

        {/* ── SECTION 2: Category ── */}
        <section>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1d2940", margin: "0 0 20px" }}>2. Choose a category</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {categories.map(cat => {
              const isSelected = selectedCat === cat.id;
              return (
                <button key={cat.id} onClick={() => setSelectedCat(cat.id)} style={{
                  background: isSelected ? "#eceaff" : "#fff",
                  border: isSelected ? "1.5px solid #4f38f5" : "1.5px solid #f8fafc",
                  borderRadius: 16, padding: 22, cursor: "pointer", textAlign: "left",
                  boxShadow: isSelected ? "0 1px 3px rgba(79,56,245,0.15)" : "0 1px 3px rgba(0,0,0,0.1)",
                  transition: "all 0.15s ease",
                }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = "#d0c9ff"; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = "#f8fafc"; }}
                >
                  <div style={{ fontSize: 30, marginBottom: 10 }}>{cat.emoji}</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#1d2940", marginBottom: 6 }}>{cat.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#62748e", lineHeight: 1.4 }}>{cat.desc}</div>
                </button>
              );
            })}
          </div>
        </section>

        <div style={{ borderTop: "1px solid #f1f5f9" }} />

        {/* ── SECTION 3: Reason ── */}
        <section>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1d2940", margin: "0 0 16px" }}>
            3. Why do they deserve this?*
          </h2>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Share specific examples of what they did..."
            style={{
              width: "100%", minHeight: 140, borderRadius: 16,
              border: "1.5px solid #f1f5f9",
              background: "rgba(247,250,252,0.5)",
              padding: 20, fontSize: 15, fontWeight: 500,
              color: "#1d2940", fontFamily: "inherit", resize: "vertical",
              outline: "none", boxSizing: "border-box",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
              lineHeight: 1.6,
            }}
            onFocus={e => { e.target.style.borderColor = "#c4b5fd"; e.target.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.05), 0 0 0 3px rgba(79,56,245,0.08)"; }}
            onBlur={e => { e.target.style.borderColor = "#f1f5f9"; e.target.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.05)"; }}
          />
          <div style={{ textAlign: "right", marginTop: 6, fontSize: 12, color: "#90a3b8", fontWeight: 500 }}>
            {reason.length} characters
          </div>
        </section>

        {/* ── SUBMIT ── */}
        <div>
          <button
            onClick={handleSubmit}
            disabled={!selectedPeer || !selectedCat || !reason.trim()}
            style={{
              background: (!selectedPeer || !selectedCat || !reason.trim()) ? "#e2e8f0" : "#1d2940",
              color: (!selectedPeer || !selectedCat || !reason.trim()) ? "#90a3b8" : "#fff",
              border: "none", borderRadius: 16, padding: "19px 48px",
              fontSize: 18, fontWeight: 700,
              cursor: (!selectedPeer || !selectedCat || !reason.trim()) ? "not-allowed" : "pointer",
              display: "inline-flex", alignItems: "center", gap: 12,
              transition: "all 0.2s ease",
              boxShadow: (!selectedPeer || !selectedCat || !reason.trim()) ? "none" : "0 4px 12px rgba(29,41,64,0.25)",
            }}
            onMouseEnter={e => { if (selectedPeer && selectedCat && reason.trim()) { e.currentTarget.style.background = "#4f38f5"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(79,56,245,0.35)"; }}}
            onMouseLeave={e => { if (selectedPeer && selectedCat && reason.trim()) { e.currentTarget.style.background = "#1d2940"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(29,41,64,0.25)"; }}}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Submit Nomination
          </button>

          {selectedPeer && selectedCat && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginLeft: 20, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 999, padding: "8px 16px", fontSize: 13, fontWeight: 600, color: "#16a34a" }}>
              <span>✓</span>
              Nominating <strong>{peers.find(p => p.id === selectedPeer)?.name}</strong> for <strong>{categories.find(c => c.id === selectedCat)?.label}</strong>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}
