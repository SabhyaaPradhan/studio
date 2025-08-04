"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function GridBackground() {
  const { theme } = useTheme();
  // Using neon green for the glow effect, which works well in dark mode.
  const [color, setColor] = useState("hsl(var(--accent))"); 

  useEffect(() => {
    // We can use a single color that works for both themes, or adjust if needed.
    // For a neon effect, a bright color on a dark background is key.
    // This component is only used on pages with a dark background.
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent');
    setColor(`hsl(${accentColor})`);
  }, [theme]);

  const encodedColor = encodeURIComponent(color);

  return (
    <div
      className="absolute inset-0 z-0 opacity-[0.15]"
      style={{
        backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g stroke="${encodedColor}" stroke-width="0.5" filter="url(%23glow)"><path d="M0 50h100M50 0v100"/><circle cx="50" cy="50" r="1.5" fill="${encodedColor}"/></g></svg>')`,
        backgroundRepeat: "repeat",
        backgroundSize: "100px 100px",
        animation: "move-grid 10s linear infinite",
        maskImage: "linear-gradient(to bottom, white 10%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, white 10%, transparent 100%)",
      }}
    />
  );
}
