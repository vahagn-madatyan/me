import { useEffect } from "react";

const GlobalStyles = () => {
  useEffect(() => {
    if (document.getElementById("hk-styles")) return;
    const s = document.createElement("style");
    s.id = "hk-styles";
    s.textContent = `
      @keyframes glitch1 {
        0%,88%,100% { clip-path: inset(0 0 0 0); transform: translate(0); }
        90% { clip-path: inset(15% 0 60% 0); transform: translate(-4px, 1px); }
        92% { clip-path: inset(55% 0 10% 0); transform: translate(4px, -2px); }
        94% { clip-path: inset(30% 0 40% 0); transform: translate(-2px, 2px); }
        96% { clip-path: inset(70% 0 5% 0); transform: translate(3px, -1px); }
      }
      @keyframes glitch2 {
        0%,88%,100% { clip-path: inset(0 0 0 0); transform: translate(0); opacity: 0.5; }
        89% { clip-path: inset(45% 0 20% 0); transform: translate(5px, -1px); opacity: 0.8; }
        91% { clip-path: inset(5% 0 55% 0); transform: translate(-5px, 2px); opacity: 0.4; }
        95% { clip-path: inset(65% 0 5% 0); transform: translate(3px, 0px); opacity: 0.7; }
      }
      @keyframes scanDown {
        0% { top: -2px; }
        100% { top: 100%; }
      }
      @keyframes flicker {
        0%,97%,100% { opacity: 1; }
        98% { opacity: 0.85; }
        99% { opacity: 0.95; }
      }
      @keyframes blink {
        0%,100% { opacity: 1; }
        50% { opacity: 0; }
      }
      @keyframes borderPulse {
        0%,100% { border-color: rgba(0,255,170,0.25); }
        50% { border-color: rgba(0,255,170,0.5); }
      }
      @keyframes warpIn {
        0% { transform: scale(1.03); opacity: 0; filter: blur(4px); }
        100% { transform: scale(1); opacity: 1; filter: blur(0); }
      }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes livePulse {
        0%,100% { opacity: 0.6; }
        50% { opacity: 1; }
      }
    `;
    document.head.appendChild(s);
  }, []);
  return null;
};

export default GlobalStyles;
