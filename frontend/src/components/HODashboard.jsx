import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { ICONS } from '../lib/icons';
import { HO_CAPABILITIES, ASSETS } from '../data/content';

// Conceptual Head Office dashboard. It is built in HTML, contains no figures,
// and is explicitly labelled as illustrative. It is not a product screenshot.

const NAV = ['Dashboard', 'Campaigns', 'Tournaments', 'Teams & Players', 'Approvals', 'Reports'];

function Sparkline({ d, color }) {
  return (
    <svg viewBox="0 0 120 36" className="mt-2 h-8 w-full" aria-hidden="true">
      <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function Skel({ w = 'w-20', className = '' }) {
  return <span className={`block h-2 rounded-full bg-white/15 ${w} ${className}`} />;
}

const STATUS = {
  Approved: 'bg-emerald-400/15 text-emerald-300',
  Pending: 'bg-amber-400/15 text-amber-200',
  Declined: 'bg-rose-500/15 text-rose-300',
};

function DashboardScreen() {
  return (
    <div className="flex h-full w-full bg-[#0d0819] text-[10px] text-white sm:text-[11px]">
      {/* Sidebar */}
      <aside className="hidden w-[19%] shrink-0 flex-col gap-1 border-r border-white/10 bg-[#120a24] p-3 sm:flex">
        <span className="mb-3 inline-flex w-fit rounded-md bg-white px-1.5 py-1">
          <img src={ASSETS.logoTrimmed} alt="" className="h-4 w-auto" />
        </span>
        {NAV.map((n, i) => (
          <span
            key={n}
            className={`rounded-md px-2 py-1.5 font-semibold ${i === 0 ? 'bg-brand-gradient text-white' : 'text-white/55'}`}
          >
            {n}
          </span>
        ))}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-2.5 p-3">
        {/* top bar */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-[13px] font-bold uppercase tracking-wider sm:text-[15px]">Head Office Portal</p>
            <p className="text-white/45">Campaign overview</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-white/15 px-2 py-1 text-white/70">Brand Drive ▾</span>
            <span className="hidden rounded-md bg-white/10 px-2 py-1 text-white/70 sm:inline">Download report</span>
            <span className="h-5 w-5 rounded-full bg-brand-gradient" />
          </div>
        </div>

        {/* KPI tiles: labels only, no values */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            ['Participation', 'M2 30 L25 24 L45 26 L65 16 L85 18 L118 6', '#ff3ea5'],
            ['Activity uploads', 'M2 28 L22 30 L42 18 L62 20 L82 10 L118 12', '#8b3dff'],
            ['Approvals', 'M2 20 L24 14 L44 22 L64 12 L86 16 L118 8', '#4fe3ff'],
            ['Live matches', 'M2 26 L20 18 L40 22 L60 10 L84 14 L118 4', '#facc15'],
          ].map(([label, d, c]) => (
            <div key={label} className="rounded-lg border border-white/10 bg-white/[0.04] p-2">
              <p className="text-white/55">{label}</p>
              <Sparkline d={d} color={c} />
            </div>
          ))}
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-2.5 sm:grid-cols-[1.3fr_1fr]">
          {/* Team standings */}
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2.5">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-semibold">Team standings</p>
              <span className="text-white/40">Tournament view</span>
            </div>
            <div className="space-y-2">
              {['Team A', 'Team B', 'Team C', 'Team D', 'Team E'].map((t, i) => (
                <div key={t} className="flex items-center gap-2">
                  <span className="w-3 text-white/40">{i + 1}</span>
                  <span className="w-12 shrink-0 text-white/80">{t}</span>
                  <span className="h-2 flex-1 rounded-full bg-white/10">
                    <span
                      className="block h-2 rounded-full bg-brand-gradient"
                      style={{ width: `${88 - i * 13}%` }}
                    />
                  </span>
                </div>
              ))}
            </div>
            {/* mini pitch */}
            <div className="relative mt-3 hidden h-14 overflow-hidden rounded-md bg-[linear-gradient(180deg,#1d7a3a,#15602d)] sm:block">
              <span className="absolute inset-1 rounded-sm border border-white/50" />
              <span className="absolute inset-y-1 left-1/2 border-l border-white/50" />
              <span className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50" />
              {[18, 34, 52, 66, 81].map((l, i) => (
                <span key={l} className="absolute h-2 w-2 rounded-full bg-pink-electric shadow-[0_0_8px_#ff3ea5]" style={{ left: `${l}%`, top: `${30 + (i % 3) * 18}%` }} />
              ))}
            </div>
          </div>

          {/* Approval queue */}
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2.5">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-semibold">Activity approvals</p>
              <span className="text-white/40">Queue</span>
            </div>
            <div className="space-y-1.5">
              {[
                ['Prescription', 'Pending'],
                ['Camp', 'Approved'],
                ['POB', 'Approved'],
                ['Conversion', 'Declined'],
                ['Prescription', 'Approved'],
              ].map(([a, s], i) => (
                <div key={i} className="flex items-center gap-2 rounded-md bg-white/[0.03] px-2 py-1.5">
                  <span className="h-4 w-4 shrink-0 rounded-full bg-white/15" />
                  <div className="min-w-0 flex-1">
                    <Skel w="w-16" />
                    <p className="mt-1 text-white/55">{a}</p>
                  </div>
                  <span className={`rounded-full px-1.5 py-0.5 font-semibold ${STATUS[s]}`}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Laptop() {
  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute -inset-8 -z-10 rounded-[50%] bg-[radial-gradient(closest-side,rgba(139,61,255,0.45),transparent)] blur-2xl" />
      {/* lid */}
      <div className="relative mx-auto w-[92%] rounded-t-[18px] border border-white/15 bg-gradient-to-b from-[#2a2531] to-[#141118] p-[1.6%] pb-[2.2%] shadow-device">
        <span aria-hidden="true" className="absolute left-1/2 top-[0.7%] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-black/70" />
        <div role="img" aria-label="Conceptual illustration of the Sales Soccer Head Office dashboard" className="relative aspect-[16/10] overflow-hidden rounded-md">
          <DashboardScreen />
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.06)_0%,transparent_35%)]" />
        </div>
      </div>
      {/* base */}
      <div className="relative mx-auto h-4 w-full rounded-b-[18px] rounded-t-sm bg-gradient-to-b from-[#3a3440] via-[#24202a] to-[#0f0d12] shadow-[0_30px_40px_-20px_rgba(0,0,0,0.9)] sm:h-5">
        <span aria-hidden="true" className="absolute left-1/2 top-0 h-1.5 w-[16%] -translate-x-1/2 rounded-b-lg bg-black/50" />
      </div>
    </div>
  );
}

export default function HODashboard() {
  return (
    <section id="command-centre" className="section">
      <div aria-hidden="true" className="floodlight -right-32 top-32 bg-magenta" />
      <div className="container-x relative">
        <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="eyebrow">Command Centre: Head Office Portal</p>
            <h2 className="headline mt-4 text-[clamp(2.6rem,6vw,4.6rem)]">
              Complete Visibility. <span className="text-gradient pr-2">Centralised Control.</span>
            </h2>
            <p className="mt-5 max-w-xl text-lg text-white/70">
              A separate Head Office portal gives pharma brand managers and authorised HO users a clear view of every
              brand drive, along with the controls to run it.
            </p>
            <ul className="mt-8 flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0 lg:space-y-3 lg:gap-0">
              {HO_CAPABILITIES.map((c, i) => {
                const Icon = ICONS[c.icon];
                return (
                  <motion.li
                    key={c.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className="flex min-w-[260px] gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 lg:min-w-0"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-pink-electric ring-1 ring-white/10">
                      <Icon size={20} />
                    </span>
                    <span>
                      <span className="block font-display text-xl font-bold uppercase tracking-wide">{c.title}</span>
                      <span className="text-white/65">{c.text}</span>
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8 }}
          >
            <Laptop />
            <p className="mt-6 flex items-center justify-center gap-2 text-center text-sm text-white/50">
              <Info size={15} aria-hidden="true" />
              Conceptual visual for illustration only. Not an actual product screen or campaign data.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
