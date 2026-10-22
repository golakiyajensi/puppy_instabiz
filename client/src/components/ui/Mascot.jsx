// The TeddyPups mascot: a fluffy golden poodle pup, drawn as SVG (original artwork).
// poses: sit | peek | walk | basket | sleep      eyes: open | closed
const INK = '#2a170e'
const FUR = '#f2bd64'
const FUR_DARK = '#e3a24c'
const MUZZLE = '#fff0d4'
const CHEEK = '#f6a193'

// A fluffy "cloud": many circles around an ellipse. The ink version sits behind to make the outline.
function Cloud({ cx, cy, rx, ry, n = 12, r, fill = FUR, stroke = 6.5 }) {
  const bumps = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]
  })
  return (
    <g>
      <g fill={INK} stroke={INK} strokeWidth={stroke} strokeLinejoin="round">
        {bumps.map(([x, y], i) => (<circle key={i} cx={x} cy={y} r={r} />))}
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
      </g>
      <g fill={fill}>
        {bumps.map(([x, y], i) => (<circle key={i} cx={x} cy={y} r={r} />))}
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
      </g>
    </g>
  )
}

function Head({ eyes = 'open', x = 110, y = 92 }) {
  const open = eyes === 'open'
  return (
    <g transform={`translate(${x - 110} ${y - 92})`}>
      {/* floppy ears */}
      <Cloud cx={62} cy={104} rx={13} ry={19} n={8} r={11} fill={FUR_DARK} stroke={6} />
      <Cloud cx={158} cy={104} rx={13} ry={19} n={8} r={11} fill={FUR_DARK} stroke={6} />
      {/* head + top tuft */}
      <Cloud cx={110} cy={92} rx={40} ry={36} n={12} r={16} />
      <Cloud cx={110} cy={44} rx={9} ry={5} n={6} r={11} />
      {/* muzzle + cheeks */}
      <ellipse cx="110" cy="115" rx="19" ry="14" fill={MUZZLE} />
      <circle cx="76" cy="111" r="9" fill={CHEEK} opacity="0.75" />
      <circle cx="144" cy="111" r="9" fill={CHEEK} opacity="0.75" />
      {/* eyes */}
      {open ? (
        <g>
          <ellipse cx="90" cy="96" rx="6.6" ry="8.4" fill={INK} />
          <ellipse cx="130" cy="96" rx="6.6" ry="8.4" fill={INK} />
          <circle cx="92.4" cy="92.6" r="2.4" fill="#fff" />
          <circle cx="132.4" cy="92.6" r="2.4" fill="#fff" />
        </g>
      ) : (
        <g fill="none" stroke={INK} strokeWidth="3.4" strokeLinecap="round">
          <path d="M83 98 Q90 91 97 98" />
          <path d="M123 98 Q130 91 137 98" />
        </g>
      )}
      {/* nose + mouth */}
      <path d="M102 106 Q110 100 118 106 Q116 115 110 116 Q104 115 102 106Z" fill={INK} />
      <g fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M110 116 V120" />
        <path d="M110 120 Q105 126 99 121" />
        <path d="M110 120 Q115 126 121 121" />
      </g>
    </g>
  )
}

const Collar = ({ y = 134 }) => (
  <g>
    <path d={`M78 ${y} Q110 ${y + 14} 142 ${y}`} fill="none" stroke={INK} strokeWidth="13" strokeLinecap="round" />
    <path d={`M78 ${y} Q110 ${y + 14} 142 ${y}`} fill="none" stroke="#a24a1a" strokeWidth="8" strokeLinecap="round" />
    <path
      d={`M110 ${y + 14} c-3 -5 -9 -2 -7 3 c1 3 7 7 7 7 s6 -4 7 -7 c2 -5 -4 -8 -7 -3z`}
      fill="#fffdf8"
      stroke={INK}
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </g>
)

function Paw({ x, y, flip }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="0" rx="13" ry="10" fill={FUR} stroke={INK} strokeWidth="3.2" />
      <path d="M-4 1 V7 M4 1 V7" stroke={INK} strokeWidth="2" strokeLinecap="round" transform={flip ? 'scale(-1 1)' : undefined} />
    </g>
  )
}

