import { useState } from "react";
import Blackjack from "./Blackjack"; // Importing your game!

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=DM+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body, #root {
    font-family: 'DM Sans', sans-serif;
    background: #f5f4f0;
    color: #1a1a1a;
    min-height: 100vh;
  }

  .hub { min-height: 100vh; padding: 0 0 80px; }

  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 26px 40px;
    background: #fff;
    border-bottom: 1px solid #e8e6e0;
  }

  .logo {
    font-family: 'DM Mono', monospace;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.12em;
    color: #1a1a1a;
  }
  .logo span { color: #b0a090; }

  .nav-right { display: flex; align-items: center; gap: 12px; }

  .avatar {
    width: 34px; height: 34px;
    border-radius: 50%;
    background: #1a1a1a;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 600; color: #fff; cursor: pointer;
  }

  .nav-btn {
    background: #fff;
    border: 1px solid #e0ddd6;
    color: #888;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.18s;
  }
  .nav-btn:hover { border-color: #ccc; color: #333; }

  .hero {
    padding: 60px 40px 36px;
    background: #fff;
    border-bottom: 1px solid #e8e6e0;
  }

  .eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.2em;
    color: #aaa;
    text-transform: uppercase;
    margin-bottom: 18px;
  }

  .hero h1 {
    font-size: clamp(34px, 5vw, 56px);
    font-weight: 300;
    line-height: 1.08;
    color: #1a1a1a;
    letter-spacing: -0.04em;
  }
  .hero h1 strong { font-weight: 600; font-style: italic; }

  .hero-sub {
    margin-top: 18px;
    font-size: 15px;
    color: #999;
    line-height: 1.6;
    max-width: 440px;
  }

  .section { padding: 0 40px; margin-top: 48px; }

  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.16em;
    color: #bbb;
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  .games-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .game-card {
    background: #fff;
    border: 1px solid #e8e6e0;
    border-radius: 18px;
    padding: 0 28px 0 0;
    cursor: pointer;
    transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 24px;
  }
  .game-card:hover {
    border-color: #d0cdc6;
    box-shadow: 0 8px 32px rgba(0,0,0,0.07);
    transform: translateY(-2px);
  }

  .card-accent {
    width: 4px;
    height: 100%;
    border-radius: 18px 0 0 18px;
    flex-shrink: 0;
    align-self: stretch;
  }

  .card-icon {
    width: 52px; height: 52px;
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 24px;
    flex-shrink: 0;
  }

  .card-main {
    flex: 1;
    padding: 24px 0;
  }

  .game-card h3 {
    font-size: 17px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 5px;
    letter-spacing: -0.025em;
  }

  .game-card p {
    font-size: 13px;
    color: #999;
    line-height: 1.55;
    margin: 0;
  }

  .card-footer {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    flex-shrink: 0;
  }

  .badge {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 6px;
    font-weight: 500;
  }
  .badge-live { background: #edfaf4; color: #1da362; }
  .badge-hot  { background: #fff4e8; color: #d4700a; }

  .players-tag {
    font-size: 12px;
    color: #bbb;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .dot { width: 5px; height: 5px; border-radius: 50%; }
  .dot.online { background: #22c47a; }

  .quick-actions { display: flex; gap: 12px; margin-top: 48px; }

  .action-tile {
    flex: 1;
    background: #fff;
    border: 1px solid #e8e6e0;
    border-radius: 14px;
    padding: 22px;
    cursor: pointer;
    transition: all 0.18s;
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .action-tile:hover { border-color: #ccc; box-shadow: 0 4px 16px rgba(0,0,0,0.05); }

  .action-icon {
    width: 40px; height: 40px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
  }

  .action-tile h4 { font-size: 14px; font-weight: 500; color: #1a1a1a; margin-bottom: 3px; }
  .action-tile p  { font-size: 12px; color: #bbb; }
  .arrow { margin-left: auto; color: #ddd; font-size: 18px; }

  /* ── LOBBY ── */
  .lobby { min-height: 100vh; padding: 0 0 80px; background: #f5f4f0; }

  .back-btn {
    background: none; border: none;
    color: #aaa; font-family: 'DM Sans', sans-serif;
    font-size: 14px; cursor: pointer;
    display: flex; align-items: center; gap: 8px;
    padding: 0; transition: color 0.18s;
  }
  .back-btn:hover { color: #1a1a1a; }

  .lobby-header {
    padding: 28px 40px;
    border-bottom: 1px solid #e8e6e0;
    background: #fff;
    display: flex; align-items: center; justify-content: space-between;
  }

  .lobby-body {
    padding: 40px;
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 32px;
    align-items: start;
  }

  .lobby-title {
    font-size: 28px; font-weight: 600; color: #1a1a1a;
    letter-spacing: -0.03em; margin-bottom: 6px;
  }
  .lobby-desc { font-size: 14px; color: #aaa; }

  .mode-cards { display: flex; flex-direction: column; gap: 10px; margin-top: 28px; }

  .mode-card {
    background: #fff;
    border: 1px solid #e8e6e0;
    border-radius: 14px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.18s;
    display: flex; align-items: center; gap: 14px;
  }
  .mode-card:hover   { border-color: #ccc; }
  .mode-card.selected { border-color: #1a1a1a; background: #fafafa; }

  .mode-icon {
    width: 42px; height: 42px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; flex-shrink: 0;
  }

  .mode-info h4 { font-size: 14px; font-weight: 500; color: #1a1a1a; margin-bottom: 3px; }
  .mode-info p  { font-size: 12px; color: #aaa; }

  .radio {
    margin-left: auto;
    width: 18px; height: 18px; border-radius: 50%;
    border: 1.5px solid #ddd; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .radio.checked { border-color: #1a1a1a; background: #1a1a1a; }
  .radio.checked::after { content: ''; width: 6px; height: 6px; border-radius: 50%; background: #fff; }

  .lobby-panel {
    background: #fff;
    border: 1px solid #e8e6e0;
    border-radius: 18px;
    padding: 24px;
    position: sticky;
    top: 24px;
  }

  .panel-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px; letter-spacing: 0.14em;
    color: #ccc; text-transform: uppercase; margin-bottom: 14px;
  }

  .room-code-box {
    background: #f5f4f0;
    border: 1px solid #e8e6e0;
    border-radius: 10px;
    padding: 18px; text-align: center; margin-bottom: 16px;
  }
  .room-code {
    font-family: 'DM Mono', monospace;
    font-size: 28px; font-weight: 500;
    letter-spacing: 0.2em; color: #1a1a1a;
  }
  .room-sub { font-size: 11px; color: #bbb; margin-top: 6px; }

  .seats {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px; margin-bottom: 20px;
  }
  .seat {
    background: #f5f4f0;
    border: 1px dashed #ddd;
    border-radius: 10px; padding: 14px 10px;
    text-align: center; font-size: 11px; color: #ccc;
    font-family: 'DM Mono', monospace;
  }
  .seat.filled {
    border-style: solid; border-color: #e0ddd6;
    background: #fff;
  }
  .seat-emoji { font-size: 20px; }
  .seat-name  { font-size: 12px; color: #555; margin-top: 6px; }

  .start-btn {
    width: 100%; background: #1a1a1a; border: none;
    color: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 600; padding: 14px;
    border-radius: 10px; cursor: pointer;
    transition: opacity 0.18s, transform 0.15s;
    letter-spacing: 0.01em;
  }
  .start-btn:hover { opacity: 0.85; transform: translateY(-1px); }
  .start-btn:active { transform: translateY(0); }

  .invite-row { display: flex; gap: 8px; margin-top: 12px; }
  .invite-input {
    flex: 1; background: #f5f4f0;
    border: 1px solid #e0ddd6; border-radius: 8px;
    padding: 10px 12px; color: #1a1a1a;
    font-family: 'DM Mono', monospace;
    font-size: 13px; letter-spacing: 0.1em; outline: none;
  }
  .copy-btn {
    background: #f5f4f0; border: 1px solid #e0ddd6;
    color: #888; border-radius: 8px;
    padding: 10px 14px; font-size: 13px;
    cursor: pointer; transition: all 0.18s; white-space: nowrap;
  }
  .copy-btn:hover { background: #eeecea; color: #333; }

  /* ── MOBILE FIXES ── */
  @media (max-width: 768px) {
    .nav { padding: 16px 20px; }
    .hero { padding: 40px 20px 20px; }
    .section { padding: 0 20px; }
    
    /* Stack the Lobby side-panel under the title */
    .lobby-body { 
      grid-template-columns: 1fr; 
      padding: 20px; 
      gap: 24px;
    }
    
    /* Stack the bottom 3 quick-action buttons */
    .quick-actions { flex-direction: column; }
    
    /* Adjust game card padding */
    .game-card { padding-right: 16px; gap: 16px; }
  }
`;

const GAMES = [
  {
    id: "uno",
    name: "Uno",
    desc: "Match colors and numbers, throw wild cards, stack draws, and be the first to shout Uno.",
    icon: "🃏",
    iconBg: "#fff4e8",
    accent: "linear-gradient(90deg, #f97316, #fbbf24)",
    status: "live",
    players: "2–6",
    online: 14,
  },
  {
    id: "blackjack",
    name: "Blackjack",
    desc: "Hit or stand. Beat the dealer to 21 without going bust. Pure nerve, pure math.",
    icon: "♠️",
    iconBg: "#f0f0f0",
    accent: "linear-gradient(90deg, #1a1a1a, #666)",
    status: "live",
    players: "2–6",
    online: 9,
  },
  {
    id: "texas",
    name: "Texas Hoodlum",
    desc: "Hold'em but wilder. Bluff harder, bet bigger, and read the table before it reads you.",
    icon: "🤠",
    iconBg: "#edf6ff",
    accent: "linear-gradient(90deg, #2563eb, #60a5fa)",
    status: "hot",
    players: "2–6",
    online: 21,
  },
];

function Hub({ onSelect }) {
  return (
    <div className="hub">
      <nav className="nav">
        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="../public/Logo.png.png" alt="DeckHub" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />DECK<span>HUB</span>
          </div>        
          <div className="nav-right">
          <button className="nav-btn">Leaderboard</button>
          <div className="avatar">JD</div>
        </div>
      </nav>

      <div className="hero">
        <p className="eyebrow">Game Hub · v0.1</p>
        <h1>Play cards.<br /><strong>With anyone.</strong></h1>
        <p className="hero-sub">Pick a game, invite your crew, and go. Solo vs AI or full 6-player lobbies — all free, no downloads.</p>
      </div>

      <div className="section">
        <p className="section-label">Choose a Game</p>
        <div className="games-grid">
          {GAMES.map(g => (
            <div key={g.id} className="game-card" onClick={() => onSelect(g)}>
              <div className="card-accent" style={{ background: g.accent }} />
              <div className="card-icon" style={{ background: g.iconBg }}>{g.icon}</div>
              <div className="card-main">
                <h3>{g.name}</h3>
                <p>{g.desc}</p>
              </div>
              <div className="card-footer">
                <span className={`badge badge-${g.status === "hot" ? "hot" : "live"}`}>
                  {g.status === "hot" ? "🔥 Popular" : "Live"}
                </span>
                <div className="players-tag">
                  <div className="dot online" />
                  {g.online} online
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="quick-actions">
          <div className="action-tile">
            <div className="action-icon" style={{ background: "rgba(124,109,250,0.12)" }}>🎮</div>
            <div>
              <h4>Join a Room</h4>
              <p>Enter a code from your friend</p>
            </div>
            <span className="arrow">›</span>
          </div>
          <div className="action-tile">
            <div className="action-icon" style={{ background: "rgba(52,211,153,0.1)" }}>🤖</div>
            <div>
              <h4>Play vs AI</h4>
              <p>Practice solo, anytime</p>
            </div>
            <span className="arrow">›</span>
          </div>
          <div className="action-tile">
            <div className="action-icon" style={{ background: "rgba(239,100,60,0.1)" }}>📊</div>
            <div>
              <h4>My Stats</h4>
              <p>Win rate, streaks & more</p>
            </div>
            <span className="arrow">›</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Lobby({ game, onBack, onStartGame }) {
  const [mode, setMode] = useState("solo"); // Defaults to solo now
  const [copied, setCopied] = useState(false);
  const roomCode = "DK-4821";

  const seats = [
    { filled: true, name: "You", emoji: "🎮" },
    { filled: mode === "room", name: "Alex", emoji: "🦊" },
    { filled: false },
    { filled: false },
    { filled: false },
    { filled: false },
  ].slice(0, mode === "solo" ? 1 : 6);

  const copy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="lobby">
      <div className="lobby-header">
        <button className="back-btn" onClick={onBack}>
          ← Back to hub
        </button>
        <div className="nav-right">
          <div className="avatar">JD</div>
        </div>
      </div>

      <div className="lobby-body">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "6px" }}>
            <span style={{ fontSize: "32px" }}>{game.icon}</span>
            <div>
              <div className="lobby-title">{game.name}</div>
              <div className="lobby-desc">{game.desc}</div>
            </div>
          </div>

          <div className="mode-cards">
            <div className={`mode-card${mode === "solo" ? " selected" : ""}`} onClick={() => setMode("solo")}>
              <div className="mode-icon" style={{ background: "rgba(124,109,250,0.12)" }}>👤</div>
              <div className="mode-info">
                <h4>Play Alone</h4>
                <p>Start a solo session to practice and test your strategies</p>
              </div>
              <div className={`radio${mode === "solo" ? " checked" : ""}`} />
            </div>

            <div className={`mode-card${mode === "room" ? " selected" : ""}`} onClick={() => setMode("room")}>
              <div className="mode-icon" style={{ background: "rgba(52,211,153,0.1)" }}>👥</div>
              <div className="mode-info">
                <h4>Make a Room</h4>
                <p>Create a private room and share the code with your friends</p>
              </div>
              <div className={`radio${mode === "room" ? " checked" : ""}`} />
            </div>
          </div>
        </div>

        <div className="lobby-panel">
          <p className="panel-label">Room</p>

          {mode === "room" ? (
            <>
              <div className="room-code-box">
                <div className="room-code">{roomCode}</div>
                <div className="room-sub">Share this code to invite</div>
              </div>
              <div className="invite-row">
                <input className="invite-input" readOnly value={roomCode} />
                <button className="copy-btn" onClick={copy}>{copied ? "✓ Copied" : "Copy"}</button>
              </div>
            </>
          ) : (
            <div className="room-code-box" style={{ marginBottom: 20 }}>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>🃏</div>
              <div style={{ fontSize: "14px", color: "#1a1a1a", fontWeight: 600 }}>Solo Session Ready</div>
              <div className="room-sub">Just you and the dealer</div>
            </div>
          )}

          <p className="panel-label" style={{ marginTop: 20 }}>Players ({seats.filter(s => s.filled).length}/{seats.length})</p>
          <div className="seats">
            {seats.map((s, i) => (
              <div key={i} className={`seat${s.filled ? " filled" : ""}`}>
                <div className="seat-emoji">{s.filled ? s.emoji : "○"}</div>
                {s.filled && <div className="seat-name">{s.name}</div>}
                {!s.filled && <div style={{ marginTop: 4 }}>empty</div>}
              </div>
            ))}
          </div>

          <button className="start-btn" onClick={onStartGame}>
            {mode === "solo" ? "Start Game →" : "Start Lobby →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("hub");
  const [selected, setSelected] = useState(null);

  // Logic to handle exactly what to render
  if (view === "game") {
    if (selected.id === "blackjack") {
      return <Blackjack onExit={() => setView("hub")} />;
    }
    
    // Placeholder for Uno and Texas Hoodlum
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f5f4f0', fontFamily: 'DM Sans' }}>
        <h2>{selected.name} is still in development!</h2>
        <button onClick={() => setView("hub")} style={{ marginTop: 20, padding: '10px 20px', background: '#1a1a1a', color: '#fff', borderRadius: '8px', cursor: 'pointer' }}>Back to Hub</button>
      </div>
    );
  }

  // The main Hub & Lobby Render
  return (
    <>
      <style>{styles}</style>
      {view === "lobby" && selected
        ? <Lobby 
            game={selected} 
            onBack={() => setView("hub")} 
            onStartGame={() => setView("game")} 
          />
        : <Hub 
            onSelect={(g) => { 
              setSelected(g); 
              setView("lobby"); 
            }} 
          />
      }
    </>
  );
}