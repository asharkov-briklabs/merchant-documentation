export function HeroMeshBg() {
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id="grid" x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
          <path d="M 64 0 L 0 0 0 64" fill="none" stroke="rgba(255,255,255,0.045)" strokeWidth="1" />
        </pattern>
        <radialGradient id="glow2" cx="70%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#2a9d90" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#2a9d90" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      <rect width="100%" height="100%" fill="url(#glow2)" />
      <line x1="0%" y1="0%" x2="100%" y2="100%" stroke="rgba(42,157,144,0.06)" strokeWidth="1" />
      <line x1="-20%" y1="0%" x2="80%" y2="100%" stroke="rgba(42,157,144,0.04)" strokeWidth="1" />
    </svg>
  );
}
