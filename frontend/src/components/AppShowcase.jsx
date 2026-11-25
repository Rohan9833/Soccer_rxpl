import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Smartphone, RotateCcw, Sparkles } from 'lucide-react';
import IPhoneMockup from './IPhoneMockup';
import LandscapeIPhoneMockup from './LandscapeIPhoneMockup';
import { APP_SCREENS } from '../data/content';

const total = APP_SCREENS.length;

function Device({ screen, priority }) {
  const alt = `Sales Soccer app: ${screen.title} screen`;
  return screen.orientation === 'landscape' ? (
    <LandscapeIPhoneMockup src={screen.src} alt={alt} priority={priority} className="w-full max-w-[640px]" />
  ) : (
    <IPhoneMockup
      src={screen.src}
      alt={alt}
      priority={priority}
      className="w-[min(68vw,280px)] sm:w-[290px] lg:w-[min(300px,calc((100svh-260px)*0.44))] lg:min-w-[250px]"
    />
  );
}

export default function AppShowcase() {
  const [[index, direction], setState] = useState([0, 0]);
  const reduce = useReducedMotion();
  const tabRefs = useRef([]);
  const mobileTabsRef = useRef(null);  const mobileSwipeStart = useRef(null);
  const screen = APP_SCREENS[index];
  const [mobileLandscape, setMobileLandscape] = useState(false);

  // On the final mobile showcase screen, repeatedly rotate only the screenshot:
  // hold portrait for 1.5s, landscape for 4s, then repeat.
  useEffect(() => {
    setMobileLandscape(false);
    if (screen.orientation !== 'landscape') return undefined;

    let timer;
    const cycle = () => {
      timer = window.setTimeout(() => {
        setMobileLandscape(true);
        timer = window.setTimeout(() => {
          setMobileLandscape(false);
          cycle();
        }, 6000);
      }, 2500);
    };

    cycle();
    return () => window.clearTimeout(timer);
  }, [screen.id, screen.orientation]);

  const go = useCallback((next) => {
    setState(([cur]) => {
      const n = (next + total) % total;
      return [n, n > cur || (cur === total - 1 && n === 0) ? 1 : -1];
    });
  }, []);

  // Preload neighbouring screenshots so switching feels instant
  useEffect(() => {
    [index + 1, index - 1].forEach((i) => {
      const img = new Image();
      img.src = APP_SCREENS[(i + total) % total].src;
    });
  }, [index]);

  // Keep the active mobile chip in view
  useEffect(() => {
    const strip = mobileTabsRef.current;
    const el = strip?.querySelector(`[data-index="${index}"]`);
    if (!strip || !el || strip.offsetParent === null) return;
    const left = el.offsetLeft - (strip.clientWidth - el.clientWidth) / 2;
    strip.scrollTo({ left, behavior: reduce ? 'auto' : 'smooth' });
  }, [index, reduce]);

  const onTabKey = (e) => {
    if (['ArrowDown', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
      go(index + 1);
      tabRefs.current[(index + 1) % total]?.focus();
    } else if (['ArrowUp', 'ArrowLeft'].includes(e.key)) {
      e.preventDefault();
      go(index - 1);
      tabRefs.current[(index - 1 + total) % total]?.focus();
    }
  };

  const variants = {
    enter: (d) => ({ opacity: 0, x: reduce ? 0 : d * 80, scale: reduce ? 1 : 0.96 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d) => ({ opacity: 0, x: reduce ? 0 : d * -80, scale: reduce ? 1 : 0.96 }),
  };

  return (
    <section id="app" className="section">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_45%,rgba(75,19,129,0.55),transparent_70%)]" />
      <div className="container-x relative">
        {/* Mobile reference layout */}
        <div className="app-showcase-mobile-reference md:hidden">
          <div className="app-mobile-intro">
            <p className="eyebrow">Sales Experience</p>
            <h2 className="headline">Experience Sales<br />Soccer <span className="text-gradient">in Action.</span></h2>
            <p>A simple, mobile-first experience for your field force to perform, compete, and grow.</p>
          </div>
          <div className="app-mobile-showcase-grid">
            <div
              className="app-mobile-phone"
              onTouchStart={(event) => {
                mobileSwipeStart.current = event.changedTouches[0]?.clientX ?? null;
              }}
              onTouchEnd={(event) => {
                const startX = mobileSwipeStart.current;
                const endX = event.changedTouches[0]?.clientX;
                mobileSwipeStart.current = null;
                if (startX == null || endX == null) return;
                const delta = endX - startX;
                if (Math.abs(delta) > 45) go(delta < 0 ? index + 1 : index - 1);
              }}
            >
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={screen.id}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full"
                >
                  <IPhoneMockup src={screen.src} alt={`Sales Soccer app: ${screen.title} screen`} priority={index === 0} rotateScreen={mobileLandscape} />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="app-mobile-right-column">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={screen.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                  className="app-mobile-upload-card app-mobile-screen-info"
                >
                  <div className="app-mobile-upload-icon"><Sparkles /></div>
                  <p className="app-mobile-screen-count">Screen {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</p>
                  <h3>{screen.title}</h3>
                  <p className="app-mobile-screen-description">{screen.description}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div className="app-mobile-navigation">
            <button type="button" className="app-mobile-nav-arrow" onClick={() => go(index - 1)} aria-label="Previous screen"><ChevronLeft size={22} /></button>
            <div className="app-mobile-dots" role="tablist" aria-label="Choose app screen">
              {APP_SCREENS.map((s, i) => (
                <button key={s.id} type="button" role="tab" aria-selected={i === index} aria-label={s.title} onClick={() => go(i)} />
              ))}
            </div>
            <button type="button" className="app-mobile-nav-arrow" onClick={() => go(index + 1)} aria-label="Next screen"><ChevronRight size={22} /></button>
          </div>
        </div>

        <div className="app-showcase-existing-intro mx-auto max-w-3xl text-center">
          <p className="eyebrow justify-center">
            <Smartphone size={16} /> Explore the Sales Soccer App
          </p>
          <h2 className="headline mt-4 text-[clamp(2.6rem,6vw,4.8rem)]">
            Experience Sales Soccer <span className="text-gradient pr-2">in Action.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
            Real screens from the Sales Soccer mobile app, used by medical representatives in the field.
          </p>
        </div>

        {/* Mobile / tablet chip tabs */}
        <div ref={mobileTabsRef} className="app-showcase-existing-tabs no-scrollbar -mx-5 mt-10 flex gap-2 overflow-x-auto px-5 lg:hidden" role="tablist" aria-label="App screens">
          {APP_SCREENS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              data-index={i}
              aria-selected={i === index}
              aria-controls="app-stage"
              onClick={() => go(i)}
              className={`shrink-0 rounded-full border px-4 py-2 font-display text-base font-bold uppercase tracking-wider transition ${
                i === index ? 'border-transparent bg-brand-gradient text-white shadow-glow' : 'border-white/15 bg-white/5 text-white/70'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>

        <div className="app-showcase-existing-layout mt-8 grid items-center gap-10 lg:mt-16 lg:grid-cols-[270px_minmax(0,1fr)_300px] lg:gap-10">
          {/* Desktop tab list */}
          <div role="tablist" aria-orientation="vertical" aria-label="App screens" className="hidden flex-col gap-1.5 lg:flex" onKeyDown={onTabKey}>
            {APP_SCREENS.map((s, i) => (
              <button
                key={s.id}
                ref={(el) => (tabRefs.current[i] = el)}
                type="button"
                role="tab"
                id={`tab-${s.id}`}
                aria-selected={i === index}
                aria-controls="app-stage"
                tabIndex={i === index ? 0 : -1}
                onClick={() => go(i)}
                className={`group relative flex items-center gap-4 rounded-2xl px-4 py-3 text-left transition ${
                  i === index ? 'bg-white/[0.07]' : 'hover:bg-white/[0.04]'
                }`}
              >
                {i === index && (
                  <motion.span layoutId="tab-indicator" className="absolute inset-y-2 left-0 w-1 rounded-full bg-brand-gradient" />
                )}
                <span className={`font-display text-lg font-bold ${i === index ? 'text-pink-electric' : 'text-white/35'}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={`font-display text-xl font-bold uppercase tracking-wide ${i === index ? 'text-white' : 'text-white/60 group-hover:text-white/85'}`}>
                  {s.title}
                </span>
                {s.orientation === 'landscape' && (
                  <RotateCcw size={14} className="ml-auto text-white/40" aria-label="Landscape screen" />
                )}
              </button>
            ))}
          </div>

          {/* Stage */}
          <div className="relative">
            <div
              id="app-stage"
              role="tabpanel"
              aria-live="polite"
              aria-label={`${screen.title} (${index + 1} of ${total})`}
              className="relative flex min-h-[min(150vw,620px)] items-center justify-center sm:min-h-[650px] lg:min-h-[min(680px,calc(100svh-140px))]"
            >
              <div aria-hidden="true" className="absolute bottom-[4%] left-1/2 h-10 w-2/3 -translate-x-1/2 rounded-[50%] bg-black/70 blur-2xl" />
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                  key={screen.id}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.25}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -60 || info.velocity.x < -400) go(index + 1);
                    else if (info.offset.x > 60 || info.velocity.x > 400) go(index - 1);
                  }}
                  className="flex w-full cursor-grab touch-pan-y justify-center active:cursor-grabbing"
                >
                  <Device screen={screen} priority={index === 0} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Arrows + dots */}
            <div className="mt-6 flex items-center justify-center gap-5">
              <button type="button" onClick={() => go(index - 1)} aria-label="Previous screen" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 transition hover:border-pink-electric/60 hover:bg-white/10">
                <ChevronLeft size={22} />
              </button>
              <div className="flex items-center gap-2" aria-hidden="true">
                {APP_SCREENS.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    tabIndex={-1}
                    onClick={() => go(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-brand-gradient' : 'w-2 bg-white/25 hover:bg-white/50'}`}
                  />
                ))}
              </div>
              <button type="button" onClick={() => go(index + 1)} aria-label="Next screen" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 transition hover:border-pink-electric/60 hover:bg-white/10">
                <ChevronRight size={22} />
              </button>
            </div>
          </div>

          {/* Info panel */}
          <div className="glass p-7 text-center lg:text-left">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={screen.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-white/45">
                  Screen {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </p>
                <h3 className="headline mt-3 text-4xl">{screen.title}</h3>
                <p className="mt-4 text-lg leading-relaxed text-white/75">{screen.description}</p>
                <ul className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
                  {screen.tags.map((t) => (
                    <li key={t} className="rounded-full border border-pink-electric/30 bg-pink-electric/10 px-3 py-1 text-sm font-semibold text-pink-100">
                      {t}
                    </li>
                  ))}
                </ul>
                {screen.orientation === 'landscape' && (
                  <p className="mt-5 flex items-center justify-center gap-2 text-sm text-white/50 lg:justify-start">
                    <RotateCcw size={14} /> Landscape view in the app
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <p className="mt-10 text-center text-sm text-white/40">Swipe or use the arrows to explore.</p>
      </div>
    </section>
  );
}
