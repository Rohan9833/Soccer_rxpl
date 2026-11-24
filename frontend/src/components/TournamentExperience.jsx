import { motion } from 'framer-motion';
import { Shield, ChevronDown, Info } from 'lucide-react';
import { BRACKET } from '../data/content';
import { TrophyArt } from './Artwork';

const BADGE_COLORS = ['#8b3dff', '#e0249c', '#4fe3ff', '#ff8a3d', '#22c55e', '#facc15', '#ff3ea5', '#a78bfa'];
const allTeams = BRACKET.league.flat();
const colorFor = (team) => BADGE_COLORS[allTeams.indexOf(team) % BADGE_COLORS.length];

function Team({ name }) {
  const initials = name.split(' ').map((w) => w[0]).join('');
  return (
    <div className="flex items-center gap-2.5">
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center">
        <Shield size={32} strokeWidth={1.5} style={{ color: colorFor(name), fill: `${colorFor(name)}33` }} />
        <span className="absolute font-display text-[11px] font-extrabold">{initials}</span>
      </span>
      <span className="whitespace-nowrap text-[19px] font-semibold text-white/90">{name}</span>
    </div>
  );
}

function MatchCard({ teams, highlight = false }) {
  return (
    <div
      className={`relative rounded-2xl border p-4 mt-5 backdrop-blur-xl ${
        highlight
          ? 'border-pink-electric/60 bg-gradient-to-br from-magenta/25 to-violet-royal/30 shadow-glow'
          : 'border-white/10 bg-white/[0.05]'
      }`}
    >
      <Team name={teams[0]} />
      <div className="my-3 flex items-center gap-2 pl-1">
        <span className="h-px flex-1 bg-white/10" />
        <span className="font-display text-[12px] font-bold uppercase tracking-widest text-pink-electric">vs</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>
      <Team name={teams[1]} />
    </div>
  );
}

function GroupCard({ teams, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl">
      <p className="mb-3 text-center font-display text-[13px] font-bold uppercase tracking-[0.2em] text-white/50">{label}</p>
      <div className="space-y-3.5">
        {teams.map((t) => (
          <Team key={t} name={t} />
        ))}
      </div>
    </div>
  );
}

function Trophy() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative flex flex-col items-center justify-center overflow-hidden rounded-[28px] border border-amber-200/30 bg-[radial-gradient(120%_90%_at_50%_30%,#4b1381_0%,#1b0f33_55%,#0a0614_100%)] shadow-[0_0_80px_-20px_rgba(251,191,36,0.6)] w-full h-[300px]"
    >
      <TrophyArt className="h-48 w-auto" />
      <p className="headline mt-2 text-center text-2xl text-amber-100">Lift the trophy</p>
    </motion.div>
  );
}

const STAGES = ['League Matches', 'Quarterfinals', 'Semifinals', 'Finals'];

// Shared bracket structure used for both mobile (scaled) and desktop
function BracketLayout() {
  return (
    <div className="flex flex-col w-[1100px]">
      {/* Labels */}
      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_0.9fr] gap-8 mb-6">
        {STAGES.map((s) => (
          <p key={s} className="text-center font-display text-[25px] font-bold uppercase tracking-[0.2em] text-white/70">
            {s}
          </p>
        ))}
        <p className="text-center font-display text-[28px] font-light uppercase tracking-[0.2em] text-amber-200">Champions</p>
      </div>

      {/* Bracket Body */}
      <div className="grid h-[520px] grid-cols-[1fr_1fr_1fr_1fr_0.9fr] gap-4">
        {/* League */}
        <div className="flex flex-col justify-around">
          {BRACKET.league.map((g, i) => (
            <GroupCard key={i} teams={g} label={`Group ${String.fromCharCode(65 + i)}`} />
          ))}
        </div>
        
        {/* QF */}
        <div className="flex flex-col justify-around">
          {BRACKET.quarterfinals.map((m, i) => (
            <MatchCard key={i} teams={m} />
          ))}
        </div>
        
        {/* SF */}
        <div className="flex flex-col justify-around">
          {BRACKET.semifinals.map((m, i) => (
            <MatchCard key={i} teams={m} />
          ))}
        </div>

        {/* Final */}
        <div className="flex flex-col justify-center">
          <MatchCard teams={BRACKET.final} highlight />
        </div>

        {/* Trophy */}
        <div className="flex items-center justify-center">
          <Trophy />
        </div>
      </div>
    </div>
  );
}

function DesktopBracket() {
  return (
    <div className="hidden lg:flex justify-center">
      <BracketLayout />
    </div>
  );
}

function MobileBracket() {
  // We render the exact desktop layout but scale it down to fit a mobile screen.
  // 1100px scaled by 0.34 = 374px, which fits perfectly on a 375px phone.
  return (
    <div className="lg:hidden h-[250px] w-full flex justify-center overflow-hidden py-2">
      <div 
        className="origin-top flex justify-center w-full"
        style={{ transform: 'scale(0.34)', transformOrigin: 'top center' }}
      >
        <BracketLayout />
      </div>
    </div>
  );
}

export default function TournamentExperience() {
  return (
    <section id="tournament" className="section bg-[linear-gradient(180deg,#05030a_0%,#120a22_40%,#0a0614_100%)]">
      <div aria-hidden="true" className="absolute inset-0 turf-stripes opacity-60" />
      <div aria-hidden="true" className="floodlight -left-40 bottom-0 bg-magenta" />
      <div className="container-x relative">
        <div className="max-w-3xl">
          <p className="eyebrow">The Tournament Experience</p>
          <h2 className="headline mt-4 text-[clamp(2.6rem,6vw,4.8rem)]">
            Every Brand Drive. <span className="text-gradient pr-2">A New Tournament.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-lg text-white/70">
            Run brand campaigns as organised competitions. Teams from different territories and regions go head to head,
            round after round, from the league stage all the way to the final.
          </p>
        </div>

        <div className="tournament-brackets mt-14">
          <DesktopBracket />
          <MobileBracket />
        </div>

        <p className="mt-8 flex items-start gap-2 text-sm text-white/45">
          <Info size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          Illustrative tournament. Team names are examples only and do not represent client campaigns or results.
        </p>
      </div>
    </section>
  );
}