export default function Mascot({ pose = 'sit', eyes, className = '', title = '' }) {
  const e = eyes || (pose === 'sleep' ? 'closed' : 'open')
  const label = title || 'The TeddyPups mascot, a fluffy golden puppy'

  if (pose === 'peek') {
    return (
      <svg viewBox="30 24 160 150" className={className} role="img" aria-label={label}>
        <Head eyes={e} />
        <Paw x={84} y={160} />
        <Paw x={136} y={160} flip />
      </svg>
    )
  }

  if (pose === 'basket') {
    return (
      <svg viewBox="30 24 160 205" className={className} role="img" aria-label={label}>
        <Head eyes={e} y={82} />
        <Paw x={86} y={140} />
        <Paw x={134} y={140} flip />
        {/* wicker basket */}
        <path d="M44 138 H176 L164 222 Q110 232 56 222Z" fill="#dfa95a" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <g stroke="#b9823a" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M50 164 H170 M53 188 H167 M56 210 H164" />
          <path d="M72 140 L66 224 M96 140 L92 228 M120 140 L120 230 M144 140 L148 228 M168 140 L174 222" />
        </g>
        <path d="M40 138 H180" stroke={INK} strokeWidth="9" strokeLinecap="round" />
        <path d="M40 138 H180" stroke="#e8b866" strokeWidth="4.5" strokeLinecap="round" />
      </svg>
    )
  }

  if (pose === 'walk') {
    return (
      <svg viewBox="0 20 280 230" className={`mascot-walk ${className}`} role="img" aria-label={label}>
        {/* far legs */}
        <g className="leg leg-a">
          <rect x="82" y="168" width="18" height="52" rx="9" fill={FUR_DARK} stroke={INK} strokeWidth="4" />
          <rect x="176" y="168" width="18" height="52" rx="9" fill={FUR_DARK} stroke={INK} strokeWidth="4" />
        </g>
        {/* tail pom */}
        <path d="M54 134 Q30 126 34 100" fill="none" stroke={INK} strokeWidth="14" strokeLinecap="round" />
        <path d="M54 134 Q30 126 34 100" fill="none" stroke={FUR} strokeWidth="8" strokeLinecap="round" />
        <Cloud cx={32} cy={90} rx={6} ry={6} n={7} r={9} stroke={5.5} />
        {/* body */}
        <Cloud cx={128} cy={150} rx={58} ry={28} n={13} r={19} />
        {/* near legs */}
        <g className="leg leg-b">
          <rect x="102" y="170" width="18" height="52" rx="9" fill={FUR} stroke={INK} strokeWidth="4" />
          <rect x="158" y="170" width="18" height="52" rx="9" fill={FUR} stroke={INK} strokeWidth="4" />
        </g>
        {/* head looks to the right */}
        <g transform="translate(116 38) scale(.72)">
          <Head eyes={e} />
        </g>
        <path d="M184 132 Q196 146 208 134" fill="none" stroke={INK} strokeWidth="11" strokeLinecap="round" />
        <path d="M184 132 Q196 146 208 134" fill="none" stroke="#a24a1a" strokeWidth="6.5" strokeLinecap="round" />
      </svg>
    )
  }

  // sit / sleep (full body, front view)
  return (
    <svg viewBox="22 24 190 208" className={className} role="img" aria-label={label}>
      {/* tail pom */}
      <path d="M150 196 Q186 198 190 164" fill="none" stroke={INK} strokeWidth="14" strokeLinecap="round" />
      <path d="M150 196 Q186 198 190 164" fill="none" stroke={FUR} strokeWidth="8" strokeLinecap="round" />
      <Cloud cx={190} cy={154} rx={5} ry={5} n={7} r={9} stroke={5.5} />
      {/* body + haunch */}
      <Cloud cx={110} cy={176} rx={36} ry={26} n={11} r={17} />
      <Cloud cx={146} cy={192} rx={11} ry={9} n={8} r={13} fill={FUR_DARK} stroke={5.5} />
      {/* front legs */}
      <g>
        <rect x="86" y="178" width="20" height="44" rx="10" fill={FUR} stroke={INK} strokeWidth="4" />
        <rect x="114" y="178" width="20" height="44" rx="10" fill={FUR} stroke={INK} strokeWidth="4" />
        <path d="M92 222 V214 M100 222 V214 M120 222 V214 M128 222 V214" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
      </g>
      <Collar y={132} />
      <Head eyes={e} />
    </svg>
  )
}
