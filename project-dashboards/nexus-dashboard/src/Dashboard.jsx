import { useState, useCallback, useEffect } from "react";
import MatrixCanvas from "./components/MatrixCanvas";
import GlobalStyles from "./components/GlobalStyles";
import ScanLine from "./components/ScanLine";
import LandingPage from "./components/LandingPage";
import ProjectsView from "./components/ProjectsView";

function getInitialView() {
  const hash = window.location.hash;
  if (hash.startsWith("#/project/") || hash.startsWith("#/category/") || hash === "#/projects") {
    return "projects";
  }
  return "landing";
}

export default function UnifiedPortfolioDashboard() {
  const [view, setView] = useState(getInitialView);
  const [entering, setEntering] = useState(false);

  // Sync hash -> view on hashchange
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#/" || hash === "" || hash === "#") {
        setView("landing");
      } else if (hash.startsWith("#/project/") || hash.startsWith("#/category/") || hash === "#/projects") {
        setView("projects");
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Sync view -> hash
  useEffect(() => {
    if (view === "landing") {
      if (window.location.hash !== "#/") {
        window.location.hash = "#/";
      }
    } else if (view === "projects") {
      const hash = window.location.hash;
      // Only set generic #/projects if not already on a deep link
      if (!hash.startsWith("#/project/") && !hash.startsWith("#/category/") && hash !== "#/projects") {
        window.location.hash = "#/projects";
      }
    }
  }, [view]);

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
