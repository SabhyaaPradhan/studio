
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function GridBackground() {
  const { theme } = useTheme();
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    setColor(theme === 'dark' ? "#ffffff" : "#000000");
  }, [theme]);

  return (
    <div
      className="absolute inset-0 z-0 opacity-[0.05]"
      style={{
        backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" stroke="${encodeURIComponent(color)}" stroke-width="0.5"><path d="M0 50h100M50 0v100" /></svg>')`,
        backgroundRepeat: "repeat",
        backgroundSize: "100px 100px",
        animation: "move-grid 10s linear infinite",
        maskImage: "linear-gradient(to bottom, white 50%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, white 50%, transparent 100%)",
      }}
    />
  );
}
