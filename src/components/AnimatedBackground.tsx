/** Ambient animated gradient blobs — the "atmosphere" behind every screen. */
export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-900 via-forest-950 to-forest-950" />

      {/* drifting gold orb */}
      <div
        className="absolute -top-20 -left-24 h-[28rem] w-[28rem] rounded-full bg-gold-500/20 blur-3xl"
        style={{ animation: "float-slow 14s ease-in-out infinite" }}
      />
      {/* drifting emerald orb */}
      <div
        className="absolute top-1/3 -right-32 h-[32rem] w-[32rem] rounded-full bg-forest-600/30 blur-3xl"
        style={{ animation: "float-slower 18s ease-in-out infinite" }}
      />
      {/* soft mint highlight bottom */}
      <div
        className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-mint-500/10 blur-3xl"
        style={{ animation: "float-slow 16s ease-in-out infinite reverse" }}
      />

      {/* subtle grain overlay for human warmth */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
