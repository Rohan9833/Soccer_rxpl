// Reusable portrait iPhone frame. The original screenshot is rendered as-is
// (no overlays on its content, exact aspect ratio, no added status bar).
// Sizes use container-query units so the frame scales with its parent width.

const SCREEN_W = 1206;
const SCREEN_H = 2622;

const frameStyle = {
  borderRadius: '15.5cqw',
  padding: '3.4cqw',
  background:
    'linear-gradient(145deg, #4a4352 0%, #1a1620 22%, #2c2633 50%, #121016 78%, #3b3542 100%)',
  boxShadow:
    'inset 0 0 0 0.45cqw #08070a, inset 0 0 0 0.8cqw rgba(255,255,255,0.10), 0 0 0 0.25cqw rgba(255,255,255,0.08)',
};

export default function IPhoneMockup({
  src,
  alt,
  priority = false,
  className = '',
  glow = true,
  rotateScreen = false,
}) {
  return (
    <div className={`relative ${className}`} style={{ containerType: 'inline-size' }}>
      {glow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[12%] -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(194,29,143,0.45),rgba(139,61,255,0.18)_55%,transparent)] blur-2xl"
        />
      )}
      <div className="relative shadow-device" style={frameStyle}>
        {/* side buttons */}
        <span aria-hidden="true" className="absolute -left-[1.1%] top-[17%] h-[4.5%] w-[1.1%] rounded-l-sm bg-[#2a2530]" />
        <span aria-hidden="true" className="absolute -left-[1.1%] top-[25%] h-[8%] w-[1.1%] rounded-l-sm bg-[#2a2530]" />
        <span aria-hidden="true" className="absolute -left-[1.1%] top-[35%] h-[8%] w-[1.1%] rounded-l-sm bg-[#2a2530]" />
        <span aria-hidden="true" className="absolute -right-[1.1%] top-[28%] h-[12%] w-[1.1%] rounded-r-sm bg-[#2a2530]" />

        <div
          className="relative overflow-hidden bg-black"
          style={{ borderRadius: '12.4cqw', aspectRatio: `${SCREEN_W} / ${SCREEN_H}` }}
        >
          <img
            src={src}
            alt={alt}
            width={SCREEN_W}
            height={SCREEN_H}
            loading={priority ? 'eager' : 'lazy'}
            fetchpriority={priority ? 'high' : 'auto'}
            decoding="async"
            draggable={false}
            className={`block h-full w-full select-none object-contain transition-transform duration-700 ease-in-out ${rotateScreen ? 'rotate-90 scale-[1.45]' : 'rotate-0 scale-100'}`}
            style={{ transformOrigin: 'center center' }}
          />
          {/* Dynamic Island: sits in the blank centre of the screenshot's own status bar */}
          <span
            aria-hidden="true"
            className="absolute left-1/2 -translate-x-1/2 rounded-full bg-black"
            style={{ top: '2.7cqw', width: '29cqw', height: '8.4cqw' }}
          />
          {/* glass reflection: very subtle, kept off the content area's legibility */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(118deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 26%, rgba(255,255,255,0) 40%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
