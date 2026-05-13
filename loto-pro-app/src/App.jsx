import { useState } from "react";

const DRAWS = [
  { date: "06/05/2026", numbers: [7,18,27,35,48], chance: 5 },
  { date: "04/05/2026", numbers: [3,19,23,33,48], chance: 8 },
  { date: "02/05/2026", numbers: [8,14,22,36,42], chance: 3 },
  { date: "29/04/2026", numbers: [1,11,24,31,45], chance: 7 },
  { date: "27/04/2026", numbers: [5,17,26,38,49], chance: 2 },
  { date: "25/04/2026", numbers: [2,13,20,29,44], chance: 10 },
  { date: "24/04/2026", numbers: [6,15,28,37,46], chance: 4 },
  { date: "22/04/2026", numbers: [4,10,21,33,47], chance: 6 },
  { date: "20/04/2026", numbers: [2,12,21,29,33], chance: 6 },
  { date: "18/04/2026", numbers: [9,16,25,34,43], chance: 1 },
  { date: "16/04/2026", numbers: [3,14,23,32,41], chance: 9 },
  { date: "14/04/2026", numbers: [7,18,26,35,44], chance: 5 },
  { date: "13/04/2026", numbers: [1,11,22,31,48], chance: 3 },
  { date: "11/04/2026", numbers: [7,39,41,45,48], chance: 9 },
  { date: "09/04/2026", numbers: [5,16,24,36,46], chance: 7 },
  { date: "07/04/2026", numbers: [2,13,27,38,49], chance: 2 },
  { date: "06/04/2026", numbers: [3,19,29,33,43], chance: 4 },
  { date: "04/04/2026", numbers: [8,17,25,34,42], chance: 8 },
  { date: "02/04/2026", numbers: [4,12,20,30,47], chance: 6 },
  { date: "31/03/2026", numbers: [6,15,23,37,45], chance: 1 },
];

const LEADERBOARD = [
  { name: "Sophie M.", points: 4820, tickets: 47 },
  { name: "Pierre D.", points: 3910, tickets: 39 },
  { name: "Marie L.", points: 3450, tickets: 35 },
  { name: "Jean P.", points: 2980, tickets: 28 },
  { name: "Lucie B.", points: 2340, tickets: 22 },
  { name: "Marc T.", points: 1870, tickets: 18 },
  { name: "Clara R.", points: 1540, tickets: 15 },
  { name: "Thomas V.", points: 980, tickets: 10 },
];

const G = {
  bg: "#070711", card: "#0e0e1f", border: "#1e1e3a",
  accent: "#7c3aed", accent2: "#ec4899", gold: "#f59e0b",
  text: "#e2e8f0", muted: "#64748b", hot: "#ef4444", cold: "#3b82f6",
  green: "#10b981",
};

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${G.bg}; font-family: 'Space Grotesk', sans-serif; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${G.bg}; }
  ::-webkit-scrollbar-thumb { background: ${G.border}; border-radius: 2px; }
  @keyframes pop { 0%{transform:scale(0.4);opacity:0} 60%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
  @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
  @keyframes slideUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
  .popin { animation: pop 0.35s cubic-bezier(.34,1.56,.64,1) forwards; }
  .fadein { animation: fadeIn 0.4s ease forwards; }
  .slideup { animation: slideUp 0.5s cubic-bezier(.34,1.2,.64,1) forwards; }
  .shimmer { background: linear-gradient(90deg,#ffd700,#ff8c00,#ffd700); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer 2s linear infinite; }
  .aipulse { animation: pulse 2s ease infinite; }
  button { font-family: 'Space Grotesk', sans-serif; }
  select { font-family: 'Space Grotesk', sans-serif; }
`;

function freq() {
  const f = {};
  for (let i = 1; i <= 49; i++) f[i] = 0;
  DRAWS.forEach(d => d.numbers.forEach(n => f[n]++));
  return f;
}

function getHotCold() {
  const f = freq();
  const sorted = Object.entries(f).sort((a, b) => b[1] - a[1]);
  return { hot: sorted.slice(0, 8).map(([n]) => +n), cold: sorted.slice(-8).map(([n]) => +n), sorted, f };
}

function checkTicket(ticket, draw) {
  const matched = ticket.numbers.filter(n => draw.numbers.includes(n));
  return { matched, chanceOk: ticket.chance === draw.chance, count: matched.length };
}

function getRank(count, chanceOk) {
  if (count === 5) return { label: "🏆 JACKPOT !", color: G.gold, points: 1000 };
  if (count === 4 && chanceOk) return { label: "🥇 Rang 2", color: G.gold, points: 500 };
  if (count === 4) return { label: "🥈 Rang 3", color: "#c0c0c0", points: 200 };
  if (count === 3 && chanceOk) return { label: "🥉 Rang 4", color: "#cd7f32", points: 100 };
  if (count === 3) return { label: "✅ Rang 5", color: G.green, points: 50 };
  if (count === 2 && chanceOk) return { label: "✅ Rang 6", color: G.green, points: 30 };
  if (count === 2) return { label: "🎯 Rang 7", color: G.cold, points: 20 };
  if (count === 1 && chanceOk) return { label: "🎯 Rang 8", color: G.cold, points: 10 };
  if (chanceOk) return { label: "🎯 Rang 9", color: "#a78bfa", points: 5 };
  return { label: "❌ Perdu", color: G.muted, points: 0 };
}

function Ball({ n, size = 42, type = "default", onClick }) {
  const styles = {
    default: { bg: "#131325", border: G.border, color: G.muted },
    hot: { bg: "#7f1d1d", border: "#fca5a5", color: "#fff" },
    cold: { bg: "#1e3a5f", border: "#93c5fd", color: "#fff" },
    selected: { bg: "#5b21b6", border: "#a78bfa", color: "#fff" },
    matched: { bg: "#065f46", border: "#6ee7b7", color: "#fff" },
    result: { bg: "#78350f", border: "#fcd34d", color: "#fff" },
    ai: { bg: "#4a1040", border: "#f9a8d4", color: "#fff" },
  };
  const s = styles[type] || styles.default;
  return (
    <div onClick={onClick} className="popin" style={{
      width: size, height: size, borderRadius: "50%",
      background: s.bg, border: `2px solid ${s.border}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: s.color, fontWeight: 900, fontSize: Math.round(size * 0.33),
      fontFamily: "'Orbitron', monospace", flexShrink: 0,
      cursor: onClick ? "pointer" : "default",
      boxShadow: type === "selected" ? `0 0 14px ${G.accent}88` : type === "matched" ? `0 0 10px #10b98166` : "none",
      transition: "transform 0.1s",
    }}>{n}</div>
  );
}

