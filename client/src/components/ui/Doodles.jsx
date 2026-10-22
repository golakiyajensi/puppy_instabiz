// Small hand-drawn decorations used all over the site

export function PawIcon({ className = '', size = 20, ...props }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="currentColor" className={className} aria-hidden="true" {...props}>
      <ellipse cx="7.5" cy="14" rx="3.2" ry="4.2" transform="rotate(-18 7.5 14)" />
      <ellipse cx="13" cy="8.5" rx="3.2" ry="4.4" transform="rotate(-6 13 8.5)" />
      <ellipse cx="19.5" cy="8.5" rx="3.2" ry="4.4" transform="rotate(6 19.5 8.5)" />
      <ellipse cx="25" cy="14" rx="3.2" ry="4.2" transform="rotate(18 25 14)" />
      <path d="M16 15c-4.6 0-8.6 4.8-8.6 8.6 0 2.6 2 4 4.4 4 1.6 0 2.6-.7 4.2-.7s2.6.7 4.2.7c2.4 0 4.4-1.4 4.4-4C24.6 19.8 20.6 15 16 15z" />
    </svg>
  )
}

export function Sparkle({ className = '', size = 18, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M12 0c.8 6.4 3.6 10.4 12 12-8.4 1.6-11.2 5.6-12 12-.8-6.4-3.6-10.4-12-12C8.4 10.4 11.2 6.4 12 0z" />
    </svg>
  )
}

export function HeartOutline({ className = '', size = 36, ...props }) {
  return (
    <svg viewBox="0 0 32 30" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" className={className} aria-hidden="true" {...props}>
      <path d="M16 27C6 20.5 2.5 15 2.5 9.8 2.5 6 5.4 3 9 3c3 0 5.4 1.6 7 4.2C17.6 4.6 20 3 23 3c3.6 0 6.5 3 6.5 6.8 0 5.2-3.5 10.7-13.5 17.2z" />
    </svg>
  )
}

// wavy line drawn under a word
export function Squiggle({ className = '', color = 'currentColor', width = 320 }) {
  return (
    <svg viewBox="0 0 320 16" width={width} height="16" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path d="M2 9 C 30 3, 52 14, 82 8 S 138 3, 168 9 S 226 14, 256 7 S 300 5, 318 8" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}

// small stars that twinkle (night sections)
export function Stars({ count = 14, className = '' }) {
  // fixed positions so the picture never jumps between renders
  const spots = [
    [6, 22], [18, 62], [31, 15], [44, 48], [57, 26], [69, 70], [82, 18], [93, 54],
    [12, 84], [38, 88], [63, 90], [88, 82], [24, 38], [75, 40],
  ].slice(0, count)
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {spots.map(([x, y], i) => (
        <Sparkle
          key={i}
          size={i % 3 === 0 ? 14 : 9}
          className="absolute animate-twinkle text-gold"
          style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${(i * 0.37) % 3}s` }}
        />
      ))}
    </div>
  )
}
