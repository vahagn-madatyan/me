import { useState, useCallback } from "react";
import MatrixCanvas from "./components/MatrixCanvas";
import GlobalStyles from "./components/GlobalStyles";
import ScanLine from "./components/ScanLine";
import LandingPage from "./components/LandingPage";
import ProjectsView from "./components/ProjectsView";

export default function UnifiedPortfolioDashboard() {
  const [view, setView] = useState("landing");
  const [entering, setEntering] = useState(false);

  const handleEnter = useCallback(() => {
    setEntering(true);
    setTimeout(() => { setView("projects"); setEntering(false); }, 700);
  }, []);

  const handleBack = useCallback(() => {
    setView("landing");
  }, []);

  return (
    <div style={{
      minHeight: "100vh", color: "#0fa", position: "relative",
      fontFamily: "'JetBrains Mono', monospace",
      background: "#020402",
    }}>
      <GlobalStyles />
      <MatrixCanvas dimmed={view === "projects"} />
      <ScanLine />

      {view === "landing" && <LandingPage onEnter={handleEnter} />}
      {view === "projects" && <ProjectsView onBack={handleBack} />}

      {entering && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "radial-gradient(circle at center, rgba(0,255,170,0.08), #020402 70%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "fadeUp 0.3s ease",
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem",
            color: "#0fa", letterSpacing: "4px",
            textShadow: "0 0 20px rgba(0,255,170,0.5)",
          }}>
            ESTABLISHING SECURE CONNECTION...
          </div>
        </div>
      )}
    </div>
  );
}
