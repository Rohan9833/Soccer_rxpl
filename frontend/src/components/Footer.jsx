import { useState } from 'react';
import Logo from './Logo';
import Modal from './Modal';
import { LEGAL_LINKS, NAV_LINKS } from '../data/content';

function PrivacyPlaceholder({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="privacy-title" panelClassName="w-full max-w-lg">
      <div className="glass p-8">
        <h2 id="privacy-title" className="headline text-4xl">
          Privacy Policy
        </h2>
        <p className="mt-4 text-white/75">
          The full Privacy Policy for this website will be published here shortly.
        </p>
        <p className="mt-3 text-white/60">
          In brief: details submitted through the Request a Demo form are used only to respond to your enquiry about
          Sales Soccer.
        </p>
        <button type="button" onClick={onClose} className="btn-ghost mt-8">
          Close
        </button>
      </div>
    </Modal>
  );
}

export default function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 bg-night-950 pb-28 pt-16 sm:pb-12">
      <div className="container-x">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <Logo imgClassName="h-12" />
            <p className="headline mt-5 text-3xl">
              Dribble. Goal. <span className="text-gradient">Lead.</span>
            </p>
            <p className="mt-3 max-w-sm text-white/55">A football-style sales tournament for brand drives.</p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-3 font-display text-lg font-semibold uppercase tracking-wider">
            {NAV_LINKS.map((l) => (
              <a key={l.id} href={`#${l.id}`} className="text-white/60 transition hover:text-white">
                {l.label}
              </a>
            ))}
            <a href="#demo" className="text-pink-electric transition hover:text-white">
              Request a Demo
            </a>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
          <p>
            Sales Soccer is a product of{' '}
            <span className="font-bold tracking-tight text-white">
              digi<span className="text-pink-electric">LATERAL</span>
            </span>
            . © {year} digiLATERAL. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {LEGAL_LINKS.privacyPolicy ? (
              <a href={LEGAL_LINKS.privacyPolicy} className="transition hover:text-white" target="_blank" rel="noreferrer">
                Privacy Policy
              </a>
            ) : (
              <button type="button" onClick={() => setPrivacyOpen(true)} className="transition hover:text-white">
                Privacy Policy
              </button>
            )}
            <a href="#demo" className="transition hover:text-white">
              Contact us
            </a>
          </div>
        </div>
      </div>
      <PrivacyPlaceholder open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </footer>
  );
}
