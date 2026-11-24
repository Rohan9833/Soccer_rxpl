// Original vector artwork for the microsite (trophy, football, kickoff scene).
// Drawn in SVG so it stays crisp at any size and needs no external images.

import { useId } from 'react';

/* ------------------------------------------------------------------ */
/* Trophy                                                              */
/* ------------------------------------------------------------------ */
export function TrophyArt({ className = '' }) {
  const id = useId().replace(/:/g, '');
  const g = (n) => `${n}-${id}`;
  return (
    <svg viewBox="0 0 300 400" className={className} role="img" aria-label="Golden championship trophy">
      <defs>
        <linearGradient id={g('gold')} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#7a4a06" />
          <stop offset="0.28" stopColor="#f0b93a" />
          <stop offset="0.45" stopColor="#fff4c2" />
          <stop offset="0.62" stopColor="#e3a52a" />
          <stop offset="1" stopColor="#6e4105" />
        </linearGradient>
        <linearGradient id={g('goldV')} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ffe9a0" />
          <stop offset="1" stopColor="#9a6208" />
        </linearGradient>
        <linearGradient id={g('plinth')} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#4b1381" />
          <stop offset="1" stopColor="#1b0f33" />
        </linearGradient>
        <radialGradient id={g('glow')} cx="0.5" cy="0.42" r="0.5">
          <stop offset="0" stopColor="#ffd36b" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="#e0249c" stopOpacity="0.22" />
          <stop offset="1" stopColor="#8b3dff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="150" cy="170" r="160" fill={`url(#${g('glow')})`} />

      {/* light rays */}
      <g opacity="0.25" fill="#fff4c2">
        <polygon points="150,140 60,0 95,0" />
        <polygon points="150,140 205,0 240,0" />
        <polygon points="150,140 140,0 160,0" />
      </g>

      {/* handles */}
      <g fill="none" stroke={`url(#${g('gold')})`} strokeWidth="13" strokeLinecap="round">
        <path d="M78 78 C22 74 18 150 98 176" />
        <path d="M222 78 C278 74 282 150 202 176" />
      </g>

      {/* bowl */}
      <path d="M68 62 H232 C232 162 202 214 150 220 C98 214 68 162 68 62 Z" fill={`url(#${g('gold')})`} />
      <ellipse cx="150" cy="62" rx="82" ry="13" fill={`url(#${g('goldV')})`} />
      <ellipse cx="150" cy="63" rx="72" ry="8" fill="#5c3604" />
      {/* engraved band + star */}
      <path d="M78 100 C110 108 190 108 222 100" stroke="#8a5a0a" strokeWidth="3" fill="none" opacity="0.6" />
      <polygon
        points="150,118 158,138 180,138 162,151 169,172 150,159 131,172 138,151 120,138 142,138"
        fill="#fff4c2"
        opacity="0.9"
      />
      {/* highlight */}
      <path d="M92 78 C92 140 108 182 130 202" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.35" />

      {/* stem */}
      <path d="M137 218 H163 L158 262 H142 Z" fill={`url(#${g('gold')})`} />
      <ellipse cx="150" cy="242" rx="16" ry="7" fill={`url(#${g('goldV')})`} />
      <rect x="116" y="262" width="68" height="14" rx="4" fill={`url(#${g('gold')})`} />
      <path d="M104 276 H196 L210 304 H90 Z" fill={`url(#${g('gold')})`} />

      {/* plinth */}
      <rect x="72" y="304" width="156" height="58" rx="6" fill={`url(#${g('plinth')})`} stroke="#f0b93a" strokeWidth="2" />
      <rect x="106" y="320" width="88" height="26" rx="3" fill={`url(#${g('gold')})`} opacity="0.95" />
      <text x="150" y="338" textAnchor="middle" fontFamily="'Barlow Condensed', sans-serif" fontWeight="800" fontSize="13" fill="#3b2203" letterSpacing="1.5">
        CHAMPIONS
      </text>

      {/* sparkles */}
      <g fill="#fff">
        {[
          [52, 120, 1],
          [250, 140, 0.8],
          [236, 46, 0.6],
          [62, 40, 0.7],
          [268, 230, 0.5],
        ].map(([x, y, s], i) => (
          <path
            key={i}
            transform={`translate(${x} ${y}) scale(${s})`}
            d="M0 -10 L2.5 -2.5 L10 0 L2.5 2.5 L0 10 L-2.5 2.5 L-10 0 L-2.5 -2.5 Z"
          />
        ))}
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Football                                                            */
/* ------------------------------------------------------------------ */
export function Football({ cx, cy, r, id }) {
  const pent = (x, y, size, rot) =>
    Array.from({ length: 5 }, (_, k) => {
      const a = ((rot + 72 * k) * Math.PI) / 180;
      return `${(x + size * Math.cos(a)).toFixed(2)},${(y + size * Math.sin(a)).toFixed(2)}`;
    }).join(' ');

  const inner = 0.34 * r;
  const centre = Array.from({ length: 5 }, (_, k) => {
    const a = ((-90 + 72 * k) * Math.PI) / 180;
    return { a, x: cx + inner * Math.cos(a), y: cy + inner * Math.sin(a) };
  });
  const outer = centre.map(({ a }) => ({
    a,
    x: cx + 0.98 * r * Math.cos(a),
    y: cy + 0.98 * r * Math.sin(a),
    deg: (a * 180) / Math.PI + 180,
  }));

  return (
    <g>
      <defs>
        <radialGradient id={`ball-${id}`} cx="0.38" cy="0.32" r="0.75">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#ece6f5" />
          <stop offset="1" stopColor="#a99bbf" />
        </radialGradient>
        <radialGradient id={`ballshade-${id}`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#1b0f33" stopOpacity="0.55" />
        </radialGradient>
        <clipPath id={`ballclip-${id}`}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={`url(#ball-${id})`} />
      <g clipPath={`url(#ballclip-${id})`} fill="#1a1024" stroke="#1a1024" strokeWidth={r * 0.03} strokeLinejoin="round">
        <polygon points={pent(cx, cy, inner, -90)} />
        {outer.map((o, i) => (
          <polygon key={i} points={pent(o.x, o.y, inner * 0.95, o.deg)} />
        ))}
        {centre.map((c, i) => {
          const o = outer[i];
          const ix = cx + 0.66 * r * Math.cos(c.a);
          const iy = cy + 0.66 * r * Math.sin(c.a);
          const n = outer[(i + 1) % 5];
          const nx = cx + 0.66 * r * Math.cos(n.a);
          const ny = cy + 0.66 * r * Math.sin(n.a);
          const mx = cx + 0.9 * r * Math.cos((c.a + n.a + (i === 4 ? 2 * Math.PI : 0)) / 2);
          const my = cy + 0.9 * r * Math.sin((c.a + n.a + (i === 4 ? 2 * Math.PI : 0)) / 2);
          return (
            <g key={`s${i}`} fill="none">
              <line x1={c.x} y1={c.y} x2={ix} y2={iy} />
              <polyline points={`${ix},${iy} ${mx},${my} ${nx},${ny}`} />
              <line x1={o.x} y1={o.y} x2={ix} y2={iy} opacity="0" />
            </g>
          );
        })}
      </g>
      <circle cx={cx} cy={cy} r={r} fill={`url(#ballshade-${id})`} />
      <ellipse cx={cx - r * 0.35} cy={cy - r * 0.42} rx={r * 0.28} ry={r * 0.16} fill="#fff" opacity="0.55" transform={`rotate(-30 ${cx - r * 0.35} ${cy - r * 0.42})`} />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Kickoff scene: ball on the centre spot under floodlights           */
/* ------------------------------------------------------------------ */
export function KickoffArt({ className = '' }) {
  const id = useId().replace(/:/g, '');
  const g = (n) => `${n}-${id}`;
  const stripes = 9;
  // perspective pitch: top edge y=190 (x 150..450), bottom edge y=380 (x -120..720)
  const lerp = (a, b, t) => a + (b - a) * t;
  const stripePolys = Array.from({ length: stripes }, (_, i) => {
    const t0 = i / stripes;
    const t1 = (i + 1) / stripes;
    return `${lerp(150, 450, t0)},190 ${lerp(150, 450, t1)},190 ${lerp(-120, 720, t1)},380 ${lerp(-120, 720, t0)},380`;
  });

  return (
    <svg viewBox="0 0 600 380" className={className} role="img" aria-label="Football on the centre spot of a floodlit pitch, ready for kickoff" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={g('sky')} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#05030a" />
          <stop offset="0.55" stopColor="#2a0b4a" />
          <stop offset="1" stopColor="#4b1381" />
        </linearGradient>
        <linearGradient id={g('turf')} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#0f3d22" />
          <stop offset="1" stopColor="#1f7a3e" />
        </linearGradient>
        <linearGradient id={g('beam')} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={g('spot')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ff3ea5" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ff3ea5" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={g('haze')} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#8b3dff" stopOpacity="0" />
          <stop offset="1" stopColor="#8b3dff" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      <rect width="600" height="380" fill={`url(#${g('sky')})`} />

      {/* stands silhouette with crowd lights */}
      <path d="M0 150 Q300 110 600 150 V200 H0 Z" fill="#12081f" />
      <g fill="#ff3ea5" opacity="0.5">
        {Array.from({ length: 40 }, (_, i) => (
          <circle key={i} cx={8 + i * 15} cy={150 - Math.sin((i / 39) * Math.PI) * 30 + ((i * 7) % 11)} r="1.2" />
        ))}
      </g>

      {/* floodlight towers + beams */}
      {[
        { x: 70, flip: 1 },
        { x: 530, flip: -1 },
      ].map(({ x, flip }) => (
        <g key={x}>
          <polygon points={`${x - 18},40 ${x + 18},40 ${430 + flip * 40},380 ${430 - flip * 200},380`} fill={`url(#${g('beam')})`} opacity="0.35" />
          <rect x={x - 2} y="50" width="4" height="110" fill="#1b0f33" />
          <rect x={x - 26} y="22" width="52" height="26" rx="3" fill="#1b0f33" stroke="#4b1381" />
          <g fill="#fff">
            {Array.from({ length: 12 }, (_, i) => (
              <circle key={i} cx={x - 19 + (i % 6) * 7.6} cy={30 + Math.floor(i / 6) * 10} r="2.6" />
            ))}
          </g>
          <circle cx={x} cy="35" r="38" fill="#fff" opacity="0.12" />
        </g>
      ))}

      {/* pitch */}
      <polygon points="150,190 450,190 720,380 -120,380" fill={`url(#${g('turf')})`} />
      <g fill="#fff" opacity="0.05">
        {stripePolys.filter((_, i) => i % 2 === 0).map((p, i) => (
          <polygon key={i} points={p} />
        ))}
      </g>
      <g fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="2">
        <polygon points="160,197 440,197 676,372 -76,372" />
        <line x1="22" y1="290" x2="578" y2="290" />
        <ellipse cx="430" cy="290" rx="110" ry="34" />
      </g>
      <rect x="0" y="190" width="600" height="190" fill={`url(#${g('haze')})`} />

      {/* glow + ball on centre spot */}
      <ellipse cx="430" cy="300" rx="110" ry="30" fill={`url(#${g('spot')})`} />
      <ellipse cx="434" cy="306" rx="38" ry="8" fill="#000" opacity="0.5" />
      <Football cx={430} cy={266} r={40} id={id} />

      {/* motion streaks */}
      <g stroke="#ff3ea5" strokeLinecap="round" opacity="0.7">
        <line x1="330" y1="250" x2="375" y2="250" strokeWidth="3" />
        <line x1="315" y1="266" x2="372" y2="266" strokeWidth="4" />
        <line x1="335" y1="282" x2="378" y2="282" strokeWidth="3" />
      </g>
    </svg>
  );
}
