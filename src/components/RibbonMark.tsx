export function RibbonMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none">
      <g
        stroke="var(--color-ribbon)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 15.4c0 3 1.5 5.5 5 8 3.5-2.5 5-5 5-8" />
        <path d="M11 15.4 20 6" />
        <path d="M21 15.4 12 6" />
      </g>
    </svg>
  );
}
