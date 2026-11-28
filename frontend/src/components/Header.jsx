import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import { NAV_LINKS } from '../data/content';

export default function Header({ logoVisible = true }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the section currently in view
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-violet-royal/10 bg-white transition-shadow duration-300 ${
        scrolled || open ? 'shadow-[0_10px_30px_-12px_rgba(42,11,74,0.55)]' : ''
      }`}
    >
      <div className="container-x flex h-[72px] z-10 items-center justify-between gap-6">
        <a href="#top" aria-label="Sales Soccer: back to top" onClick={() => setOpen(false)}>
          <Logo
            plain
            imgClassName="h-10 sm:h-11"
            imgProps={{ 'data-header-logo': true, style: { opacity: logoVisible ? 1 : 0 } }}
          />
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  className={`relative rounded-full px-4 py-2 font-display text-[17px] font-semibold uppercase tracking-wider transition-colors ${
                    active === l.id ? 'text-violet-royal' : 'text-night-800/60 hover:text-violet-royal'
                  }`}
                >
                  {l.label}
                  {active === l.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-gradient"
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <img
            src="/assets/Productbydigilateral.png"
            alt="Product by digiLATERAL"
            className="h-7 w-auto max-w-[108px] object-contain sm:h-8"
          />
          <a href="#demo" className="btn-primary hidden !px-5 !py-2.5 !text-base sm:inline-flex">
            Request Demo
          </a>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-violet-royal/20 bg-violet-royal/5 text-violet-royal lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'calc(100dvh - 72px)' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden bg-white lg:hidden"
          >
            <ul className="container-x flex flex-col gap-1 pb-10 pt-4">
              {NAV_LINKS.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <a
                    href={`#${l.id}`}
                    onClick={() => setOpen(false)}
                    className="headline block border-b border-violet-royal/10 py-4 text-4xl text-violet-deep"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <li className="pt-8">
                <a href="#demo" onClick={() => setOpen(false)} className="btn-primary w-full">
                  Request Demo
                </a>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
