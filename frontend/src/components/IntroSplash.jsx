import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { ASSETS } from '../data/content';

// Launch intro: the Sales Soccer logo fills a white screen, then glides into its
// place in the header while the white screen collapses into the top bar.
// Click / tap / any key skips it. Users who prefer reduced motion skip it entirely.

const HEADER_H = 72;
const HOLD_MS = 1500;
const MOVE_S = 0.9;
const EASE = [0.76, 0, 0.24, 1];

function headerLogoRect() {
  const el = document.querySelector('[data-header-logo]');
  return el ? el.getBoundingClientRect() : null;
}

export default function IntroSplash({ onReveal, onDone }) {
  const overlay = useAnimationControls();
  const logo = useAnimationControls();
  const extras = useAnimationControls();
  const [start, setStart] = useState(null);
  const finished = useRef(false);

  const wrap = useAnimationControls();

  // Reveal the page (header logo + hero), then fade the splash bar away and unmount
  const finish = async () => {
    if (finished.current) return;
    finished.current = true;
    document.body.style.overflow = '';
    onReveal();
    await wrap.start({ opacity: 0, transition: { duration: 0.35 } });
    onDone();
  };

  // Initial (centred, large) logo geometry
  useLayoutEffect(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const width = Math.min(vw * 0.72, 560);
    const height = width * (254 / 545);
    setStart({ width, left: (vw - width) / 2, top: (vh - height) / 2 - 24 });
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!start) return undefined;
    let cancelled = false;

    const run = async () => {
      await Promise.all([
        logo.start({ opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }),
        extras.start({ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.35 } }),
      ]);
      await new Promise((r) => setTimeout(r, HOLD_MS - 800));
      if (cancelled) return;

      const target = headerLogoRect();
      extras.start({ opacity: 0, y: -10, transition: { duration: 0.3 } });
      await Promise.all([
        overlay.start({ height: HEADER_H, transition: { duration: MOVE_S, ease: EASE } }),
        target
          ? logo.start({
              left: target.left,
              top: target.top,
              width: target.width,
              transition: { duration: MOVE_S, ease: EASE },
            })
          : logo.start({ opacity: 0, transition: { duration: 0.4 } }),
      ]);
      if (cancelled) return;
      finish();
    };
    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start]);

  // Skip on click / key press
  useEffect(() => {
    const skip = () => {
      overlay.stop();
      logo.stop();
      finish();
    };
    window.addEventListener('keydown', skip, { once: true });
    return () => window.removeEventListener('keydown', skip);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!start) return <div className="fixed inset-0 z-[300] bg-white" />;

  return (
    <motion.div
      className="fixed inset-0 z-[300]"
      animate={wrap}
      onClick={() => {
        overlay.stop();
        logo.stop();
        finish();
      }}
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-x-0 top-0 overflow-hidden bg-white"
        initial={{ height: '100%' }}
        animate={overlay}
      >
        {/* soft brand glow behind the logo */}
        <div
          className="pointer-events-none absolute left-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2"
          style={{ top: start.top + (start.width * (254 / 545)) / 2 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={extras}
            className="h-full w-full rounded-full bg-[radial-gradient(closest-side,rgba(194,29,143,0.16),rgba(139,61,255,0.08)_60%,transparent)]"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={extras}
          className="absolute inset-x-0 flex flex-col items-center"
          style={{ top: start.top + start.width * (254 / 545) + 28 }}
        >
          <span className="h-1 w-24 rounded-full bg-brand-gradient" />
          <p className="mt-4 font-display text-xl font-bold uppercase tracking-[0.35em] text-violet-royal sm:text-2xl">
            Dribble. Goal. Lead.
          </p>
        </motion.div>
      </motion.div>

      <motion.img
        src={ASSETS.logoTrimmed}
        alt=""
        className="pointer-events-none fixed h-auto origin-center"
        style={{ left: start.left, top: start.top, width: start.width }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={logo}
      />
    </motion.div>
  );
}
