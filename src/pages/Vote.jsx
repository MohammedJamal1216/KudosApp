import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useConfig } from "../context/ConfigContext";

function CategoryPill({ label }) {
  return (
    <span style={{
      background: "#ece9fa", border: "1px solid #d1c8fa", borderRadius: 999,
      padding: "4px 12px", fontSize: 12, fontWeight: 700, color: "#4f38f5",
    }}>{label}</span>
  );
}

function AvatarCircle({ photoUrl, name, initials, avatarBg, size = 64 }) {
  if (photoUrl) {
    return (
      <img src={photoUrl} alt={name} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: avatarBg || "linear-gradient(135deg,#6160ff,#ad46ff)",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 800, fontSize: size * 0.3,
      flexShrink: 0, letterSpacing: 0.5,
    }}>
      {initials || "?"}
    </div>
  );
}

export default function Vote() {
  const { nominations, currentUser, votedIds, castVote, isLoadingEmployees, graphError } = useAppContext();
  const { config } = useConfig();
  const [search, setSearch] = useState("");
  const MAX_VOTES = 3;
  const remaining = MAX_VOTES - votedIds.size;

  const isManager = currentUser?.accessRole === 'manager' || currentUser?.accessRole === 'admin'
  const candidates = nominations.filter(n => {
    if (!isManager && !config.employeesCanSelfVote && n.nominee?.id === currentUser?.id) return false
    if (isManager && n.nominatedBy?.id === currentUser?.id) return false
    return true
  });

  const filtered = candidates.filter(c =>
    (c.nominee?.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.nominee?.department || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Error banner */}
      {graphError && (
        <div style={{
          background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 14,
          padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center",
          gap: 12, fontSize: 14, fontWeight: 600, color: "#e11d48",
        }}>
          <span>⚠️</span>
          <span>Could not load data: {graphError}</span>
          <button onClick={() => window.location.reload()} style={{ marginLeft: "auto", background: "#e11d48", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Retry</button>
        </div>
      )}

      {/* ── HERO BANNER ── */}
      <div style={{
        background: "rgba(255,255,255,0.7)", border: "1px solid #fff", borderRadius: 32,
        boxShadow: "0 8px 30px rgba(0,0,0,0.04)", padding: "40px 48px", marginBottom: 24,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: "linear-gradient(135deg,#f633a0,#ad46ff)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 15px rgba(246,51,160,0.35), 0 10px 15px rgba(246,51,160,0.2)",
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 style={{ fontSize: 44, fontWeight: 900, color: "#1d2940", margin: 0 }}>Vote</h1>
          </div>
          <p style={{ fontSize: 18, fontWeight: 600, color: "#1d2940", margin: 0 }}>
            Cast your vote to appreciate outstanding contributions.
          </p>
        </div>

        {/* Votes remaining counter */}
        <div style={{
          background: "#fff", border: "1px solid #f1f5f9", borderRadius: 16,
          padding: "20px 24px", display: "flex", alignItems: "center", gap: 20,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)", minWidth: 180,
        }}>
          <div style={{ width: 64, height: 64, borderRadius: 14, border: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{
              fontSize: 36, fontWeight: 900,
              background: remaining > 0 ? "linear-gradient(180deg,#f633a0,#ff8904)" : "linear-gradient(180deg,#cbd5e1,#94a3b8)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>{remaining}</span>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#1d2940" }}>Vote</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#90a3b8" }}>Remaining</div>
          </div>
        </div>
      </div>

      {/* ── FORM CARD ── */}
      <div style={{
        background: "rgba(255,255,255,0.8)", border: "1px solid #fff", borderRadius: 32,
        boxShadow: "0 20px 40px rgba(0,0,0,0.06)", padding: 40,
      }}>
        {/* ── TOP BAR: rules + search ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, gap: 16 }}>
          <div style={{
            background: "#ece9fa", border: "1px solid #d1c8fa", borderRadius: 14,
            padding: "13px 20px", display: "flex", alignItems: "center", gap: 10, flex: 1,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" stroke="#4f38f5" strokeWidth="2"/>
              <path d="M12 8v4m0 4h.01" stroke="#4f38f5" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#4f38f5" }}>
              Voting Rules: You cannot vote for yourself. Once cast, votes are final.
            </span>
          </div>

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
                width: 340, height: 47, borderRadius: 14, border: "1.5px solid #eef2ff",
                background: "#fff", paddingLeft: 44, paddingRight: 16, fontSize: 14,
                fontWeight: 600, color: "#1d2940", outline: "none", fontFamily: "inherit",
              }}
            />
          </div>
        </div>

        {/* ── OUT OF VOTES BANNER ── */}
        {remaining === 0 && (
          <div style={{
            background: "linear-gradient(135deg,#eceaff,#fdf2ff)", border: "1.5px solid #c4b5fd",
            borderRadius: 16, padding: "16px 24px", marginBottom: 28, textAlign: "center",
            fontSize: 15, fontWeight: 700, color: "#4f38f5",
          }}>
            🎉 You've used all {MAX_VOTES} votes! Thanks for participating.
          </div>
        )}

        {/* Loading skeletons */}
        {isLoadingEmployees ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ background: "#f1f5f9", borderRadius: 24, height: 260, animation: "pulse 1.5s ease-in-out infinite" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 48, color: "#90a3b8", fontSize: 16, fontWeight: 600 }}>
            {search ? `No results for "${search}"` : "No nominations yet."}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {filtered.map((c) => {
              const hasVoted = votedIds.has(c.id);
              const canVote  = !hasVoted && remaining > 0;
              return (
                <div key={c.id} style={{
                  background: "#fff", border: `1.5px solid ${hasVoted ? "#c4b5fd" : "#f1f5f9"}`,
                  borderRadius: 24, overflow: "hidden",
                  boxShadow: hasVoted ? "0 4px 16px rgba(79,56,245,0.12)" : "0 1px 3px rgba(0,0,0,0.1)",
                  transition: "all 0.2s ease", display: "flex", flexDirection: "column",
                }}>
                  <div style={{ padding: "32px 24px 24px", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                      <AvatarCircle
                        photoUrl={c.nominee?.photoUrl}
                        name={c.nominee?.name}
                        initials={c.nominee?.initials}
                        avatarBg={c.nominee?.avatarBg}
                        size={64}
                      />
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: "#1d2940", lineHeight: 1.3 }}>{c.nominee?.name}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#90a3b8", marginTop: 2 }}>{c.nominee?.department}</div>
                      </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <CategoryPill label={c.category} />
                    </div>

                    <div style={{ background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: 14, padding: "16px 18px", marginBottom: 16 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: "#445566", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
                        "{c.message}"
                      </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#90a3b8" }}>
                      <span>Nominated by</span>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: c.nominatedBy?.avatarBg || "linear-gradient(135deg,#6160ff,#ad46ff)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, color: "#fff", overflow: "hidden" }}>
                        {c.nominatedBy?.photoUrl ? (
                          <img src={c.nominatedBy.photoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          c.nominatedBy?.initials || "?"
                        )}
                      </div>
                      <span style={{ color: "#31415a", fontWeight: 700 }}>{c.nominatedBy?.name}</span>
                    </div>
                  </div>

                  <div style={{
                    background: hasVoted ? "rgba(236,234,255,0.5)" : "rgba(247,250,252,0.5)",
                    borderTop: "1px solid #f1f5f9",
                    padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "6px 12px", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" stroke={hasVoted ? "#4f38f5" : "#445566"} strokeWidth="2" strokeLinecap="round"/>
                        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" stroke={hasVoted ? "#4f38f5" : "#445566"} strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <span style={{ fontSize: 14, fontWeight: 700, color: hasVoted ? "#4f38f5" : "#31415a" }}>{c.votes}</span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#90a3b8" }}>Votes</span>
                    </div>

                    <button
                      onClick={() => castVote(c.id)}
                      disabled={!canVote && !hasVoted}
                      style={{
                        background: hasVoted ? "linear-gradient(135deg,#4f38f5,#ad46ff)" : canVote ? "#1d2940" : "#e2e8f0",
                        color: (hasVoted || canVote) ? "#fff" : "#90a3b8",
                        border: "none", borderRadius: 12, padding: "10px 20px",
                        fontSize: 13, fontWeight: 700, cursor: hasVoted ? "default" : canVote ? "pointer" : "not-allowed",
                        display: "flex", alignItems: "center", gap: 6,
                        boxShadow: hasVoted ? "0 4px 12px rgba(79,56,245,0.3)" : canVote ? "0 2px 8px rgba(29,41,64,0.2)" : "none",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={e => { if (canVote) { e.currentTarget.style.background = "#4f38f5"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(79,56,245,0.3)"; }}}
                      onMouseLeave={e => { if (canVote && !hasVoted) { e.currentTarget.style.background = "#1d2940"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(29,41,64,0.2)"; }}}
                    >
                      {hasVoted ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Voted!
                        </>
                      ) : "Vote Now"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}
