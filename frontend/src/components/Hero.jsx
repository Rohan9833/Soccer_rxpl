import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Radio, Trophy, Users, Smartphone } from 'lucide-react';
import IPhoneMockup from './IPhoneMockup';
import { APP_SCREENS, ASSETS, TICKER_ITEMS } from '../data/content';

const home = APP_SCREENS.find((s) => s.id === 'home');

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] } }),
};

function FloatingChip({ className, children, delay = 0 }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1, y: reduce ? 0 : [0, -8, 0] }}
      transition={{
        opacity: { delay: 0.9 + delay, duration: 0.5 },
        scale: { delay: 0.9 + delay, duration: 0.5 },
        y: { delay: 1.4 + delay, duration: 5, repeat: Infinity, ease: 'easeInOut' },
      }}
      className={`glass absolute z-20 hidden items-center gap-2.5 !rounded-2xl px-4 py-3 text-sm font-semibold md:flex ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function Hero({ ready = true }) {
  return (
    <section id="top" className="relative isolate overflow-hidden pt-[72px]">
      {/* Stadium backdrop */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_15%_0%,#2a0b4a_0%,#0a0614_55%,#05030a_100%)]" />
        <img
          src={ASSETS.heroStadium}
          alt=""
          className="absolute right-0 top-0 h-full w-full object-cover object-[70%_center] opacity-70 lg:w-[68%] lg:opacity-90"
          style={{
            maskImage: 'linear-gradient(90deg, transparent 0%, #000 38%, #000 100%)',
            WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 38%, #000 100%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-night-950 via-night-950/75 to-transparent lg:via-night-950/40" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-night-950 to-transparent" />
        <div className="floodlight -left-40 top-10 bg-violet-glow" />
        <div className="floodlight right-0 top-[-200px] bg-magenta" />
      </div>

      <div className="container-x grid min-h-[calc(100svh-72px)] items-center gap-12 pb-16 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6 lg:pb-24">
        <div className="relative z-10 max-w-2xl">
          <motion.p variants={fadeUp} initial="hidden" animate={ready ? 'show' : 'hidden'} custom={0} className="eyebrow">
            <span className="h-px w-10 bg-pink-electric" />
            Dribble. Goal. Lead.
          </motion.p>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate={ready ? 'show' : 'hidden'}
            custom={1}
            className="headline mt-5 text-[clamp(3.1rem,8.4vw,6.6rem)]"
          >
            Make Your Brand Drive Feel Like{' '}
            <span className="text-gradient pr-2">Match Day.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={ready ? 'show' : 'hidden'}
            custom={2}
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl"
          >
            Turn everyday field-force activities into an exciting football-style tournament.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={ready ? 'show' : 'hidden'}
            custom={3}
            className="mt-9 flex flex-col gap-4 sm:flex-row"
          >
            <a href="#demo" className="btn-primary group">
              Request a Demo
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#app" className="btn-ghost group">
              <Smartphone size={20} className="text-pink-electric" />
              Explore the App
            </a>
          </motion.div>

          <motion.ul
            variants={fadeUp}
            initial="hidden"
            animate={ready ? 'show' : 'hidden'}
            custom={4}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-white/60"
          >
            {['A football-style sales tournament for brand drives', 'Built by digiLATERAL'].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-pink-electric" />
                {t}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Device */}
        <div className="relative mx-auto w-full max-w-[290px] sm:max-w-[320px] lg:mr-4 lg:max-w-[340px] xl:max-w-[360px]">
          <motion.div
            initial={{ opacity: 0, y: 60, rotate: 0 }}
            animate={ready ? { opacity: 1, y: 0, rotate: -5 } : { opacity: 0, y: 60, rotate: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 lg:[transform:perspective(1600px)_rotateY(-12deg)_rotateX(4deg)]"
          >
            <IPhoneMockup src={home.src} alt="Sales Soccer app: Home Dashboard screen" priority />
          </motion.div>

          <img
            src={ASSETS.playerSilhouette}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -left-28 -top-6 hidden w-36 opacity-90 drop-shadow-[0_0_24px_rgba(255,62,165,0.85)] lg:block"
          />

          {ready && (
            <>
          <FloatingChip className="-left-24 top-[32%]" delay={0}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="pulse-ring absolute inset-0 rounded-full bg-pink-electric" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-pink-electric" />
            </span>
            <Radio size={16} className="text-pink-electric" /> Live match scores
          </FloatingChip>
          <FloatingChip className="-right-10 top-[12%] xl:-right-16" delay={0.2}>
            <Users size={16} className="text-neon-cyan" /> Team vs Team
          </FloatingChip>
          <FloatingChip className="-right-6 bottom-[16%] xl:-right-12" delay={0.4}>
            <Trophy size={16} className="text-amber-300" /> Goal!
          </FloatingChip>
            </>
          )}
        </div>
      </div>

      {/* Broadcast ticker */}
      <div className="relative border-y border-white/10 bg-night-900/80 backdrop-blur">
        <div className="flex items-stretch">
          <div className="relative z-10 flex shrink-0 items-center gap-2 bg-brand-gradient px-4 font-display text-sm font-extrabold uppercase italic tracking-widest sm:px-6">
            <span className="h-2 w-2 rounded-full bg-white" /> Match Centre
          </div>
          <div className="relative flex-1 overflow-hidden py-3" aria-label="Sales Soccer features">
            <div className="ticker-track flex w-max gap-10 whitespace-nowrap pl-8">
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
                <span
                  key={i}
                  aria-hidden={i >= TICKER_ITEMS.length}
                  className="flex items-center gap-10 font-display text-lg font-bold uppercase tracking-widest text-white/70"
                >
                  {t}
                  <span className="text-pink-electric">●</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
