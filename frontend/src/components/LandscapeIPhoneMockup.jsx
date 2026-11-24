// Landscape iPhone frame for the Playground screenshot (2622 x 1206).
// Dimensions are expressed relative to the frame width (cqw) and mirror the
// portrait mockup's proportions rotated by 90 degrees.

const SCREEN_W = 2622;
const SCREEN_H = 1206;

const frameStyle = {
  borderRadius: '7.2cqw',
  padding: '1.6cqw',
  background:
    'linear-gradient(160deg, #4a4352 0%, #1a1620 22%, #2c2633 50%, #121016 78%, #3b3542 100%)',
  boxShadow:
    'inset 0 0 0 0.22cqw #08070a, inset 0 0 0 0.38cqw rgba(255,255,255,0.10), 0 0 0 0.12cqw rgba(255,255,255,0.08)',
};

export default function LandscapeIPhoneMockup({ src, alt, priority = false, className = '', glow = true }) {
  return (
    <div className={`relative ${className}`} style={{ containerType: 'inline-size' }}>
      {glow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[10%] -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(194,29,143,0.4),rgba(139,61,255,0.16)_55%,transparent)] blur-2xl"
        />
      )}
      <div className="relative shadow-device" style={frameStyle}>
        {/* side buttons (now along the top and bottom edges) */}
        <span aria-hidden="true" className="absolute -top-[2.2%] left-[17%] h-[2.2%] w-[4.5%] rounded-t-sm bg-[#2a2530]" />
        <span aria-hidden="true" className="absolute -top-[2.2%] left-[25%] h-[2.2%] w-[8%] rounded-t-sm bg-[#2a2530]" />
        <span aria-hidden="true" className="absolute -top-[2.2%] left-[35%] h-[2.2%] w-[8%] rounded-t-sm bg-[#2a2530]" />
        <span aria-hidden="true" className="absolute -bottom-[2.2%] left-[28%] h-[2.2%] w-[12%] rounded-b-sm bg-[#2a2530]" />

        <div
          className="relative overflow-hidden bg-black"
          style={{ borderRadius: '5.7cqw', aspectRatio: `${SCREEN_W} / ${SCREEN_H}` }}
        >
          <img
            src={src}
            alt={alt}
            width={SCREEN_W}
            height={SCREEN_H}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
            className="block h-full w-full select-none object-contain"
          />
          {/* Dynamic Island on the left edge, in the empty centre of the rotated status bar */}
          <span
            aria-hidden="true"
            className="absolute top-1/2 -translate-y-1/2 rounded-full bg-black"
            style={{ left: '1.25cqw', width: '3.85cqw', height: '13.3cqw' }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(150deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 22%, rgba(255,255,255,0) 36%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