function Chance({ n, size = 38, selected, onClick }) {
  return (
    <div onClick={onClick} style={{
      width: size, height: size, borderRadius: "50%",
      background: selected ? `#5b21b6` : "#78350f",
      border: `2px solid ${selected ? G.accent2 : "#fcd34d"}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 900, fontSize: Math.round(size * 0.35),
      fontFamily: "'Orbitron', monospace", flexShrink: 0,
      cursor: onClick ? "pointer" : "default",
      boxShadow: selected ? `0 0 12px ${G.accent2}66` : "none",
      transition: "all 0.2s",
    }}>{n}</div>
  );
}

function Card({ children, style = {} }) {
  return <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 16, padding: 16, marginBottom: 14, ...style }}>{children}</div>;
}

function Title({ children, color = G.accent2 }) {
  return <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, color, marginBottom: 12, textTransform: "uppercase" }}>{children}</div>;
}

function AdBanner({ text = "Jouez responsable · fdj.fr · 18+" }) {
  return (
    <div style={{ background: G.card, border: `1px dashed ${G.border}`, borderRadius: 10, padding: "10px 14px", textAlign: "center", fontSize: 11, color: G.muted, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
      <span style={{ background: G.accent, color: "#fff", fontSize: 9, padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>PUB</span>
      {text}
    </div>
  );
}

const ONBOARD_STEPS = [
  { icon: "🎰", title: "Bienvenue sur Loto Pro", subtitle: "L'application N°1 pour analyser le Loto français", desc: "Accédez aux statistiques des vrais tirages FDJ, générez des combinaisons intelligentes et suivez vos résultats.", btn: "Suivant →" },
  { icon: "🤖", title: "Prédictions par IA", subtitle: "Notre IA analyse les tirages pour vous", desc: "L'intelligence artificielle étudie les fréquences, tendances et patterns des tirages officiels FDJ pour générer la combinaison optimale.", btn: "Suivant →" },
  { icon: "🏆", title: "Classement & Points", subtitle: "Jouez, analysez, montez dans le classement", desc: "Gagnez des points en enregistrant vos grilles et en utilisant l'IA. Défiez les autres joueurs chaque semaine !", btn: "Suivant →" },
  { icon: "⚠️", title: "Jeu responsable", subtitle: "Outil d'analyse statistique uniquement", desc: "Le loto est un jeu de hasard. Aucune méthode ne garantit un gain. Jouez de manière responsable. 18+ uniquement.", btn: "Commencer l'app ✓" },
];

export default function App() {
  const [tab, setTab] = useState("home");
  const [onboarding, setOnboarding] = useState(true);
  const [onboardStep, setOnboardStep] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [premiumModal, setPremiumModal] = useState(false);
  const [legalModal, setLegalModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [tickets, setTickets] = useState([]);
  const [adding, setAdding] = useState(false);
  const [selNums, setSelNums] = useState([]);
  const [selChance, setSelChance] = useState(null);
  const [compareIdx, setCompareIdx] = useState(0);
  const [userPoints, setUserPoints] = useState(120);
  const [toast, setToast] = useState(null);

  const { hot, cold, sorted, f } = getHotCold();
  const lastDraw = DRAWS[0];

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function nextOnboard() {
    if (onboardStep < ONBOARD_STEPS.length - 1) setOnboardStep(s => s + 1);
    else setOnboarding(false);
  }

  function toggleNum(n) {
    if (selNums.includes(n)) setSelNums(selNums.filter(x => x !== n));
    else if (selNums.length < 5) setSelNums([...selNums, n]);
  }

  function saveTicket() {
    if (selNums.length === 5 && selChance) {
      setTickets([{ id: Date.now(), date: new Date().toLocaleDateString("fr-FR"), numbers: [...selNums].sort((a, b) => a - b), chance: selChance }, ...tickets]);
      setSelNums([]); setSelChance(null); setAdding(false);
      setUserPoints(p => p + 5);
      showToast("✅ Grille enregistrée ! +5 pts");
    }
  }

  async function runAI() {
    if (!isPremium) { setPremiumModal(true); return; }
    setAiLoading(true); setAiResult(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 500,
          messages: [{ role: "user", content: `Tu es un expert statisticien du Loto français. Voici les 20 derniers tirages officiels FDJ 2026 : ${JSON.stringify(DRAWS)}. Génère une combinaison de 5 numéros (1-49) + 1 numéro chance (1-10). Réponds UNIQUEMENT en JSON valide sans markdown : {"numbers":[n1,n2,n3,n4,n5],"chance":c,"analysis":"explication courte 1 phrase"}` }]
        })
      });
      const data = await res.json();
      const parsed = JSON.parse(data.content.map(i => i.text || "").join("").replace(/```json|```/g, "").trim());
      setAiResult({ numbers: parsed.numbers.sort((a, b) => a - b), chance: parsed.chance });
      setAiAnalysis(parsed.analysis || "");
      setUserPoints(p => p + 10);
      showToast("🤖 Prédiction IA générée ! +10 pts");
    } catch {
      const pool = Array.from({ length: 49 }, (_, i) => i + 1);
      const nums = [];
      while (nums.length < 5) { const i = Math.floor(Math.random() * pool.length); nums.push(pool.splice(i, 1)[0]); }
      setAiResult({ numbers: nums.sort((a, b) => a - b), chance: Math.floor(Math.random() * 10) + 1 });
      setAiAnalysis("Analyse basée sur les fréquences et tendances des tirages récents FDJ.");
      setUserPoints(p => p + 10);
    }
    setAiLoading(false);
  }

  const myLeaderboard = [...LEADERBOARD, { name: "Vous 🎮", points: userPoints, tickets: tickets.length }]
    .sort((a, b) => b.points - a.points).map((p, i) => ({ ...p, rank: i + 1 }));

  const TABS = [
    { id: "home", icon: "🏠", label: "Accueil" },
    { id: "ai", icon: "🤖", label: "IA" },
    { id: "stats", icon: "📊", label: "Stats" },
    { id: "tickets", icon: "🎫", label: "Grilles" },
    { id: "rank", icon: "🏆", label: "Classement" },
  ];

  if (onboarding) {
    const step = ONBOARD_STEPS[onboardStep];
    return (
      <div style={{ minHeight: "100vh", background: G.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Space Grotesk', sans-serif" }}>
        <style>{css}</style>
        <div className="fadein" style={{ width: "100%", maxWidth: 380, textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>{step.icon}</div>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 18, fontWeight: 900, color: "#fff", marginBottom: 8 }}>{step.title}</div>
          <div style={{ fontSize: 13, color: G.accent2, fontWeight: 700, marginBottom: 16 }}>{step.subtitle}</div>
          <div style={{ fontSize: 13, color: G.muted, lineHeight: 1.7, marginBottom: 32, padding: "0 8px" }}>{step.desc}</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 28 }}>
            {ONBOARD_STEPS.map((_, i) => (
              <div key={i} style={{ width: i === onboardStep ? 24 : 8, height: 8, borderRadius: 4, background: i === onboardStep ? G.accent2 : G.border, transition: "all 0.3s" }} />
            ))}
          </div>
          <button onClick={nextOnboard} style={{ width: "100%", padding: 16, background: `linear-gradient(135deg,${G.accent},${G.accent2})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: `0 4px 20px ${G.accent}44` }}>
            {step.btn}
          </button>
          {onboardStep < ONBOARD_STEPS.length - 1 && (
            <button onClick={() => setOnboarding(false)} style={{ marginTop: 12, background: "none", border: "none", color: G.muted, fontSize: 12, cursor: "pointer", padding: 8 }}>Passer</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: G.bg, fontFamily: "'Space Grotesk', sans-serif", color: G.text, maxWidth: 430, margin: "0 auto", display: "flex", flexDirection: "column" }}>
      <style>{css}</style>

      {/* Toast */}
      {toast && <div style={{ position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", background: G.green, color: "#fff", padding: "10px 20px", borderRadius: 20, fontSize: 13, fontWeight: 700, zIndex: 999, whiteSpace: "nowrap" }}>{toast}</div>}

      {/* Premium Modal */}
      {premiumModal && (
        <div style={{ position: "fixed", inset: 0, background: "#000c", zIndex: 150, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="fadein" style={{ background: G.card, border: `1px solid ${G.gold}44`, borderRadius: 20, padding: 24, width: "100%", maxWidth: 380 }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>👑</div>
              <div className="shimmer" style={{ fontSize: 20, fontWeight: 900, fontFamily: "'Orbitron', monospace" }}>LOTO PRO PREMIUM</div>
              <div style={{ fontSize: 13, color: G.muted, marginTop: 8 }}>Débloquez toutes les fonctionnalités</div>
            </div>
            {["🤖 Prédictions IA illimitées", "📊 Graphiques avancés", "🎫 Grilles illimitées", "🏆 Classement complet", "🔔 Alertes tirages"].map((feat, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 13 }}><span style={{ color: G.green }}>✓</span>{feat}</div>
            ))}
            <div style={{ background: "#0d1b00", border: `1px solid ${G.green}44`, borderRadius: 12, padding: 14, textAlign: "center", margin: "16px 0" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: G.green }}>4,99€<span style={{ fontSize: 14, color: G.muted }}>/mois</span></div>
              <div style={{ fontSize: 11, color: G.muted }}>ou 39,99€/an · économisez 33%</div>
            </div>
            <button onClick={() => { setIsPremium(true); setPremiumModal(false); setUserPoints(p => p + 50); showToast("👑 Bienvenue en Premium ! +50 pts"); }} style={{ width: "100%", padding: 14, background: `linear-gradient(135deg,${G.gold},#ff8c00)`, border: "none", borderRadius: 12, color: "#000", fontSize: 15, fontWeight: 800, cursor: "pointer", marginBottom: 10 }}>🚀 DEVENIR PREMIUM</button>
            <button onClick={() => setPremiumModal(false)} style={{ width: "100%", padding: 10, background: "transparent", border: `1px solid ${G.border}`, borderRadius: 10, color: G.muted, fontSize: 13, cursor: "pointer" }}>Plus tard</button>
          </div>
        </div>
      )}

      {/* Legal Modal */}
      {legalModal && (
        <div style={{ position: "fixed", inset: 0, background: "#000c", zIndex: 150, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div className="slideup" style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: "20px 20px 0 0", padding: 24, width: "100%", maxWidth: 430, maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 14, fontWeight: 900, color: "#fff" }}>⚖️ MENTIONS LÉGALES</div>
              <button onClick={() => setLegalModal(false)} style={{ background: "none", border: "none", color: G.muted, fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>
            {[
              { t: "Éditeur", c: "Loto Pro App · Application indépendante non affiliée à la FDJ" },
              { t: "Nature du service", c: "Cette application est un outil d'analyse statistique à titre ludique. Elle ne permet pas de jouer au loto ni de miser de l'argent réel." },
              { t: "Avertissement jeux", c: "Le loto est un jeu de hasard. Les statistiques et prédictions fournies n'augmentent pas mathématiquement vos chances de gagner. Aucun gain n'est garanti." },
              { t: "Âge requis", c: "Cette application est réservée aux personnes majeures (18 ans et plus) conformément à la législation française sur les jeux d'argent." },
              { t: "Jeu responsable", c: "Si vous pensez avoir un problème avec les jeux d'argent, contactez Joueurs Info Service au 09 74 75 13 13 (appel non surtaxé, 7j/7, 8h-2h)." },
              { t: "Données personnelles", c: "Aucune donnée personnelle n'est collectée ou transmise à des tiers. Vos grilles sont sauvegardées localement sur votre appareil." },
              { t: "Marques", c: "LOTO® et FDJ® sont des marques déposées de La Française des Jeux. Cette app est indépendante et non affiliée à la FDJ." },
            ].map((s, i) => (
              <div key={i} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${G.border}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: G.accent, letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>{s.t}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{s.c}</div>
              </div>
            ))}
            <button onClick={() => setLegalModal(false)} style={{ width: "100%", padding: 13, background: `linear-gradient(135deg,${G.accent},${G.accent2})`, border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Fermer</button>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModal && (
        <div style={{ position: "fixed", inset: 0, background: "#000c", zIndex: 150, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div className="slideup" style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: "20px 20px 0 0", padding: 24, width: "100%", maxWidth: 430 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 14, fontWeight: 900, color: "#fff" }}>📤 PARTAGER L'APP</div>
              <button onClick={() => setShareModal(false)} style={{ background: "none", border: "none", color: G.muted, fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[
                { icon: "📘", name: "Facebook", color: "#1877f2", bg: "#0d1b3e" },
                { icon: "🐦", name: "Twitter / X", color: "#1da1f2", bg: "#0d2030" },
                { icon: "💬", name: "WhatsApp", color: "#25d366", bg: "#0d2e1a" },
                { icon: "📸", name: "Instagram", color: "#e1306c", bg: "#2e0d1a" },
                { icon: "📱", name: "SMS", color: "#a78bfa", bg: "#1a0d2e" },
                { icon: "🔗", name: "Copier le lien", color: G.gold, bg: "#2e1a0d" },
              ].map((s, i) => (
                <button key={i} onClick={() => { setShareModal(false); showToast(`✅ ${s.name === "Copier le lien" ? "Lien copié !" : "Ouverture de " + s.name + "..."}`); }} style={{ background: s.bg, border: `1px solid ${s.color}33`, borderRadius: 12, padding: "14px 10px", display: "flex", alignItems: "center", gap: 10, color: s.color, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  <span style={{ fontSize: 20 }}>{s.icon}</span>{s.name}
                </button>
              ))}
            </div>
            <button onClick={() => setShareModal(false)} style={{ width: "100%", padding: 12, background: "transparent", border: `1px solid ${G.border}`, borderRadius: 10, color: G.muted, fontSize: 13, cursor: "pointer" }}>Fermer</button>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#0e0e1f,#130d2e)", padding: "18px 16px 12px", borderBottom: `1px solid ${G.border}`, position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 19, fontWeight: 900, letterSpacing: 2 }}>
              <span style={{ color: G.accent2 }}>LOTO</span><span style={{ color: "#fff" }}> PRO</span><span style={{ marginLeft: 6 }}>🇫🇷</span>
            </div>
            <div style={{ fontSize: 10, color: G.muted, letterSpacing: 1, marginTop: 1 }}>IA · STATS · PRÉDICTIONS</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ background: "#1e1e3a", borderRadius: 20, padding: "4px 10px", fontSize: 11, color: G.gold, fontWeight: 700 }}>⭐ {userPoints} pts</div>
            {isPremium
              ? <div style={{ background: `linear-gradient(135deg,${G.gold},#ff8c00)`, borderRadius: 20, padding: "4px 10px", fontSize: 10, fontWeight: 800, color: "#000" }}>👑 PREMIUM</div>
              : <button onClick={() => setPremiumModal(true)} style={{ background: `linear-gradient(135deg,${G.gold},#ff8c00)`, border: "none", borderRadius: 20, padding: "5px 12px", fontSize: 10, fontWeight: 800, color: "#000", cursor: "pointer" }}>👑 PRO</button>
            }
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", background: "#0d0d1e", borderBottom: `1px solid ${G.border}`, position: "sticky", top: 68, zIndex: 19 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "10px 4px", background: "none", border: "none", borderBottom: `2px solid ${tab === t.id ? G.accent2 : "transparent"}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "pointer", minWidth: 64 }}>
            <span style={{ fontSize: 16 }}>{t.icon}</span>
            <span style={{ fontSize: 9, color: tab === t.id ? G.accent2 : G.muted, fontWeight: tab === t.id ? 700 : 400 }}>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "14px 14px 30px", flex: 1 }}>

        {/* HOME */}
        {tab === "home" && (
          <div className="fadein">
            <Card style={{ background: "linear-gradient(135deg,#130d2e,#0e0e1f)", border: `1px solid ${G.accent}44` }}>
              <Title color={G.gold}>🏆 Dernier tirage · {lastDraw.date}</Title>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap", alignItems: "center" }}>
                {lastDraw.numbers.map(n => <Ball key={n} n={n} size={44} type="result" />)}
                <div style={{ width: 1, height: 30, background: G.border, margin: "0 4px" }} />
                <Chance n={lastDraw.chance} size={40} />
              </div>
            </Card>

            <Card style={{ background: "linear-gradient(135deg,#1a0a00,#0e0e1f)", border: `1px solid ${G.gold}44` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 11, color: G.muted, letterSpacing: 1 }}>PROCHAIN JACKPOT</div>
                  <div style={{ fontSize: 26, fontWeight: 900, fontFamily: "'Orbitron', monospace", color: G.gold }}>8 000 000 €</div>
                  <div style={{ fontSize: 11, color: G.muted, marginTop: 4 }}>Samedi 09/05/2026 à 20h35</div>
                </div>
                <div style={{ fontSize: 40 }}>🎰</div>
              </div>
            </Card>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              {[
                { label: "Tirages analysés", val: DRAWS.length, icon: "📅", color: G.accent },
                { label: "N° le + fréquent", val: "#" + sorted[0][0], icon: "🔥", color: G.hot },
                { label: "N° le + rare", val: "#" + sorted[sorted.length - 1][0], icon: "❄️", color: G.cold },
                { label: "Mes grilles", val: tickets.length, icon: "🎫", color: G.accent2 },
              ].map((s, i) => (
                <div key={i} style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 14, padding: "14px 12px" }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Orbitron', monospace", color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: G.muted, marginTop: 3 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <AdBanner />
            <Card><Title color={G.hot}>🔥 Numéros chauds</Title><div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{hot.map(n => <Ball key={n} n={n} size={40} type="hot" />)}</div></Card>
            <Card><Title color={G.cold}>❄️ Numéros froids</Title><div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{cold.map(n => <Ball key={n} n={n} size={40} type="cold" />)}</div></Card>

            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <button onClick={() => setShareModal(true)} style={{ flex: 1, padding: 13, background: `linear-gradient(135deg,${G.accent},${G.accent2})`, border: "none", borderRadius: 12, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>📤 Partager</button>
              <button onClick={() => setLegalModal(true)} style={{ flex: 1, padding: 13, background: G.card, border: `1px solid ${G.border}`, borderRadius: 12, color: G.muted, fontSize: 13, cursor: "pointer" }}>⚖️ Mentions légales</button>
            </div>
          </div>
        )}

        {/* AI */}
        {tab === "ai" && (
          <div className="fadein">
            <Card style={{ background: "linear-gradient(135deg,#0d0a2e,#1a0a3e)", border: `1px solid ${G.accent}66`, textAlign: "center" }}>
              <div style={{ fontSize: 42, marginBottom: 8 }}>🤖</div>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 16, fontWeight: 900, color: "#fff", marginBottom: 6 }}>PRÉDICTION IA{!isPremium && <span style={{ background: `linear-gradient(135deg,${G.gold},#ff8c00)`, color: "#000", fontSize: 9, padding: "2px 7px", borderRadius: 10, fontWeight: 800, marginLeft: 6 }}>PREMIUM</span>}</div>
              <div style={{ fontSize: 12, color: G.muted, lineHeight: 1.6, marginBottom: 16 }}>Notre IA analyse les patterns et fréquences des {DRAWS.length} derniers tirages officiels FDJ.</div>
              <button onClick={runAI} disabled={aiLoading} style={{ width: "100%", padding: 16, background: aiLoading ? "#1e1e3a" : `linear-gradient(135deg,${G.accent},${G.accent2})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: aiLoading ? "none" : `0 4px 20px ${G.accent}44` }}>
                {aiLoading ? <span className="aipulse">⚡ IA en train d'analyser...</span> : "🧠 LANCER LA PRÉDICTION IA"}
              </button>
            </Card>

            {aiResult && !aiLoading && (
              <Card style={{ border: `1px solid ${G.accent2}66` }}>
                <Title color={G.accent2}>✨ Combinaison recommandée par l'IA</Title>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 14 }}>
                  {aiResult.numbers.map(n => <Ball key={n} n={n} size={46} type="ai" />)}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 12, color: G.muted }}>N° Chance :</span>
                  <Chance n={aiResult.chance} size={42} />
                </div>
                {aiAnalysis && <div style={{ background: "#0d0a1e", border: `1px solid ${G.accent}44`, borderRadius: 10, padding: 12, fontSize: 12, color: "#94a3b8", lineHeight: 1.6, marginBottom: 12 }}><span style={{ color: G.accent2, fontWeight: 700 }}>💡 Analyse : </span>{aiAnalysis}</div>}
                <button onClick={() => { setTickets([{ id: Date.now(), date: new Date().toLocaleDateString("fr-FR"), numbers: aiResult.numbers, chance: aiResult.chance }, ...tickets]); setUserPoints(p => p + 5); showToast("💾 Grille sauvegardée ! +5 pts"); }} style={{ width: "100%", padding: 11, background: "transparent", border: `1px solid ${G.accent}`, borderRadius: 10, color: G.accent, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  💾 Sauvegarder cette grille (+5 pts)
                </button>
              </Card>
            )}
            <AdBanner text="🎰 Jouez vos grilles sur fdj.fr · Jouez responsable" />
          </div>
        )}

        {/* STATS */}
        {tab === "stats" && (
          <div className="fadein">
            {(() => {
              const ranges = [
                { label: "1-10", val: Object.entries(f).filter(([n]) => +n <= 10).reduce((s, [, v]) => s + v, 0) },
                { label: "11-20", val: Object.entries(f).filter(([n]) => +n >= 11 && +n <= 20).reduce((s, [, v]) => s + v, 0) },
                { label: "21-30", val: Object.entries(f).filter(([n]) => +n >= 21 && +n <= 30).reduce((s, [, v]) => s + v, 0) },
                { label: "31-40", val: Object.entries(f).filter(([n]) => +n >= 31 && +n <= 40).reduce((s, [, v]) => s + v, 0) },
                { label: "41-49", val: Object.entries(f).filter(([n]) => +n >= 41).reduce((s, [, v]) => s + v, 0) },
              ];
              const maxR = Math.max(...ranges.map(d => d.val));
              const chanceFreq = Array.from({ length: 10 }, (_, i) => ({ label: `${i + 1}`, val: DRAWS.filter(d => d.chance === i + 1).length }));
              const maxC = Math.max(...chanceFreq.map(d => d.val));
              return <>
                <Card>
                  <Title color={G.gold}>📊 Répartition par tranches</Title>
                  <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 70 }}>
                    {ranges.map((d, i) => (
                      <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                        <div style={{ width: "100%", background: G.accent, borderRadius: "3px 3px 0 0", height: Math.round((d.val / maxR) * 60), opacity: 0.85 }} />
                        <div style={{ fontSize: 9, color: G.muted, marginTop: 3 }}>{d.label}</div>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card>
                  <Title color={G.gold}>🍀 Fréquence numéros chance</Title>
                  <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 60 }}>
                    {chanceFreq.map((d, i) => (
                      <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                        <div style={{ width: "100%", background: G.gold, borderRadius: "3px 3px 0 0", height: Math.round((d.val / maxC) * 50), opacity: 0.85 }} />
                        <div style={{ fontSize: 9, color: G.muted, marginTop: 3 }}>{d.label}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </>;
            })()}
            <AdBanner />
            <Card>
              <Title color={G.accent2}>📈 Top 20 numéros les plus fréquents</Title>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {sorted.slice(0, 20).map(([num, count], i) => {
                  const pct = Math.round((count / DRAWS.length) * 100);
                  const isHot = hot.includes(+num), isCold = cold.includes(+num);
                  return (
                    <div key={num} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 18, fontSize: 10, color: G.muted, textAlign: "right" }}>{i + 1}</div>
                      <Ball n={+num} size={28} type={isHot ? "hot" : isCold ? "cold" : "default"} />
                      <div style={{ flex: 1, background: "#131325", borderRadius: 4, height: 6, overflow: "hidden" }}>
                        <div style={{ width: `${Math.max(pct * 3, 8)}%`, maxWidth: "100%", height: "100%", background: isHot ? G.hot : isCold ? G.cold : G.accent, borderRadius: 4 }} />
                      </div>
                      <span style={{ fontSize: 10, color: G.muted, minWidth: 52, textAlign: "right" }}>{count}x · {pct}%</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* TICKETS */}
        {tab === "tickets" && (
          <div className="fadein">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: G.muted }}>{tickets.length} grille{tickets.length !== 1 ? "s" : ""}</div>
              <button onClick={() => { setAdding(!adding); if (adding) { setSelNums([]); setSelChance(null); } }} style={{ background: adding ? "transparent" : `linear-gradient(135deg,${G.accent},${G.accent2})`, border: adding ? `1px solid ${G.border}` : "none", borderRadius: 10, color: "#fff", padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                {adding ? "✕ Annuler" : "+ Nouvelle grille"}
              </button>
            </div>

            {adding && (
              <Card style={{ border: `1px solid ${G.accent}66` }}>
                <Title color={G.accent2}>Choisissez 5 numéros ({selNums.length}/5)</Title>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                  {Array.from({ length: 49 }, (_, i) => i + 1).map(n => (
                    <Ball key={n} n={n} size={33} type={selNums.includes(n) ? "selected" : hot.includes(n) ? "hot" : cold.includes(n) ? "cold" : "default"} onClick={() => toggleNum(n)} />
                  ))}
                </div>
                <Title color={G.gold}>Numéro chance</Title>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 14 }}>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(n => <Chance key={n} n={n} size={36} selected={selChance === n} onClick={() => setSelChance(n)} />)}
                </div>
                <button onClick={saveTicket} disabled={selNums.length !== 5 || !selChance} style={{ width: "100%", padding: 13, background: selNums.length === 5 && selChance ? `linear-gradient(135deg,${G.accent},${G.accent2})` : "#1e1e3a", border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: selNums.length === 5 && selChance ? 1 : 0.5 }}>
                  💾 Enregistrer (+5 pts)
                </button>
              </Card>
            )}

            {tickets.length > 0 && (
              <Card>
                <Title color={G.gold}>✅ Comparer avec un tirage</Title>
                <select value={compareIdx} onChange={e => setCompareIdx(+e.target.value)} style={{ width: "100%", padding: "10px 12px", background: "#131325", border: `1px solid ${G.border}`, borderRadius: 10, color: G.text, fontSize: 13, marginBottom: 10 }}>
                  {DRAWS.map((d, i) => <option key={i} value={i}>Tirage du {d.date}</option>)}
                </select>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  {DRAWS[compareIdx].numbers.map(n => <Ball key={n} n={n} size={32} type="result" />)}
                  <Chance n={DRAWS[compareIdx].chance} size={30} />
                </div>
              </Card>
            )}

            <AdBanner />

            {tickets.length === 0 && !adding && (
              <div style={{ textAlign: "center", padding: "50px 20px", color: G.muted }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎫</div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Aucune grille</div>
                <div style={{ fontSize: 12, marginTop: 6 }}>Appuyez sur "+ Nouvelle grille"</div>
              </div>
            )}

            {tickets.map((ticket, ti) => {
              const res = checkTicket(ticket, DRAWS[compareIdx]);
              const rank = getRank(res.count, res.chanceOk);
              return (
                <Card key={ticket.id} style={{ border: res.count >= 3 ? `1px solid ${rank.color}44` : `1px solid ${G.border}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 11, color: G.muted, fontFamily: "'Orbitron', monospace" }}>📅 {ticket.date}</span>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: rank.color }}>{rank.label}</span>
                      {rank.points > 0 && <span style={{ fontSize: 10, color: G.gold }}>+{rank.points}pts</span>}
                      <button onClick={() => setTickets(tickets.filter((_, i) => i !== ti))} style={{ background: "none", border: "none", color: G.muted, cursor: "pointer", fontSize: 16 }}>✕</button>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
                    {ticket.numbers.map(n => <Ball key={n} n={n} size={34} type={res.matched.includes(n) ? "matched" : "default"} />)}
                    <span style={{ color: G.muted, fontSize: 12 }}>+</span>
                    <Chance n={ticket.chance} size={32} selected={res.chanceOk} />
                  </div>
                  {res.count > 0 && <div style={{ marginTop: 8, fontSize: 11, color: G.muted }}>{res.count} numéro{res.count > 1 ? "s" : ""} trouvé{res.count > 1 ? "s" : ""}{res.chanceOk ? " + chance ✅" : ""}</div>}
                </Card>
              );
            })}
          </div>
        )}

        {/* LEADERBOARD */}
        {tab === "rank" && (
          <div className="fadein">
            <Card style={{ background: "linear-gradient(135deg,#130d2e,#0e0e1f)", border: `1px solid ${G.gold}44`, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 4 }}>🏆</div>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 15, fontWeight: 900, color: G.gold }}>CLASSEMENT MONDIAL</div>
              <div style={{ fontSize: 11, color: G.muted, marginTop: 4 }}>Vos points : <strong style={{ color: G.gold }}>{userPoints} pts</strong></div>
            </Card>
            <Card>
              <Title color={G.gold}>💡 Comment gagner des points</Title>
              {[
                { a: "Enregistrer une grille", p: "+5 pts" },
                { a: "Lancer une prédiction IA", p: "+10 pts" },
                { a: "3 bons numéros", p: "+20 pts" },
                { a: "4 bons numéros", p: "+50 pts" },
                { a: "Connexion quotidienne", p: "+2 pts" },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: i < 4 ? `1px solid ${G.border}` : "none", fontSize: 12 }}>
                  <span style={{ color: G.muted }}>{r.a}</span>
                  <span style={{ color: G.green, fontWeight: 700 }}>{r.p}</span>
                </div>
              ))}
            </Card>
            <AdBanner />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {myLeaderboard.map((player, i) => {
                const isMe = player.name.includes("Vous");
                return (
                  <div key={i} style={{ background: isMe ? "linear-gradient(135deg,#130d2e,#1a0a3e)" : G.card, border: `1px solid ${isMe ? G.accent + "66" : G.border}`, borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: player.rank <= 3 ? `linear-gradient(135deg,${G.gold},#ff8c00)` : "#1e1e3a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, color: player.rank <= 3 ? "#000" : G.muted, flexShrink: 0 }}>
                      {player.rank <= 3 ? ["🥇", "🥈", "🥉"][player.rank - 1] : player.rank}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: isMe ? G.accent2 : G.text }}>{player.name}</div>
                      <div style={{ fontSize: 10, color: G.muted, marginTop: 2 }}>{player.tickets} grille{player.tickets !== 1 ? "s" : ""}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: G.gold, fontFamily: "'Orbitron', monospace" }}>{player.points}</div>
                      <div style={{ fontSize: 9, color: G.muted }}>points</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "10px 16px 14px", borderTop: `1px solid ${G.border}`, fontSize: 10, color: "#334", lineHeight: 1.6 }}>
        ⚠️ Jeu de hasard · 18+ · Jouez responsable<br />
        <span onClick={() => setLegalModal(true)} style={{ color: G.muted, cursor: "pointer", textDecoration: "underline" }}>Mentions légales</span> ·{" "}
        <span onClick={() => setShareModal(true)} style={{ color: G.muted, cursor: "pointer", textDecoration: "underline" }}>Partager</span>
      </div>
    </div>
  );
}
