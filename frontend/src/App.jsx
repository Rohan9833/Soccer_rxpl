import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import GameExperience from './components/GameExperience';
import TournamentExperience from './components/TournamentExperience';
import AppShowcase from './components/AppShowcase';
import HODashboard from './components/HODashboard';
import Benefits from './components/Benefits';
import DemoForm from './components/DemoForm';
import Footer from './components/Footer';
import IntroSplash from './components/IntroSplash';

// Mobile-only sticky CTA: visible after the hero, hidden once the demo form is on screen.
function StickyDemoCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let pastHero = false;
    let formVisible = false;
    const update = () => setShow(pastHero && !formVisible);
    const onScroll = () => {
      pastHero = window.scrollY > window.innerHeight * 0.8;
      update();
    };
    const demo = document.getElementById('demo');
    const io = new IntersectionObserver(([e]) => {
      formVisible = e.isIntersecting;
      update();
    });
    if (demo) io.observe(demo);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: 'spring', damping: 24, stiffness: 260 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-night-950/85 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:hidden"
        >
          <a href="#demo" className="btn-primary w-full !py-3">
            Request a Demo <ArrowRight size={18} />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const prefersReducedMotion = () => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
};

export default function App() {
  // Launch intro plays on every fresh page load (skipped for reduced-motion users)
  const [introDone, setIntroDone] = useState(prefersReducedMotion);
  const [splashMounted, setSplashMounted] = useState(() => !prefersReducedMotion());
  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-night-950"
      >
        Skip to content
      </a>
      <Header logoVisible={introDone} />
      <main id="main">
        <Hero ready={introDone} />
        <GameExperience />
        <TournamentExperience />
        <AppShowcase />
        <HODashboard />
        <Benefits />
        <DemoForm />
      </main>
      <Footer />
      <StickyDemoCTA />
      {splashMounted && <IntroSplash onReveal={() => setIntroDone(true)} onDone={() => setSplashMounted(false)} />}
    </MotionConfig>
  );
}
