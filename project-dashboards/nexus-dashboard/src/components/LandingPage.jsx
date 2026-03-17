import { useState, useEffect } from "react";

const MONO = "'JetBrains Mono', 'Fira Code', 'Courier New', monospace";

const LandingPage = ({ onEnter }) => {
  const [phase, setPhase] = useState(0);
  const [hoverBtn, setHoverBtn] = useState(false);
  const [typedText, setTypedText] = useState("");

  const tagline = "root@nexus:~# access --portfolio --clearance=GRANTED";

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => setPhase(3), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    if (phase < 1) return;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setTypedText(tagline.slice(0, i));
      if (i >= tagline.length) clearInterval(iv);
    }, 25);
    return () => clearInterval(iv);
  }, [phase]);

  return (
    <div style={{
      position: "relative", zIndex: 2,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      minHeight: "100vh", padding: "40px 24px", textAlign: "center",
    }}>
      {/* Status line */}
      <div style={{
        position: "absolute", top: "20px", left: "24px", right: "24px",
        display: "flex", justifyContent: "space-between",
        fontSize: "0.5rem", fontFamily: MONO, color: "rgba(0,255,170,0.2)", letterSpacing: "2px",
      }}>
        <span>SYS.NEURAL_MESH // ACTIVE</span>
        <span>ENCRYPTION: AES-256 // PROTOCOL: SSH-2</span>
      </div>

      {/* ASCII art style header */}
      <div style={{
        marginBottom: "8px",
        opacity: phase >= 0 ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}>
        <pre style={{
          fontFamily: MONO, fontSize: "clamp(0.35rem, 1vw, 0.55rem)",
          color: "rgba(0,255,170,0.3)", lineHeight: 1.2, margin: 0,
          letterSpacing: "1px",
        }}>{`
 ██████╗ ██████╗  ██████╗      ██╗███████╗ ██████╗████████╗
 ██╔══██╗██╔══██╗██╔═══██╗     ██║██╔════╝██╔════╝╚══██╔══╝
 ██████╔╝██████╔╝██║   ██║     ██║█████╗  ██║        ██║
 ██╔═══╝ ██╔══██╗██║   ██║██   ██║██╔══╝  ██║        ██║
 ██║     ██║  ██║╚██████╔╝╚█████╔╝███████╗╚██████╗   ██║
 ╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚════╝ ╚══════╝ ╚═════╝   ╚═╝`}</pre>
      </div>

      {/* Main title with glitch */}
      <div style={{ position: "relative", marginBottom: "12px" }}>
        <h1 style={{
          fontSize: "clamp(2.5rem, 7vw, 5rem)", fontWeight: 900, fontFamily: MONO,
          letterSpacing: "8px", margin: 0, lineHeight: 1, color: "#0fa",
          textShadow: "0 0 20px rgba(0,255,170,0.3), 0 0 60px rgba(0,255,170,0.1)",
          animation: "glitch1 5s infinite, flicker 4s infinite",
        }}>
          NEXUS
        </h1>
        <h1 aria-hidden="true" style={{
          position: "absolute", top: 0, left: 0, width: "100%",
          fontSize: "clamp(2.5rem, 7vw, 5rem)", fontWeight: 900, fontFamily: MONO,
          letterSpacing: "8px", margin: 0, lineHeight: 1, color: "#f33",
          textShadow: "0 0 20px rgba(255,51,51,0.3)",
          animation: "glitch2 5s infinite", pointerEvents: "none",
        }}>
          NEXUS
        </h1>
      </div>

      {/* Terminal typed tagline */}
      <div style={{
        height: "20px", marginBottom: "32px",
        opacity: phase >= 1 ? 1 : 0, transition: "opacity 0.3s ease",
      }}>
        <span style={{
          fontFamily: MONO, fontSize: "clamp(0.55rem, 1.2vw, 0.75rem)",
          color: "rgba(0,255,170,0.6)", letterSpacing: "1px",
        }}>
          {typedText}
          <span style={{ animation: "blink 0.8s step-end infinite" }}>█</span>
        </span>
      </div>

      {/* Info blocks */}
      <div style={{
        display: "flex", gap: "2px", marginBottom: "40px",
        opacity: phase >= 2 ? 1 : 0,
        transform: phase >= 2 ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.6s ease",
      }}>
        {[
          { val: "14", label: "NODES" },
          { val: "400+", label: "TOOLS" },
          { val: "120+", label: "SKILLS" },
          { val: "8", label: "SECTORS" },
        ].map((s, i) => (
          <div key={i} style={{
            padding: "12px 24px",
            background: "rgba(0,255,170,0.03)",
            border: "1px solid rgba(0,255,170,0.1)",
            borderLeft: i > 0 ? "none" : "1px solid rgba(0,255,170,0.1)",
          }}>
            <div style={{
              fontSize: "1.4rem", fontWeight: "bold", fontFamily: MONO,
              color: "#0fa", textShadow: "0 0 10px rgba(0,255,170,0.3)",
            }}>{s.val}</div>
            <div style={{
              fontSize: "0.45rem", color: "rgba(0,255,170,0.35)",
              fontFamily: MONO, letterSpacing: "2px", marginTop: "4px",
            }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Enter button */}
      <div style={{
        opacity: phase >= 3 ? 1 : 0,
        transform: phase >= 3 ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.6s ease",
      }}>
        <button
          onClick={onEnter}
          onMouseEnter={() => setHoverBtn(true)}
          onMouseLeave={() => setHoverBtn(false)}
          style={{
            padding: "14px 56px", fontSize: "0.75rem", fontFamily: MONO,
            fontWeight: "bold", letterSpacing: "4px",
            color: hoverBtn ? "#020402" : "#0fa",
            background: hoverBtn ? "#0fa" : "transparent",
            border: "1px solid rgba(0,255,170,0.4)",
            cursor: "pointer",
            transition: "all 0.25s ease",
            animation: hoverBtn ? "none" : "borderPulse 2s ease infinite",
            textTransform: "uppercase",
          }}
        >
          {hoverBtn ? "[ ACCESSING ]" : "▸ VIEW PROJECTS"}
        </button>

        <div style={{
          marginTop: "24px", fontSize: "0.45rem", fontFamily: MONO,
          color: "rgba(0,255,170,0.15)", letterSpacing: "2px",
        }}>
          CYBERSECURITY • FINTECH • AI AGENTS • DEVTOOLS • PROPTECH
        </div>
      </div>

      {/* Bottom */}
      <div style={{
        position: "absolute", bottom: "20px", left: "24px", right: "24px",
        display: "flex", justifyContent: "space-between",
        fontSize: "0.45rem", fontFamily: MONO, color: "rgba(0,255,170,0.12)", letterSpacing: "2px",
      }}>
        <span>V.MADATYAN // 2025-2026</span>
        <span>BUILDING AUTONOMOUS SECURITY & AI</span>
      </div>
    </div>
  );
};

export default LandingPage;
