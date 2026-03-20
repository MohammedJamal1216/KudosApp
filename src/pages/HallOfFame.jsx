import { useAppContext } from "../context/AppContext";

const RANK_MEDALS = ["🥇", "🥈", "🥉"];
const SCORE_STYLES = [
  { scoreBg: "linear-gradient(180deg,#fffde8,#fff7ed)", scoreBorder: "#fef9c2", scoreColor: "#f54900" },
  { scoreBg: "#eef2ff", scoreBorder: "#eef2ff", scoreColor: "#4f38f5" },
  { scoreBg: "#eef2ff", scoreBorder: "#eef2ff", scoreColor: "#4f38f5" },
];

function AvatarCell({ photoUrl, name, initials, avatarBg }) {
  return (
    <div style={{
      width: 64, height: 64, borderRadius: "50%",
      background: avatarBg || "linear-gradient(135deg,#6160ff,#ad46ff)",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 800, fontSize: 20,
      flexShrink: 0, boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
      overflow: "hidden",
    }}>
      {photoUrl ? (
        <img src={photoUrl} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        initials || "?"
      )}
    </div>
  );
}

export default function HallOfFame() {
  const { nominations, isLoadingEmployees } = useAppContext();

  // Group nominations by nominee, compute score = (nomCount * 10) + totalVotes, sort desc
  const map = {};
  nominations.forEach(n => {
    const id = n.nominee?.id ?? n.nominee?.name;
    if (!map[id]) map[id] = { nominee: n.nominee, noms: 0, votes: 0 };
    map[id].noms += 1;
    map[id].votes += n.votes;
  });

  const leaderboardData = Object.values(map)
    .map(entry => ({
      ...entry,
      score: entry.noms * 10 + entry.votes,
    }))
    .sort((a, b) => b.score - a.score);

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", color: "#1d2940" }}>

      {/* HERO BANNER */}
      <div style={{
        background: "rgba(255,255,255,0.7)", border: "1px solid #fff", borderRadius: 32,
        boxShadow: "0 8px 30px rgba(0,0,0,0.04)", padding: "40px 40px", marginBottom: 32,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, left: -60, width: 200, height: 200, borderRadius: "50%", background: "linear-gradient(135deg,#f5339a22,#ad47ff22)", filter: "blur(40px)", zIndex: 0 }} />
        <div style={{ position: "absolute", bottom: -40, right: 80, width: 160, height: 160, borderRadius: "50%", background: "linear-gradient(135deg,#6160ff22,#48dbfb22)", filter: "blur(40px)", zIndex: 0 }} />

        <div style={{ flex: 1, textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-block", background: "#eceaff", border: "1px solid #d1c8fa", borderRadius: 999, padding: "5px 12px", fontSize: 14, fontWeight: 700, color: "#4f38f5", marginBottom: 16 }}>
            Season: Employee of the Month – March Voting
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 900, color: "#1d2940", margin: "0 0 24px", lineHeight: 1 }}>
            The Hall of Fame
          </h1>
          <p style={{ fontSize: 18, fontWeight: 600, color: "#1d2940", margin: 0, lineHeight: 1.6 }}>
            Celebrating the teammates who continually go above and beyond.
          </p>
        </div>
      </div>

      {/* TABLE CARD */}
      <div style={{
        background: "rgba(255,255,255,0.7)", border: "1px solid #fff", borderRadius: 24,
        boxShadow: "0 8px 30px rgba(0,0,0,0.04)", overflow: "hidden",
      }}>
        {/* Table header */}
        <div style={{
          display: "grid", gridTemplateColumns: "80px 1fr 120px 120px 140px",
          gap: 0, padding: "14px 32px", background: "#f8fafc", borderBottom: "1px solid #f1f5f9",
        }}>
          {["Rank", "Employee", "Nominations", "Votes", "Total Score"].map((h, i) => (
            <span key={i} style={{ fontSize: 12, fontWeight: 700, color: "#627490", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: i === 0 ? "center" : i >= 2 ? "center" : "left" }}>
              {h}
            </span>
          ))}
        </div>

        {/* Loading */}
        {isLoadingEmployees && (
          <div style={{ padding: "48px 0", textAlign: "center", color: "#90a3b8", fontWeight: 600 }}>
            Loading leaderboard…
          </div>
        )}

        {/* Empty */}
        {!isLoadingEmployees && leaderboardData.length === 0 && (
          <div style={{ padding: "48px 0", textAlign: "center", color: "#90a3b8", fontWeight: 600 }}>
            No nominations yet. Be the first to nominate a peer!
          </div>
        )}

        {/* Rows */}
        {leaderboardData.map((row, i) => {
          const isTop3 = i < 3;
          const rankLabel = i < 3 ? RANK_MEDALS[i] : String(i + 1);
          const ss = i < 3 ? SCORE_STYLES[i] : { scoreBg: "#f8fafc", scoreBorder: "#eef2ff", scoreColor: "#31415a" };

          return (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "80px 1fr 120px 120px 140px",
              gap: 0, padding: "16px 32px", alignItems: "center",
              background: "#ffffff",
              borderBottom: i < leaderboardData.length - 1 ? "1px solid #f1f5f9" : "none",
              position: "relative",
            }}>
              {/* Left accent bar for top 3 */}
              {isTop3 && (
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0, width: 4,
                  background: i === 0
                    ? "linear-gradient(180deg,#f9a825,#ff6f00)"
                    : i === 1
                    ? "linear-gradient(180deg,#94a3b8,#cbd5e1)"
                    : "linear-gradient(180deg,#d97706,#f59e0b)",
                  borderRadius: "4px 0 0 4px",
                }} />
              )}

              {/* Rank badge */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: "#ffffff", border: "1.5px solid #f1f5f9",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: isTop3 ? 26 : 18, fontWeight: 800, color: "#31415a",
                  boxShadow: isTop3 ? "0 2px 8px rgba(0,0,0,0.07)" : "none",
                }}>
                  {rankLabel}
                </div>
              </div>

              {/* Employee */}
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <AvatarCell
                  photoUrl={row.nominee?.photoUrl}
                  name={row.nominee?.name}
                  initials={row.nominee?.initials}
                  avatarBg={row.nominee?.avatarBg}
                />
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#1d2940" }}>{row.nominee?.name}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#627490", marginTop: 2 }}>{row.nominee?.department}</div>
                </div>
              </div>

              {/* Nominations */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ width: 78, height: 70, borderRadius: 16, background: "#f8fafc", border: "1.5px solid #f1f5f9", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
                  <span style={{ fontSize: 22, fontWeight: 800, color: "#1d2940" }}>{row.noms}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#627490" }}>Noms</span>
                </div>
              </div>

              {/* Votes */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ width: 78, height: 70, borderRadius: 16, background: "#f8fafc", border: "1.5px solid #f1f5f9", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
                  <span style={{ fontSize: 22, fontWeight: 800, color: "#1d2940" }}>{row.votes}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#627490" }}>Votes</span>
                </div>
              </div>

              {/* Total Score */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ width: 128, height: 79, borderRadius: 16, background: ss.scoreBg, border: `1.5px solid ${ss.scoreBorder}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, boxShadow: isTop3 ? "0 2px 8px rgba(0,0,0,0.06)" : "none" }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color: ss.scoreColor }}>{row.score}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#627490" }}>Total Score</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
