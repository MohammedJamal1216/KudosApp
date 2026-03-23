import { useNavigate } from "react-router-dom";
import Avatar from "../components/Avatar";
import { useAppContext } from "../context/AppContext";

const gradientText = {
  background: "linear-gradient(90deg, #f633a0 0%, #ad46ff 50%, #6160ff 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

function SkeletonCard() {
  return (
    <div style={{
      background: "#f1f5f9", borderRadius: 24, height: 200,
      animation: "pulse 1.5s ease-in-out infinite",
    }} />
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, employees, nominations, votedIds, castVote, isLoadingEmployees, graphError } = useAppContext();

  const firstName = currentUser?.name?.split(" ")[0] || "there";

  // Top 4 nominations for the nominees panel
  const topNominees = nominations.slice(0, 4);

  // Leaderboard: group by nominee id, sort by votes desc, top 3
  const leaderMap = {};
  nominations.forEach(n => {
    const id = n.nominee?.id ?? n.nominee?.name;
    if (!leaderMap[id]) leaderMap[id] = { nominee: n.nominee, votes: 0, noms: 0 };
    leaderMap[id].votes += n.votes;
    leaderMap[id].noms += 1;
  });
  const leaderboard = Object.values(leaderMap)
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 3);

  const totalVotes = nominations.reduce((sum, n) => sum + n.votes, 0);

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
          <span>Could not load live data: {graphError}</span>
          <button
            onClick={() => window.location.reload()}
            style={{ marginLeft: "auto", background: "#e11d48", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
          >
            Retry
          </button>
        </div>
      )}

      {/* WELCOME BANNER */}
      <div style={{
        background: "rgba(255,255,255,0.7)", border: "1px solid #e2e8f0", borderRadius: 32,
        boxShadow: "0 8px 30px rgba(0,0,0,0.04)", padding: "36px 48px", marginBottom: 24,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        overflow: "hidden", position: "relative",
      }}>
        <div style={{ position: "absolute", right: -40, top: -40, width: 244, height: 244, borderRadius: "50%", background: "rgba(79,56,245,0.05)", transform: "rotate(-12deg)" }} />
        <div style={{ position: "absolute", left: -60, top: 20, width: 200, height: 200, borderRadius: "50%", background: "rgba(246,51,160,0.04)" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 16 }}>
            <span style={{ fontSize: 52, fontWeight: 900, color: "#1d2940", lineHeight: 1 }}>Hello, </span>
            <span style={{ ...gradientText, fontSize: 52, fontWeight: 900, lineHeight: 1 }}>{firstName}</span>
            <span style={{ fontSize: 52, lineHeight: 1 }}>👋</span>
          </div>
          <p style={{ fontSize: 18, fontWeight: 600, color: "#1d2940", maxWidth: 520, lineHeight: 1.5, margin: 0 }}>
            Welcome to your Employee recognition dashboard! Discover amazing teammates and celebrate their wins today.
          </p>
          <button
            onClick={() => navigate("/nominate")}
            style={{
              marginTop: 24, background: "#4f38f5", color: "#fff", border: "none",
              borderRadius: 10, padding: "13px 32px", fontSize: 14, fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
              boxShadow: "0 4px 12px rgba(79,56,245,0.3)", transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(79,56,245,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(79,56,245,0.3)"; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            Nominate a Peer
          </button>
        </div>

        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 200, height: 200, borderRadius: "50%", background: "linear-gradient(135deg,#f633a0,#ad46ff 50%,#6160ff)", opacity: 0.12, position: "absolute" }} />
          <div style={{ fontSize: 120, lineHeight: 1, filter: "drop-shadow(0 8px 24px rgba(246,51,160,0.2))" }}>🏆</div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, marginBottom: 24 }}>
        {[
          { label: "Nominees",       value: isLoadingEmployees ? "…" : String(employees.length), icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          ), bg: "linear-gradient(135deg, #6366f1, #4f38f5)", shadow: "rgba(99,102,241,0.4)" },
          { label: "Total Votes Cast", value: String(totalVotes), icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          ), bg: "linear-gradient(135deg, #f633a0, #e11d74)", shadow: "rgba(246,51,160,0.4)" },
          { label: "Voting Ends In", value: "3 days", icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/><path d="M12 6v6l4 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          ), bg: "linear-gradient(135deg, #f59e0b, #f97316)", shadow: "rgba(245,158,11,0.4)" },
        ].map(stat => (
          <div key={stat.label} style={{
            background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14,
            padding: "22px 24px", display: "flex", alignItems: "center", gap: 16,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16, background: stat.bg,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              boxShadow: `0 4px 6px -4px ${stat.shadow}, 0 10px 15px -3px ${stat.shadow}`,
            }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#62748e" }}>{stat.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", lineHeight: 1.3 }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 404px", gap: 24 }}>

        {/* NOMINEES PANEL */}
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "24px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, padding: "0 8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#e0e8ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>⭐</div>
              <span style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>Nominees of the Month</span>
            </div>
            <button
              onClick={() => navigate("/vote")}
              style={{ background: "transparent", border: "none", color: "#4f38f5", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
            >
              View All Nominees →
            </button>
          </div>

          <div style={{ borderTop: "1px solid #f1f5f9", marginBottom: 16 }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {isLoadingEmployees ? (
              [1,2,3,4].map(i => <SkeletonCard key={i} />)
            ) : topNominees.length === 0 ? (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "48px 0", color: "#90a3b8" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🏅</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1d2940", marginBottom: 6 }}>No nominees yet</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>Be the first to nominate a peer!</div>
              </div>
            ) : (
              topNominees.map(n => {
                const hasVoted = votedIds.has(n.id);
                return (
                  <div key={n.id}
                    style={{
                      background: "#fff", border: "1px solid #f1f5f9", borderRadius: 24,
                      overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.1)",
                      transition: "transform 0.15s, box-shadow 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.1)"; }}
                  >
                    <div style={{ padding: "32px 32px 20px" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", background: "#eceaff", border: "1px solid #d0c9ff", borderRadius: 999, padding: "4px 12px", fontSize: 12, fontWeight: 700, color: "#4f38f5", marginBottom: 16 }}>
                        {n.category}
                      </div>
                      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
                        {n.nominee?.photoUrl ? (
                          <img src={n.nominee.photoUrl} alt={n.nominee.name} style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                        ) : (
                          <Avatar initials={n.nominee?.initials || '?'} bg={n.nominee?.avatarBg || 'linear-gradient(135deg,#6160ff,#ad46ff)'} size={56} />
                        )}
                        <div>
                          <div style={{ fontSize: 18, fontWeight: 700, color: "#1d2940", lineHeight: 1.3 }}>{n.nominee?.name}</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#90a3b8" }}>{n.nominee?.department}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#90a3b8" }}>
                        <span style={{ fontWeight: 600 }}>Nominated by</span>
                        <Avatar initials={(n.nominatedBy?.initials) || (n.nominatedBy?.name || '').split(" ").map(w => w[0]).join("")} bg="linear-gradient(135deg,#e2e8f0,#cbd5e1)" size={20} />
                        <span style={{ fontWeight: 700, color: "#31405a" }}>{n.nominatedBy?.name}</span>
                      </div>
                    </div>
                    <div style={{ background: "rgba(247,250,252,0.5)", borderTop: "1px solid #f1f5f9", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "7px 12px", display: "flex", alignItems: "center", gap: 6, fontSize: 14, boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
                        <span>❤️</span>
                        <span style={{ fontWeight: 700, color: "#31405a" }}>{n.votes}</span>
                        <span style={{ fontWeight: 500, color: "#90a3b8" }}>Votes</span>
                      </div>
                      <button
                        onClick={() => castVote(n.id)}
                        disabled={hasVoted}
                        style={{
                          background: hasVoted ? "#4f38f5" : "#1d2940", color: "#fff",
                          border: "none", borderRadius: 14, padding: "10px 20px",
                          fontSize: 14, fontWeight: 700, cursor: hasVoted ? "default" : "pointer",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.1)", transition: "transform 0.1s",
                        }}
                        onMouseEnter={e => { if (!hasVoted) e.currentTarget.style.transform = "scale(1.04)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                      >
                        {hasVoted ? "✓ Voted!" : "Vote Now"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* LEADERBOARD PANEL */}
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "24px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, padding: "0 4px" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏅</div>
              <span style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>Current Leaderboard</span>
            </div>

            {isLoadingEmployees ? (
              <div style={{ padding: "40px 0", textAlign: "center", color: "#90a3b8", fontWeight: 600 }}>Loading…</div>
            ) : leaderboard.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 0", color: "#90a3b8" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1d2940", marginBottom: 6 }}>No rankings yet</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>Nominations will appear here.</div>
              </div>
            ) : (
              <>
                {/* Top winner */}
                <div style={{ textAlign: "center", padding: "24px 0 16px", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ width: 90, height: 90, borderRadius: "50%", background: leaderboard[0].nominee?.avatarBg || 'linear-gradient(135deg,#6160ff,#ad46ff)', margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 900, color: "#fff", boxShadow: "0 8px 24px rgba(97,96,255,0.3)", position: "relative", overflow: "hidden" }}>
                    {leaderboard[0].nominee?.photoUrl ? (
                      <img src={leaderboard[0].nominee.photoUrl} alt={leaderboard[0].nominee.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      leaderboard[0].nominee?.initials || '?'
                    )}
                    <span style={{ position: "absolute", top: -8, right: -8, fontSize: 28 }}>🥇</span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>{leaderboard[0].nominee?.name}</div>
                  <div style={{ fontSize: 13, color: "#62748e", marginBottom: 10 }}>{leaderboard[0].nominee?.department}</div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 16px", fontSize: 14 }}>
                    <span style={{ color: "#62748e" }}>Total Score</span>
                    <span style={{ fontWeight: 700, color: "#0f172a" }}>{leaderboard[0].votes}</span>
                  </div>
                </div>

                {/* Rank list */}
                <div>
                  {leaderboard.slice(1).map((entry, i) => (
                    <div key={i}>
                      <div style={{ display: "flex", alignItems: "center", padding: "14px 8px", gap: 12 }}>
                        <span style={{ fontSize: 22, width: 36, textAlign: "center" }}>{i === 0 ? "🥈" : "🥉"}</span>
                        {entry.nominee?.photoUrl ? (
                          <img src={entry.nominee.photoUrl} alt={entry.nominee.name} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                        ) : (
                          <Avatar initials={entry.nominee?.initials || '?'} bg={entry.nominee?.avatarBg || 'linear-gradient(135deg,#f633a0,#ff6b6b)'} size={40} />
                        )}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>{entry.nominee?.name}</div>
                          <div style={{ fontSize: 12, color: "#62748e" }}>{entry.nominee?.department}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: 700, fontSize: 16, color: "#0f172a" }}>
                          <span style={{ fontSize: 14 }}>⭐</span>{entry.votes}
                        </div>
                      </div>
                      {i < leaderboard.length - 2 && <div style={{ borderTop: "1px solid #f1f5f9" }} />}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => navigate("/leaderboard")}
            style={{
              marginTop: 16, background: "#4f38f5", color: "#fff", border: "none",
              borderRadius: 10, padding: "14px", fontSize: 14, fontWeight: 600,
              cursor: "pointer", width: "100%", display: "flex", alignItems: "center",
              justifyContent: "center", gap: 8, transition: "opacity 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <span>🏆</span> View Leaderboard
          </button>
        </div>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}
