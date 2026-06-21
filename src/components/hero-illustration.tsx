type HeroIllustrationProps = {
  className?: string;
};

export function HeroIllustration({ className }: HeroIllustrationProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 420 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Clinical handoff illustration with clipboard and safety check"
    >
      <rect x="8" y="8" width="404" height="364" stroke="#1a1a1a" strokeWidth="2" fill="#fafaf8" />

      <rect x="48" y="52" width="148" height="196" fill="#ffffff" stroke="#1a1a1a" strokeWidth="2" />
      <rect x="64" y="72" width="88" height="8" fill="#2A43C0" />
      <rect x="64" y="92" width="116" height="4" fill="#d4d4d0" />
      <rect x="64" y="104" width="104" height="4" fill="#d4d4d0" />
      <rect x="64" y="116" width="112" height="4" fill="#d4d4d0" />
      <rect x="64" y="136" width="72" height="4" fill="#d4d4d0" />
      <rect x="64" y="148" width="96" height="4" fill="#d4d4d0" />
      <rect x="64" y="160" width="80" height="4" fill="#d4d4d0" />
      <rect x="64" y="180" width="56" height="4" fill="#2A43C0" />
      <rect x="64" y="192" width="88" height="4" fill="#d4d4d0" />
      <rect x="64" y="204" width="72" height="4" fill="#d4d4d0" />
      <rect x="64" y="224" width="40" height="16" fill="#2A43C0" />

      <circle cx="318" cy="118" r="52" fill="#ffffff" stroke="#1a1a1a" strokeWidth="2" />
      <path
        d="M296 118 L310 132 L342 100"
        stroke="#2A43C0"
        strokeWidth="6"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />

      <rect x="228" y="196" width="144" height="112" fill="#ffffff" stroke="#1a1a1a" strokeWidth="2" />
      <rect x="244" y="212" width="48" height="48" fill="#2A43C0" />
      <rect x="304" y="220" width="52" height="6" fill="#1a1a1a" />
      <rect x="304" y="236" width="44" height="4" fill="#d4d4d0" />
      <rect x="304" y="248" width="36" height="4" fill="#d4d4d0" />
      <rect x="244" y="276" width="112" height="16" fill="#1a1a1a" />

      <path
        d="M120 268 C170 248 210 292 260 272 C290 260 320 278 350 262"
        stroke="#2A43C0"
        strokeWidth="3"
        strokeLinecap="square"
      />
      <polygon points="350,262 338,256 342,270" fill="#2A43C0" />

      <rect x="56" y="312" width="48" height="48" fill="#2A43C0" stroke="#1a1a1a" strokeWidth="2" />
      <rect x="116" y="324" width="72" height="6" fill="#1a1a1a" />
      <rect x="116" y="338" width="56" height="4" fill="#d4d4d0" />

      <rect x="292" y="48" width="80" height="24" fill="#1a1a1a" />
      <rect x="300" y="56" width="64" height="8" fill="#fafaf8" />
    </svg>
  );
}
