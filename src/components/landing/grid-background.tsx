"use client";

export default function GridBackground() {
  const color = "hsl(var(--accent))";
  const encodedColor = encodeURIComponent(color);

  return (
    <div
      className="absolute inset-0 z-0 opacity-[0.25]"
      style={{
        backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g stroke="${encodedColor}" stroke-width="0.3" filter="url(%23glow)"><path d="M0 50h100M50 0v100"/><g transform="translate(50 50) scale(0.4)"><path d="M 0,-10 C 5.52, -10, 10, -5.52, 10, 0 S 5.52, 10, 0, 10 -10, 5.52, -10, 0 -5.52, -10, 0, -10 Z" fill="none" stroke-width="2"/><circle cx="0" cy="0" r="2" fill="${encodedColor}"/><path d="M 0 -20 L 0 -12 M 0 12 L 0 20 M -20 0 L -12 0 M 12 0 L 20 0" stroke-width="1.5"/></g></g></svg>')`,
        backgroundRepeat: "repeat",
        backgroundSize: "100px 100px",
        animation: "move-grid 20s linear infinite",
        maskImage: "linear-gradient(to bottom, white 10%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, white 10%, transparent 100%)",
      }}
    />
  );
}
