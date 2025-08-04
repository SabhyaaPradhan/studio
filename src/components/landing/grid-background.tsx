"use client";

export default function GridBackground() {
  const color = "hsl(var(--accent))";
  
  return (
    <div
      className="absolute inset-0 z-0 opacity-[0.25]"
      style={{
        backgroundColor: "transparent",
        backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
        backgroundSize: "2rem 2rem",
        animation: "move-grid 20s linear infinite",
        maskImage: "linear-gradient(to bottom, white 10%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, white 10%, transparent 100%)",
      }}
    />
  );
}
